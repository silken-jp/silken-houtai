import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      mode: 'prod',
      ApiKey: '',
      // ApiKey: 'fysOHxR9Wn0K7NnGCpQFdu16aVreJPeH',
      ApiURL: 'https://api2.sclogi.jp',
      ApiURL2: 'https://api-waybill.sclogi.jp',
    },
  },
  publicPath: '/houtai-export-jp-cn/',
  outputPath: '../../public/houtai-export-jp-cn',
});
