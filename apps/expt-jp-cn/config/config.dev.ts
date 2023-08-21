import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      mode: 'dev',
      ApiKey: 'fysOHxR9Wn0K7NnGCpQFdu16aVreJPeH',
      ApiURL: 'https://api-dev.sclogi.jp',
      ApiURL2: 'https://api-dev.sclogi.jp',
    },
  },
  publicPath: '/houtai-export-jp-cn//',
  outputPath: '../../public/houtai-export-jp-cn/',
});
