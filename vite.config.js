import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

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
    port: 5173,
    host: true, // Bind to all network interfaces
    https: {
      key: fs.readFileSync('./server.key'),
      cert: fs.readFileSync('./server.crt')
    },
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
