/*
 * @Author: wqstart
 * @Date: 2024-09-19 19:59:53
 * @LastEditors: wqstart
 * @LastEditTime: 2024-09-25 17:01:36
 * @Description: 文件简介
 */
export const usePluginContainer = (props: any, context: any) => {
  const { plugins: rawPlugins = [] } = props;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  console.log('rawPlugins', rawPlugins);
  // 插件去重
  function transformPlugins(rawPlugins: any[], key = 'key'): any[] {
    const newPlugins = rawPlugins
      ?.map((plugin: any) => plugin?.(props, context))
      ?.filter(Boolean);
    const tempMap = {} as any;
    for (const plugin of newPlugins) {
      tempMap[plugin[key]] = plugin;
    }
    return Object.values(tempMap);
  }

  const plugins = transformPlugins(rawPlugins);

  console.log('plugins', plugins);

  const container = {
    onColumn(column: any) {
      for (const plugin of plugins) {
        console.log('plugin', plugin?.onColumn);

        plugin?.onColumn?.(column);
      }
    },

    onRecord(record: any) {
      for (const plugin of plugins) {
        plugin?.onRecord?.(record);
      }
    },

    onExpand(expanded: any, record: any) {
      for (const plugin of plugins) {
        plugin?.onExpand?.(expanded, record);
      }
    },
    // 把 components 合并起来（后面的会覆盖前面的）
    mergeComponents() {
      const deepMerge = (componentsList: any[]) => {
        const mergeResult = {} as any;
        // 有的插件的 components 为空，需要过滤掉
        const filteredComponentsList = componentsList.filter(Boolean);

        filteredComponentsList.forEach((components: any) => {
          const componentKeys = Object.keys(components);
          for (const componentKey of componentKeys) {
            const value = components[componentKey]; // componentKey: body
            if (typeof value === 'function') {
              mergeResult[componentKey] = value;
            } else if (typeof value === 'object') {
              mergeResult[componentKey] = deepMerge(
                filteredComponentsList.map((item) => item[componentKey]),
              );
            }
          }
        });
        return mergeResult;
      };
      const allComponents = [
        ...(props.components || []),
        ...(plugins?.map((plugin: any) => plugin?.components) || []),
      ];
      return deepMerge(allComponents);
    },
  };
  return container;
};
export { useIndentLinePlugin } from './indent-line';
export { useLazyLoadPlugin } from './lazyLoad';
export { usePaginationPlugin } from './pagination';
