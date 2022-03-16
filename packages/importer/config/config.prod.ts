import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      ApiURL: 'https://api.sclogi.jp',
    },
  },
  publicPath: '/houtai-importer/',
  outputPath: '../../public/houtai-importer',
});
