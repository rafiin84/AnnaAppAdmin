import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'charts': ['recharts'],
          'motion': ['framer-motion'],
          'query': ['@tanstack/react-query'],
          'icons': ['lucide-react'],
          'radix': [
            '@radix-ui/react-avatar', '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu', '@radix-ui/react-label',
            '@radix-ui/react-progress', '@radix-ui/react-scroll-area',
            '@radix-ui/react-select', '@radix-ui/react-separator',
            '@radix-ui/react-slot', '@radix-ui/react-switch',
            '@radix-ui/react-tabs', '@radix-ui/react-tooltip',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
