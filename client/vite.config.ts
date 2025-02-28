import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import {defineConfig} from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), nodePolyfills()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://back:8080',
        changeOrigin: true
      },
    },
  },
})
