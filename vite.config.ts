import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The production build is served from GitHub Pages at /mango/; dev stays at the root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/mango/' : '/',
  plugins: [react()],
  server: { port: 5199 },
}))
