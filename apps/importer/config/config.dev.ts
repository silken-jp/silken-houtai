import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      ApiKey: 'fysOHxR9Wn0K7NnGCpQFdu16aVreJPeH',
      ApiURL: 'https://api-dev.sclogi.jp',
    },
  },
  publicPath: '/importer/',
  outputPath: '../../public/importer',
});
