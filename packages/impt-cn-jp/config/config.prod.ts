import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      ApiURL: 'https://skapi.weixin-jp.com',
    },
  },
  publicPath: '/houtai-import-cn-jp/',
  outputPath: '../../dist/houtai-import-cn-jp',
});
