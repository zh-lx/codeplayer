import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base:
    process.env.NODE_ENV == 'production'
      ? 'https://cdn.jsdelivr.net/gh/zh-lx/codeplayer/packages/website/dist/'
      : './',
  plugins: [vue()],
  resolve: {
    alias: [
      ...(command === 'serve'
        ? [
            {
              find: /^codeplayer$/,
              replacement: path.resolve(__dirname, '../core/src/index.ts'),
            },
            {
              find: /^codeplayer\/dist\/style\.css$/,
              replacement: path.resolve(
                __dirname,
                '../core/src/style/index.less'
              ),
            },
          ]
        : []),
      {
        find: '@',
        replacement: path.resolve(__dirname, '../core/src'),
      },
      {
        find: '~@',
        replacement: path.resolve(__dirname, '../core/src'),
      },
      {
        find: 'path',
        replacement: 'path-browserify',
      },
    ],
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

  build: {
    rollupOptions: {
      output: {
        assetFileNames: () => `[name]-[hash].[ext]`,
      },
    },
  },
}));
