import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      ApiURL: 'https://api2.sclogi.jp',
    },
  },
  publicPath: '/houtai-export-jp-cn/',
  outputPath: '../../public/houtai-export-jp-cn',
});
