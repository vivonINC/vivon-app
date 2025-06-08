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
    open: false, // Don't auto-open browser
  },
});
