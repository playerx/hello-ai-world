import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
        useit: resolve(__dirname, 'projects/useit-design.html'),
        bank: resolve(__dirname, 'projects/digital-bank-redesign.html'),
        freelance: resolve(__dirname, 'projects/freelance-showcase.html'),
      },
    },
  },
});
