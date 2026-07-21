import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@react-three') || (id.includes('three') && !id.includes('react-three'))) return 'three-core';
          if (id.includes('framer-motion')) return 'framer';
          if (id.includes('gsap')) return 'gsap';
          if (id.includes('react-router-dom') || id.includes('react-dom') || (id.includes('/react/') && !id.includes('react-three'))) return 'react-vendor';
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
