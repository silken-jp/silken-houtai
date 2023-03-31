import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      ApiKey: '',
      ApiURL: 'https://api2.sclogi.jp',
    },
  },
  publicPath: '/importer/',
  outputPath: '../../public/importer',
});
