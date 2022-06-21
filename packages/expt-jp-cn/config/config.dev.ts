import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      ApiURL: 'https://api-dev.sclogi.jp',
    },
  },
  publicPath: '/houtai-export-cn-jp/',
  outputPath: '../../public/houtai-export-cn-jp',
});
