import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      ApiURL: 'https://skapi.weixin-jp.com',
    },
  },
  outputPath: '../../dist/houtai-jp-cn',
});
