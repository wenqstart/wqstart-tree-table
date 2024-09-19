/*
 * @Author: wqstart
 * @Date: 2024-09-03 16:48:30
 * @LastEditors: wqstart
 * @LastEditTime: 2024-09-10 19:26:29
 * @Description: 请填写简介
 */
import { INTERNAL_LEVEL, INTERNAL_PARENT } from './constant';
// 设置树形结构的层级和父节点
/**
 * @description: 
 * @param {any} treeList
 * @param {string} childrenColumnName
 * @param {any} callback
 * @return {*}
 */
export const traverseTree = (treeList: any[], childrenColumnName: string, callback: any) => {
  const traverse = (list: any[], parent = null, level = 1) => {
    list.forEach((treeNode) => {
      treeNode[INTERNAL_LEVEL] = level;
      treeNode[INTERNAL_PARENT] = parent;
      callback?.(treeNode, parent, level)
      const { [childrenColumnName]: next } = treeNode;
      if (Array.isArray(next)) {
        traverse(next, treeNode, level + 1);
      }
    });
  };
  traverse(treeList);
};

