import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Asegurar que la base sea la raíz
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 8012, // Puerto para Windows
    host: '0.0.0.0', // Permitir acceso desde la red
    open: true,
    cors: true, // Habilitar CORS
    proxy: {
      // Proxy para el backend
      '/api': {
        target: 'http://localhost:8013',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
