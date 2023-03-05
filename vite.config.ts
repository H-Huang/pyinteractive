import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Below needed for hot reload in docker
  server: {
    watch: {
     usePolling: true,
    },
  },
  base: "/pyinteractive/"
})
