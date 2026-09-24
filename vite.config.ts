import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // The app is served from a subfolder: https://arctelis.github.io/nadplaty/
  base: '/nadplaty/',
  plugins: [react()],
})
