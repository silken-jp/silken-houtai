import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      ApiURL: 'https://api.sclogi.jp',
    },
  },
  publicPath: '/importer/',
  outputPath: '../../public/importer',
});
