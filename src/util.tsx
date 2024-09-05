import { INTERNAL_LEVEL, INTERNAL_PARENT } from './constant';
// 设置树形结构的层级和父节点
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

