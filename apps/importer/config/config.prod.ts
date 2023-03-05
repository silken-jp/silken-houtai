import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      ApiURL: 'https://api2.sclogi.jp',
    },
  },
  publicPath: '/importer/',
  outputPath: '../../public/importer',
});
