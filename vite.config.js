import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
import https from 'https'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, './src/')
    }
  },
  esbuild: {
    target: 'esnext' // Ensures support for top-level await
  },
  server: {
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem')),
    // },
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false, // Set to true in production with proper certificates
        rewrite: (path) => path,
      }
    }
  }
})
