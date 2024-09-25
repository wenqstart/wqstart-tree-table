/*
 * @Author: wqstart
 * @Date: 2024-09-19 20:06:52
 * @LastEditors: wqstart
 * @LastEditTime: 2024-09-25 16:53:19
 * @Description: 文件简介
 */
import { Pagination } from 'antd';
import React from 'react';
import {
  INTERNAL_IS_LOADING,
  INTERNAL_PAGINATION_CURRENT,
  INTERNAL_PAGINATION_KEY,
  INTERNAL_PARENT,
} from 'wqstart-tree-table/constant';

export const isInternalPaginationNode = (record: any, rowKey: string) => {
  return record?.[rowKey]?.startsWith?.(INTERNAL_PAGINATION_KEY);
};
export const generateInternalPaginationNode = (rowKey: string) => ({
  [rowKey]: `${INTERNAL_PAGINATION_KEY}-${Math.random()}`,
});
export const usePaginationPlugin =
  (paginationOptions: any) => (props: any, context: any) => {
    const { totalKey, pageSize, onChange } = paginationOptions;
    const { childrenColumnName, rowKey, headDataIndex } = props;
    const { forceUpdate, replaceChildList } = context;
    
    
    /**
     * @description: 遍历每一行，判断是否添加分页器
     * @param {any} treeNode
     * @return {*}
     */    
    function handlePagination(treeNode: any): any {
      if (!treeNode) {
        return;
      }
      
      const nodeChildren = treeNode[childrenColumnName] || [];
      const [lastChildNode] = nodeChildren.slice?.(-1);
      // 渲染分页器，先加入占位节点
      if (
        // totalKey代表总数，nodeChildren代表当前页下的子节点数组
        treeNode?.[totalKey] > nodeChildren?.length &&
        // 防止重复添加分页器占位符：如多次调用 rewriteTree 函数
        !isInternalPaginationNode(lastChildNode, rowKey)
      ) {
        nodeChildren?.push?.(generateInternalPaginationNode(rowKey));
      }
    }
    /**
     * @description: 遍历每一列，自定义渲染分页器
     * @param {any} column
     * @return {*}
     */
    function rewritePaginationRender(column: any): any {
      const { render, dataIndex } = column;
      column.render = (text: any, record: any) => {
        // 从父节点拿分页信息
        const parentRecord = record[INTERNAL_PARENT];
        const total = parentRecord?.[totalKey];
        
        // 是分页占位符（最后一行）
        if (isInternalPaginationNode(record, rowKey)) {
          // 第一个字段才需要渲染分页器，其余的返回 null
          
          if (dataIndex === headDataIndex) {
            const onPageChange = async (current: any) => {
              parentRecord[INTERNAL_PAGINATION_CURRENT] = current;
              parentRecord[INTERNAL_IS_LOADING] = true;
              forceUpdate();
              // 调用外部函数获取分页数据
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
        return render?.(text, record) ?? text;
      };
    }

    return {
        key: 'pagination',
        onRecord: handlePagination,
        onColumn: rewritePaginationRender
    }
  };
