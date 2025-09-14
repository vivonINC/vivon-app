import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const tailwindcss = (await import('@tailwindcss/vite')).default;

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    open: false,
    // Only use proxy in development
    ...(mode === 'development' && {
      proxy: {
        '/auth': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
        },
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        },
        '/ws': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          ws: true, // Enable WebSocket proxying
        },
      },
    }),
  },
}));