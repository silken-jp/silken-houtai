import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      ApiURL: 'https://api.sclogi.jp',
    },
  },
  publicPath: '/houtai-import-cn-jp/',
  outputPath: '../../public/houtai-import-cn-jp',
});
