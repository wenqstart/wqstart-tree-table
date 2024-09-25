/*
 * @Author: wqstart
 * @Date: 2024-09-19 16:02:34
 * @LastEditors: wqstart
 * @LastEditTime: 2024-09-23 16:49:38
 * @Description: 文件简介
 */
import React, { useState } from 'react';
import { useLazyLoadPlugin, WqstartTreeTable } from '../../src';
import { usePaginationPlugin } from '../../src';


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
      function_name: `sub_function_${Math.random()} (带分页器)`,
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
    {
      id: Math.random(),
      function_name: `sub_function_${Math.random()}`,
      count: 100,
      has_next: true,
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
    next_size: 10,
    children: getData(),
  },
];

const wait = time => new Promise(resolve => setTimeout(resolve, time));

const DefaultExample = () => {
  const onLoadMore = async (current: any, parentRecord: any) => {
    console.log('current, parentRecord', current, parentRecord);
    
    await wait(1000);
    const res = await getData();
    return res;
  };

  const [expandedKeys, setExpandedKeys] = useState<React.ReactText[]>([
    rootKey,
  ]);
  return (
    <WqstartTreeTable
      rowKey="id"
      dataSource={data}
      expandable={{
        expandedRowKeys: expandedKeys,
        onExpandedRowsChange: setExpandedKeys,
      }}
      columns={columns}
      lazyLoadProps={{
        onLoad: onLoadMore,
        hasNextKey: 'has_next',
      }}
      // paginationOptions={{
      //   totalKey: 'next_size',
      //   pageSize: 4,
      //   onChange: onLoadMore,
      // }}
      plugins={[
        usePaginationPlugin({
          totalKey: 'next_size',
          pageSize: 4,
          onChange: onLoadMore,
        }),
      ]}
    />
  );
};

export default DefaultExample;
