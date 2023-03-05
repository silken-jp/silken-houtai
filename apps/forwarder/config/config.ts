// https://umijs.org/config/
import { defineConfig } from 'umi';
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

import defaultSettings from './defaultSettings';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  hash: true,
  history: {
    type: 'hash',
  },
  locale: {
    // default zh-CN
    default: 'ja-JP',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  // targets: {
  //   ie: 11,
  // },
  // // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // manifest: {
  //   basePath: '/',
  // },
  // 打包优化
  ignoreMomentLocale: true,
  // dynamicImport: {},
  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
  },
  chainWebpack: (config) => {
    config.plugin('antd-dayjs-webpack-plugin').use(AntdDayjsWebpackPlugin);
  },
  // 引入被 external 库的 scripts
  // 区分 development 和 production，使用不同的产物
  scripts:
    process.env.NODE_ENV === 'development'
      ? [
          'https://gw.alipayobjects.com/os/lib/react/16.13.1/umd/react.development.js',
          'https://gw.alipayobjects.com/os/lib/react-dom/16.13.1/umd/react-dom.development.js',
        ]
      : [
          'https://gw.alipayobjects.com/os/lib/react/16.13.1/umd/react.production.min.js',
          'https://gw.alipayobjects.com/os/lib/react-dom/16.13.1/umd/react-dom.production.min.js',
        ],
});
