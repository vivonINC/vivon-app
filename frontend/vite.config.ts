import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const tailwindcss = (await import('@tailwindcss/vite')).default;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // Important for Electron
  build: {
    outDir: 'dist',
  },
  server: {
    open: false,
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Ensure path isn't modified
      },
      // You might also want to proxy other API routes
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});