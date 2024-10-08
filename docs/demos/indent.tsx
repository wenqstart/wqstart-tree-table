/*
 * @Author: wqstart
 * @Date: 2024-09-03 17:08:49
 * @LastEditors: wqstart
 * @LastEditTime: 2024-09-25 17:06:03
 * @Description: 文件简介
 */
// import 'antd/dist/antd.css';
import React from 'react';
import { useIndentLinePlugin, WqstartTreeTable } from '../../src';

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
const data = [
    {
      id: `${Math.random()}`,
      function_name: `React Tree Reconciliation`,
      count: 100,
      children: [
        {
          id: `${Math.random()}`,
          function_name: "ErrorBoundary [mount] (#4)",
          count: 50,
          children: [
            {
              id: `${Math.random()}`,
              function_name: "ErrorBoundary [mount] (#4)",
              count: 50,
            },
            {
              id: `${Math.random()}`,
              function_name: "storyFn [mount]",
              count: 50,
            },
            {
              id: `${Math.random()}`,
              function_name: "HashRouter [mount] (#10)",
              count: 50,
            },
          ],
        },
        {
          id: `${Math.random()}`,
          function_name: "storyFn [mount]",
          count: 50,
        },
      ],
    },
  ];

const DefaultExample = () => {
    console.log('====================================');
    console.log('data', data);
    console.log('====================================');
  return (
    <WqstartTreeTable
      rowKey="id"
      dataSource={data}
      columns={columns}
      scroll={{ x: true }}
      plugins={[
        useIndentLinePlugin(),
      ]}
    />
  );
};

export default DefaultExample;
