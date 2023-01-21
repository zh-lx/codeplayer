import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: '/test/index.html',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './_src'),
    },
  },
  build: {
    lib: {
      entry: 'src/my-element.ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: /^lit/,
    },
  },
});
