import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      outDir: './types',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~@': path.resolve(__dirname, './src'),
      path: 'path-browserify',
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "src/style/index.less";`,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  base: './',
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        index: './src/index.ts',
      },
      formats: ['es', 'cjs'],
      fileName: '[name]',
    },
    rollupOptions: {
      external: [/^vue/],
      output: {},
    },
  },
});
