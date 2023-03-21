import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      mode: 'host',
      ApiURL: 'http://localhost:3000',
      ApiURL2: 'http://localhost:3000',
    },
  },
});
