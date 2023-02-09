import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      ApiURL: 'https://api-dev.sclogi.jp',
      ApiURL2: 'https://api-dev.sclogi.jp',
    },
  },
  publicPath: '/houtai-import-cn-jp/',
  outputPath: '../../public/houtai-import-cn-jp',
});
