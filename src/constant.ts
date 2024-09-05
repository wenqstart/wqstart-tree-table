export const INTERNAL_PREFIX = '__react_antd_treetable';
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