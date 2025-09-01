import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/frontplanillabus/', // Nombre del repositorio
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
  // Configuración para GitHub Pages
  server: {
    port: 3000,
    open: true
  },
  // Asegurar que las rutas funcionen en GitHub Pages
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})
