import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, './src/'),
    },
  },
  esbuild: {
    target: 'esnext',
  },
  server: {
    port: 5173,
    proxy: {
      // forward /api/* → http://localhost:3000/api/*
      '/api': {
        target: 'https://vedive.com:3000',
        changeOrigin: true,
        secure: false,
        // no rewrite needed if backend path also starts with /api
      },
    },
  },
})
