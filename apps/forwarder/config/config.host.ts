import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      mode: 'host',
      ApiKey: 'fysOHxR9Wn0K7NnGCpQFdu16aVreJPeH',
      ApiURL: 'http://localhost:3000',
      ApiURL2: 'http://localhost:3000',
    },
  },
});
