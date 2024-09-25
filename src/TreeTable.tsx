/* eslint-disable react-hooks/rules-of-hooks */
import { Table } from 'antd';
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
  INTERNAL_PARENT,
  INTERNAL_ROW_KEY,
} from './constant';
import './index.css';
import { useIndentLinePlugin, usePluginContainer } from './plugins';
import { TreeTableExpandIcon } from './TreeTableExpandIcon';
import { traverseTree } from './util';

function TreeTable(rawProps: any) {
  const [internalExpandedRowKeys, setInternalExpandedRowKeys] = useState([]);
  const { expandable } = rawProps
  // *强制渲染
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  // *初始化 expandable 属性
  let expandedRowKeys: any[];
  let indentSize: any;
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
  const defaultTableProps = {
    pagination: false,
  };
  // 重新整理 props
  function resolveProps(props: any) {
    let {
      rowKey = INTERNAL_ROW_KEY,
      columns,
      headDataIndex = columns[0]?.dataIndex,
      childrenColumnName = INTERNAL_CHILDREN_COLUMN_NAME,
      plugins: userPlugins = [],
      disableIndentLine = false,
    } = props;
    const plugins = [
      disableIndentLine ? null : useIndentLinePlugin(),
      ...userPlugins,
    ];
    return {
      ...props,
      rowKey,
      headDataIndex,
      childrenColumnName,
      plugins,
      indentSize,
    };
  }
  const props = resolveProps(rawProps);
  const {
    columns,
    dataSource,
    rowKey,
    // headDataIndex,
    // lazyLoadProps,
    // paginationOptions,
    ...restProps
  } = props;



  function replaceChildList(record: any, childList: any) {
    // console.log('replaceChildList');

    record[childrenColumnName] = childList;
    record[INTERNAL_IS_LOADING] = false;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    rewriteTree({
      dataSource: childList,
      parentNode: record,
    });
    forceUpdate();
  }
  const pluginContext = {
    forceUpdate,
    replaceChildList,
    expandedRowKeys,
    setExpandedRowKeys,
  };

  const pluginContainer = usePluginContainer(props, pluginContext);

  // 自定义单元格内容
  const components = pluginContainer.mergeComponents();

  // *给每一列每个单元格添加 record 属性
  const rewrittenColumns = columns?.map((rawColumn: any) => {
    const column = Object.assign({}, rawColumn);
    pluginContainer.onColumn(column);
    return column;
  });

  // 点击展开图标时触发
  async function onExpand(expanded: any, record: any) {
    // console.log('expanded, record', expanded, record);
    pluginContainer.onExpand(expanded, record);
    onExpandProp?.(expanded, record);
  }
  function rewriteTree({
    dataSource = [] as any[],
    // 在动态追加子树节点的时候 需要手动传入 parent 引用
    parentNode = null as any,
  }) {
    // 在动态追加子树节点（replaceChildList）的时候 需要手动传入父节点的 level 否则 level 会从 1 开始计算
    const startLevel = parentNode?.[INTERNAL_LEVEL] || 0;
    // 切换分页器替换掉子数组时需要重新给父节点添加分页器标识
    if (parentNode) {
      // 分页逻辑
      pluginContainer?.onRecord?.(parentNode);
    }
    traverseTree(
      dataSource,
      childrenColumnName,
      (treeNode: any, parent: any, level: number) => {
        // 记录节点的层级（replaceChildList）
        treeNode[INTERNAL_LEVEL] = level + startLevel;
        // 记录节点的父节点（replaceChildList）
        treeNode[INTERNAL_PARENT] =
          parent || parentNode || treeNode[INTERNAL_PARENT];
        // * onRecord
        pluginContainer?.onRecord?.(treeNode);
      },
    );
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
