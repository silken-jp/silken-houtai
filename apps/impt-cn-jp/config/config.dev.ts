import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      mode: 'dev',
      ApiKey: 'fysOHxR9Wn0K7NnGCpQFdu16aVreJPeH',
      ApiURL: 'https://api2.sclogi.jp',
      ApiURL2: 'https://api2.sclogi.jp',
    },
  },
  publicPath: '/houtai-import-cn-jp/',
  outputPath: '../../public/houtai-import-cn-jp',
});
