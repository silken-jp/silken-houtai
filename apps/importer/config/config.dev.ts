import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      ApiURL: 'https://api-dev.sclogi.jp',
    },
  },
  publicPath: '/importer/',
  outputPath: '../../public/importer',
});
