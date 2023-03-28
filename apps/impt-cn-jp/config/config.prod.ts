import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      mode: 'prod',
      ApiKey: '',
      ApiURL: 'https://api2.sclogi.jp',
      ApiURL2: 'https://api-waybill.sclogi.jp',
    },
  },
  publicPath: '/houtai-import-cn-jp/',
  outputPath: '../../public/houtai-import-cn-jp',
});
