import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    target: 'esnext' // Ensures support for top-level await
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000',
        changeOrigin: true,
        secure: false, // Set to true in production with proper certificates
        rewrite: (path) => path,
      }
    }
  }
})
