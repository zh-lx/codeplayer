import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "src/style/index.less";`,
      },
    },
  },
  build: {
    lib: {
      entry: 'src/main.ts',
      formats: ['es', 'umd'],
      name: 'CodeSandbox',
      fileName: 'index',
    },
  },
});
