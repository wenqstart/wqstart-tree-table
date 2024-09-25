/*
 * @Author: wqstart
 * @Date: 2024-09-23 17:02:20
 * @LastEditors: wqstart
 * @LastEditTime: 2024-09-25 17:06:30
 * @Description: 文件简介
 */

import React from 'react';
import { IndentCell } from './IndentCell';

export const useIndentLinePlugin =
  (indentLineOptions?: any) => (props: any, context: any) => {
    // TODO: 待拓展
    console.log('indentLineOptions', indentLineOptions);
    const { expandedRowKeys } = context;

    function onColumn(column: any) {
      console.log('onColumn', column);

      column.onCell = (record: any) => {
        return {
          record,
          ...column,
        };
      };
    }
    // 自定义单元格内容
    const components = {
      body: {
        cell: (cellProps: any) => {
          return (
            <IndentCell
              {...cellProps}
              {...props}
              expandedRowKeys={expandedRowKeys}
            />
          );
        },
      },
    };
    return {
      key: 'indentLine',
      components,
      onColumn,
    };
  };
