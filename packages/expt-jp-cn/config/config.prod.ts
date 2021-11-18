import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      ApiURL: 'https://skapi.weixin-jp.com',
    },
  },
  publicPath: '/houtai-export-jp-cn/',
  outputPath: '../../dist/houtai-export-jp-cn',
});
