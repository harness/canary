import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://qa.harness.io/gateway/',
        changeOrigin: true
      },
      '/pipeline': {
        target: 'https://qa.harness.io/gateway',
        changeOrigin: true
      }
    }
  }
})
