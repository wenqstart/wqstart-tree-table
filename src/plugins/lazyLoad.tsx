import {
  INTERNAL_IS_LOADING,
  INTERNAL_LOADING_KEY,
} from 'wqstart-tree-table/constant';

/*
 * @Author: wqstart
 * @Date: 2024-09-23 16:13:49
 * @LastEditors: wqstart
 * @LastEditTime: 2024-09-25 16:53:27
 * @Description: 文件简介
 */
export const generateInternalLoadingNode = (rowKey: string) => ({
  [rowKey]: `${INTERNAL_LOADING_KEY}_${Math.random()}`,
});
export const useLazyLoadPlugin =
  (lazyLoadOptions: any) => (props: any, context: any) => {
    const { hasNextKey, onLoad } = lazyLoadOptions;
    const { childrenColumnName, rowKey } = props;
    const {
      forceUpdate,
      replaceChildList,
      expandedRowKeys,
      setExpandedRowKeys,
    } = context;
    function handleAddNextLevelLoader(treeNode: any) {
      if (treeNode?.[hasNextKey]) {
        // 树表格组件要求 next 必须是非空数组才会渲染「展开按钮」
        // 所以这里手动添加一个占位节点数组
        // 后续在 onExpand 的时候再加载更多节点 并且替换这个数组
        treeNode[childrenColumnName] = [generateInternalLoadingNode(rowKey)];
      }
    }

    async function handleExpand(expanded: any, record: any) {
      // 保证每次点击展开都会重新获取下级数据（可选）
      if (!expanded) {
        record[hasNextKey] = true;
      }
      if (expanded && record?.[hasNextKey] && onLoad) {
        const originalHasNext = record[hasNextKey];
        const originalChildren = record[childrenColumnName];
        // 标识节点的 loading
        record[INTERNAL_IS_LOADING] = true;
        // 移除用来展示展开箭头的假 children
        record[childrenColumnName] = null;
        forceUpdate();
        try {
          const childList = await onLoad(record);
          record[hasNextKey] = false;
          replaceChildList(record, childList);
        } catch (error) {
          // 加载数据错误的时候 恢复原本的节点状态
          record[hasNextKey] = originalHasNext;
          record[childrenColumnName] = originalChildren;
          // 把正在加载的 key 移除
          setExpandedRowKeys(
            expandedRowKeys.filter(
              (key: string) => key !== INTERNAL_LOADING_KEY,
            ),
          );
        }
      }
    }

    return {
      key: 'lazyLoad',
      onRecord: handleAddNextLevelLoader,
      onExpand: handleExpand,
    };
  };
