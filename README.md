<!--
 * @Author: wqstart
 * @Date: 2024-09-03 16:19:37
 * @LastEditors: wqstart
 * @LastEditTime: 2024-09-27 10:49:52
 * @Description: 文件简介
-->
<h1 align="center">wqstart-antd-treetable </h1>

[![NPM version](https://img.shields.io/npm/v/wqstart-tree-table.svg?style=flat)](https://npmjs.org/package/wqstart-tree-table)
[![NPM downloads](http://img.shields.io/npm/dm/wqstart-tree-table.svg?style=flat)](https://npmjs.org/package/wqstart-tree-table)

## 介绍

基于 antd Table 组件封装，主要针对树形结构的数据源进行优化展示。

主要扩展的能力：

1. 层级缩进**指示线**
2. **远程懒加载**子节点
3. 子节点**分页**

功能全部通过插件实现，其他的 `props` 全部继承自 Ant Design 的 Table 组件（仅支持 v4 版本以上）。

## 用法

需要依赖 `antd`, `@ant-design/icons`

```sh
npm i wqstart-antd-treetable
```

## 示例

### 缩进线

只要数据源 dataSource 有 children 属性即可

```js
import { WqstartTreeTable } from 'wqstart-tree-table';
<WqstartTreeTable dataSource={data} columns={columns} rowKey={'id'} />;
```

### 懒加载子节点

`hasNextKey`需要和后端约定好

```js
import { useLazyLoadPlugin, WqstartTreeTable } from 'wqstart-tree-table';
<WqstartTreeTable
  rowKey="id"
  dataSource={data}
  expandable={{
    expandedRowKeys: expandedKeys,
    onExpandedRowsChange: setExpandedKeys,
    indentSize: 50,
  }}
  columns={columns}
  plugins={[
    useLazyLoadPlugin({
      onLoad: onLoadMore, // 会把 record 回传给 onLoadMore
      hasNextKey: 'has_next', // 后端返回的 key，是否还有下一级
    }),
  ]}
/>;
```

### 子节点分页

`totalKey`需要和后端约定好

```js
import { usePaginationPlugin, WqstartTreeTable } from 'wqstart-tree-table';

<WqstartTreeTable
  rowKey="id"
  dataSource={data}
  expandable={{
    expandedRowKeys: expandedKeys,
    onExpandedRowsChange: setExpandedKeys,
  }}
  columns={columns}
  plugins={[
    usePaginationPlugin({
      totalKey: 'next_size', // 后端返回的 key，下一级的数据量
      pageSize: 4,
      onChange: onLoadMore, // 会把 current 和 parentRecord 回传给 onLoadMore
    }),
  ]}
/>;
```

<!-- 每个插件都是一个高阶函数 -->
