import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      ApiURL: 'https://skapi.weixin-jp.com',
    },
  },
  publicPath: '/dashboard/',
  outputPath: '../../dist/dashboard',
});
