import { Pagination, Table } from 'antd';
import React, {
  useEffect,
  useReducer,
  // useReducer,
  // useImperativeHandle,
  useState,
} from 'react';
import {
  INTERNAL_CHILDREN_COLUMN_NAME,
  INTERNAL_INDENT_SIZE,
  INTERNAL_IS_LOADING,
  INTERNAL_LEVEL,
  INTERNAL_LOADING_KEY,
  INTERNAL_PAGINATION_CURRENT,
  INTERNAL_PAGINATION_KEY,
  INTERNAL_PARENT,
} from './constant';
import { IndentCell } from './IndentCell';
import './index.css';
import { TreeTableExpandIcon } from './TreeTableExpandIcon';
import { traverseTree } from './util';
export const generateInternalLoadingNode = (rowKey: string) => ({
  [rowKey]: `${INTERNAL_LOADING_KEY}_${Math.random()}`,
});
export const isInternalPaginationNode = (record: any, rowKey: string) => {
  return record?.[rowKey]?.startsWith?.(INTERNAL_PAGINATION_KEY);
};
export const generateInternalPaginationNode = (rowKey: string) => ({
  [rowKey]: `${INTERNAL_PAGINATION_KEY}-${Math.random()}`,
});

function TreeTable(rawProps: any) {
  const defaultTableProps = {
    pagination: false,
  };
  // 重新整理 props
  function resolveProps(props: any) {
    let {
      rowKey = 'id',
      columns,
      headDataIndex = columns[0]?.dataIndex,
    } = props;
    return {
      ...props,
      rowKey,
      headDataIndex,
    };
  }
  const props = resolveProps(rawProps);
  const {
    columns,
    dataSource,
    rowKey,
    headDataIndex,
    expandable,
    lazyLoadProps,
    paginationOptions,
    ...restProps
  } = props;
  const [internalExpandedRowKeys, setInternalExpandedRowKeys] = useState([]);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  // *初始化懒加载属性
  let hasNextKey: any;
  let onLoad: any;
  if (lazyLoadProps) {
    const { hasNextKey: has_next_key, onLoad: on_load } = lazyLoadProps;
    hasNextKey = has_next_key;
    onLoad = on_load;
  }
  // *初始化 expandable 属性
  let expandedRowKeys: any[];
  let indentSize;
  let childrenColumnName: string;
  let setExpandedRowKeys: any;
  let expandIcon: any;
  let restExpandableProps;
  let onExpandProp: any;

  // 有 expandable 属性
  if (expandable && expandable?.expandedRowKeys) {
    const {
      expandedRowKeys: expandableExpandedRowKeys,
      onExpandedRowsChange: expandableOnExpandedRowsChange,
      onExpand: expandableOnExpand,
      expandIcon: expandableExpandIcon,
      indentSize: expandableIndentSize = INTERNAL_INDENT_SIZE,
      childrenColumnName:
        expandableChildrenColumnName = INTERNAL_CHILDREN_COLUMN_NAME,
      ...restProps
    } = expandable;
    expandedRowKeys = expandableExpandedRowKeys;
    setExpandedRowKeys = expandableOnExpandedRowsChange;
    expandIcon = expandableExpandIcon;
    onExpandProp = expandableOnExpand;
    restExpandableProps = restProps;
    indentSize = expandableIndentSize;
    childrenColumnName = expandableChildrenColumnName;
  } else {
    expandedRowKeys = internalExpandedRowKeys;
    setExpandedRowKeys = setInternalExpandedRowKeys;
    indentSize = INTERNAL_INDENT_SIZE;
    childrenColumnName = INTERNAL_CHILDREN_COLUMN_NAME;
  }
  // 自定义单元格内容
  const components = {
    body: {
      cell: (cellProps: any) => {
        return (
          <IndentCell
            {...cellProps}
            {...props}
            expandedRowKeys={expandedRowKeys}
            indentSize={indentSize}
          />
        );
      },
    },
  };
  function rewriteTree({
    dataSource = [] as any[],
    // 在动态追加子树节点的时候 需要手动传入 parent 引用
    parentNode = null as any,
  }) {
    // 在动态追加子树节点的时候 需要手动传入父节点的 level 否则 level 会从 1 开始计算
    const startLevel = parentNode?.[INTERNAL_LEVEL] || 0;
    // 切换分页器替换掉子数组时需要重新给父节点添加分页器标识
    if (parentNode) {
      // 分页逻辑
      if (paginationOptions) {
        const { totalKey } = paginationOptions;
        const nodeChildren = parentNode[childrenColumnName] || [];
        const [lastChildNode] = nodeChildren.slice?.(-1);
        // 渲染分页器，先加入占位节点
        if (
          // totalKey代表总数，nodeChildren代表当前页下的子节点数组
          parentNode?.[totalKey] > nodeChildren?.length &&
          // 防止重复添加分页器占位符：如多次调用 rewriteTree 函数
          !isInternalPaginationNode(lastChildNode, rowKey)
        ) {
          console.log('push', parentNode);

          nodeChildren?.push?.(generateInternalPaginationNode(rowKey));
        }
      }
    }
    traverseTree(
      dataSource,
      childrenColumnName,
      (treeNode: any, parent: any, level: number) => {
        // 记录节点的层级
        treeNode[INTERNAL_LEVEL] = level + startLevel;
        // 记录节点的父节点
        treeNode[INTERNAL_PARENT] = parent || parentNode;
        if (treeNode?.[hasNextKey]) {
          // 树表格组件要求 next 必须是非空数组才会渲染「展开按钮」
          // 所以这里手动添加一个占位节点数组
          // 后续在 onExpand 的时候再加载更多节点 并且替换这个数组
          treeNode[childrenColumnName] = [generateInternalLoadingNode(rowKey)];
        }
        // 分页逻辑
        if (paginationOptions) {
          const { totalKey } = paginationOptions;
          const nodeChildren = treeNode[childrenColumnName] || [];
          const [lastChildNode] = nodeChildren.slice?.(-1);
          // 渲染分页器，先加入占位节点
          if (
            // totalKey代表总数，nodeChildren代表当前页下的子节点数组
            treeNode?.[totalKey] > nodeChildren?.length &&
            // 防止重复添加分页器占位符：如多次调用 rewriteTree 函数
            !isInternalPaginationNode(lastChildNode, rowKey)
          ) {
            console.log('push', treeNode);

            nodeChildren?.push?.(generateInternalPaginationNode(rowKey));
          }
        }
      },
    );
  }
  function replaceChildList(record: any, childList: any) {
    record[childrenColumnName] = childList;
    record[INTERNAL_IS_LOADING] = false;
    rewriteTree({
      dataSource: childList,
      parentNode: record,
    });
    forceUpdate();
  }
  // *给每一列每个单元格添加 record 属性
  const rewrittenColumns = columns?.map((column: any) => {
    const { render, dataIndex } = column;
    return {
      ...column,
      onCell: (record: any) => {
        return {
          record,
          ...column,
        };
      },
      render: (text: any, record: any) => {
        if (paginationOptions) {
          const { totalKey, pageSize, onChange } = paginationOptions;
          // 从父节点拿分页信息
          const parentRecord = record[INTERNAL_PARENT];
          const total = parentRecord?.[totalKey];
          // 是分页占位符
          if (isInternalPaginationNode(record, rowKey)) {
            // 第一个字段才需要渲染分页器，其余的返回 null
            if (dataIndex === headDataIndex) {
              const onPageChange = async (current: any) => {
                parentRecord[INTERNAL_PAGINATION_CURRENT] = current;
                parentRecord[INTERNAL_IS_LOADING] = true;
                forceUpdate();
                const childList = await onChange(current, parentRecord);
                replaceChildList(parentRecord, childList);
              };
              return (
                <Pagination
                  size="small"
                  total={total}
                  defaultCurrent={parentRecord[INTERNAL_PAGINATION_CURRENT]}
                  pageSize={pageSize}
                  onChange={onPageChange}
                />
              );
            } else return null;
          }
        }
        return render?.(text, record) ?? text;
      },
    };
  });

  // 点击展开图标时触发
  async function onExpand(expanded: any, record: any) {
    console.log('expanded, record', expanded, record);
    if (expanded && record?.[hasNextKey] && onLoad) {
      const originalHasNext = record[hasNextKey];
      const originalChildren = record[childrenColumnName];

      // 标识节点的 loading
      record[INTERNAL_IS_LOADING] = true;
      // 移除用来展示展开箭头的假 children
      record[childrenColumnName] = null;
      // *强制渲染
      forceUpdate();
      try {
        const childList = await onLoad(record);
        record[hasNextKey] = false;
        replaceChildList(record, childList);
      } catch (error) {
        // 加载数据错误的时候 恢复原本的节点状态
        record[hasNextKey] = originalHasNext;
        record[childrenColumnName] = originalChildren;
        // setExpandedRowKeys(
        //   expandedRowKeys.filter((key: string) => key !== INTERNAL_LOADING_KEY),
        // );
      }
    }
    onExpandProp?.(expanded, record);
  }

  useEffect(() => {
    rewriteTree({ dataSource });
  }, [dataSource]);
  return (
    <div className="wqstart-tree-table">
      <Table
        {...defaultTableProps}
        {...restProps}
        dataSource={dataSource}
        components={components}
        bordered={false}
        columns={rewrittenColumns}
        expandable={{
          ...restExpandableProps,
          childrenColumnName,
          indentSize,
          expandedRowKeys,
          onExpandedRowsChange: setExpandedRowKeys,
          onExpand,
          expandIcon: (expandIconProps) => (
            <TreeTableExpandIcon {...expandIconProps} expandIcon={expandIcon} />
          ),
        }}
        rowKey={rowKey}
      />
    </div>
  );
}

export default TreeTable;
