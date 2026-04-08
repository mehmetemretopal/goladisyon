import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  server: {
    allowedHosts: ['highland-passing-lindsay-majority.trycloudflare.com'],//5173 frontend https olmadan
    proxy: {
      '/api': {
        target:'https://experiment-beds-introducing-reference.trycloudflare.com',//8080
        changeOrigin: true
      },
      '/ws-adisyon': {
        target:'https://experiment-beds-introducing-reference.trycloudflare.com',//8080 
        ws: true,
        changeOrigin: true
      }
    }
  }
})
