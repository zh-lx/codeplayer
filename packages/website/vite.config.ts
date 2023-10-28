import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../core/src'),
      '~@': path.resolve(__dirname, '../core/src'),
      path: 'path-browserify',
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "../core/src/style/index.less";`,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    fs: {
      strict: false,
    },
  },
});
