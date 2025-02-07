import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  server: {
    host: true,
    port: Number(process.env.PORT) || 3000,
  },
  preview: {
    host: true,
    port: Number(process.env.PORT) || 8080,
    allowedHosts: [
      'healthcheck.railway.app',
      'acesso-antecipado-astex-production.up.railway.app',
      '.railway.app', // Permite todos os subdomínios do railway.app
    ],
  },
})