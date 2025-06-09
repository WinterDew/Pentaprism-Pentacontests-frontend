import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression({ algorithm: 'gzip', ext: '.gz' }),
    compression({ algorithm: 'brotliCompress', ext: '.br' })
    // visualizer({
    //   filename: 'dist/stats.html',
    //   open: true, // Automatically open in browser after build
    //   gzipSize: true,
    //   brotliSize: true
    // })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  build: {
    minify: 'terser',
    cssCodeSplit: true
  }
});