import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: true
  },
  base: '/onlineexamfrontend/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
