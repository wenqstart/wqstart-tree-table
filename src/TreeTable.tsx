import { Table } from 'antd';
import React, {
  useEffect,
  // useReducer,
  // useImperativeHandle,
  useState,
} from 'react';
import {
  INTERNAL_CHILDREN_COLUMN_NAME,
  INTERNAL_INDENT_SIZE,
  INTERNAL_LEVEL,
  INTERNAL_PARENT,
} from './constant';
import { IndentCell } from './IndentCell';
import './index.css';
import { TreeTableExpandIcon } from './TreeTableExpandIcon';
import { traverseTree } from './util';
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
  const { columns, dataSource, rowKey, expandable, ...restProps } = props;
  const [internalExpandedRowKeys, setInternalExpandedRowKeys] = useState([]);

  // *给每一列每个单元格添加 record 属性
  const rewrittenColumns = columns?.map((column: any) => {
    return {
      ...column,
      onCell: (record: any) => {
        return {
          record,
          ...column,
        };
      },
    };
  });

  // 初始化 expandable 属性
  let expandedRowKeys;
  let indentSize;
  let childrenColumnName: string;
  let setExpandedRowKeys;
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
  // 点击展开图标时触发
  function onExpand(expanded: any, record: any) {
    console.log('expanded, record', expanded, record);
    onExpandProp?.(expanded, record);
  }
  function rewriteTree({ dataSource = [] as any[] }) {
    traverseTree(dataSource, childrenColumnName, (treeNode: any, parent: any, level: number) => {
      treeNode[INTERNAL_LEVEL] = level;
      treeNode[INTERNAL_PARENT] = parent;
    });
  }
  useEffect(() => {
    rewriteTree({ dataSource });
  }, [dataSource]);
  return (
    <div className="react-antd-treetable">
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
