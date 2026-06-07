/* global process */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['.trycloudflare.com'],
    proxy: {
      '/api/waitlist': {
        target: process.env.MOCK_WAITLIST_TARGET ?? 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
})
