/*
 * @Author: wqstart
 * @Date: 2024-09-03 16:48:30
 * @LastEditors: wqstart
 * @LastEditTime: 2024-09-19 16:19:27
 * @Description: 文件简介
 */
export const INTERNAL_PREFIX = '__wqstart_treeTable';
export const createInternalConstant = (value: string) =>
    `${INTERNAL_PREFIX}_${value}`;
// 树节点属性：标记树的等级
export const INTERNAL_LEVEL = createInternalConstant('level');

// 树节点属性：标记树的父层级引用
export const INTERNAL_PARENT = createInternalConstant('parent');

// 树节点属性：标记该节点正在加载更多子节点
export const INTERNAL_IS_LOADING = createInternalConstant('is_loading');
export const INTERNAL_INDENT_SIZE = 24
export const INTERNAL_CHILDREN_COLUMN_NAME = 'children'
export const INTERNAL_LOADING_KEY = createInternalConstant('loading');
// 树节点属性：标记该节点用来渲染分页器
export const INTERNAL_PAGINATION_KEY = createInternalConstant('pagination');
// 标记当前页码
export const INTERNAL_PAGINATION_CURRENT = createInternalConstant(
    'pagination_current',
  );