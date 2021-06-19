import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      ApiURL: 'http://skapi.weixin-jp.com',
    },
  },
});
