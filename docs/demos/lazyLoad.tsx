/*
 * @Author: wqstart
 * @Date: 2024-09-12 17:23:33
 * @LastEditors: wqstart
 * @LastEditTime: 2024-09-25 17:10:44
 * @Description: 文件简介
 */
import React, { useState } from 'react';
// import TreeTable, { useLazyloadPlugin } from '../../src';
import { useLazyLoadPlugin, WqstartTreeTable } from '../../src';

const columns = [
  {
    title: '函数名',
    dataIndex: 'function_name',
    width: 700,
  },
  {
    title: '上报次数',
    dataIndex: 'count',
    width: 120,
  },
];

const getData = () => {
  return [
    {
      id: Math.random(),
      function_name: `sub_function_${Math.random()}`,
      count: 100,
      has_next: true,
      next_size: 10,
    },
    {
      id: Math.random(),
      function_name: `sub_function_${Math.random()}`,
      count: 100,
      has_next: true,
    },
  ];
};

const rootKey = Math.random();
const data = [
  {
    id: rootKey,
    function_name: `React Tree Reconciliation`,
    count: 100,
    has_next: true,
  },
];

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

const DefaultExample = () => {
  const onLoadMore = async (record) => {
    await wait(1000);
    const res = await getData();
    return res;
  };

  const [expandedKeys, setExpandedKeys] = useState<React.ReactText[]>([]);

  return (
    <WqstartTreeTable
      rowKey="id"
      dataSource={data}
      expandable={{
        expandedRowKeys: expandedKeys,
        onExpandedRowsChange: setExpandedKeys,
        indentSize: 50
      }}
      columns={columns}
      // lazyLoadProps={{
      //   onLoad: onLoadMore,
      //   hasNextKey: 'has_next',
      // }}
      plugins={[
        useLazyLoadPlugin({
          onLoad: onLoadMore,
          hasNextKey: 'has_next',
        }),
      ]}
    />
  );
};

export default DefaultExample;
