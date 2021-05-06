import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      ApiURL: 'http://13.112.93.138:3000',
    },
  },
});
