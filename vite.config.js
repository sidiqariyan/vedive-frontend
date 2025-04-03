import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import https from 'https'

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
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './certs/server.key')), // Path to your SSL private key
      cert: fs.readFileSync(path.resolve(__dirname, './certs/server.cert')), // Path to your SSL certificate
    },
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
