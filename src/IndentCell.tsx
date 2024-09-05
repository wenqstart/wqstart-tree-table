import { INTERNAL_LEVEL, INTERNAL_PARENT } from "./constant";
import React, { useMemo } from "react";

export const IndentCell = (props: any) => {
  const {
    children,
    expandedRowKeys,
    record,
    indentSize,
    headDataIndex,
    dataIndex,
    rowKey,
  } = props;
  // 父元素是否展开
  const isParentExpanded = expandedRowKeys?.includes(
    record?.[INTERNAL_PARENT]?.[rowKey]
  );
  // 当前元素层级
  const level = record[INTERNAL_LEVEL];
  // 缩进线元素
  const indent = useMemo(() => {
    const indents = [];
    for (let index = 1; index < level; index++) {
      indents.push(index * indentSize);
    }
    console.log('====================================');
    console.log('indents', indents);
    console.log('====================================');
    return indents.map((indent) => (
      <div
        style={{
          position: "absolute",
          left: indent,
          top: 0,
          bottom: 0,
          width: 1,
          height: "100%",
          backgroundColor: "#e8e8e8",
        }}
        key={indent}
      />
    ));
  }, [indentSize, level]);
  // 1.父元素未展开 2.当前元素不是表头 不展示缩进线
  if (!isParentExpanded || headDataIndex !== dataIndex) {
    return (
      <td>
        <div className="react-antd-treetable-cell-content">{children}</div>
      </td>
    );
  }

  return (
    <td className={`react-antd-treetable-cell`}>
      {indent}
      <div className="react-antd-treetable-cell-content">{children}</div>
    </td>
  );
}
