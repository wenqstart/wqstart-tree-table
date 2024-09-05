## 添加缩进线

<code src="/docs/demos/indent.tsx" />

```tsx
import React from 'react';
import { WqstartTreeTable } from '../src';

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
  return (
    <WqstartTreeTable
      rowKey="id"
      dataSource={data}
      columns={columns}
    />
  );
};

export default DefaultExample;

```