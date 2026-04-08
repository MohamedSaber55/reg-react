import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'redux': ['@reduxjs/toolkit', 'react-redux'],
          'ui': ['framer-motion', 'swiper', 'react-hot-toast', 'sweetalert2'],
          'forms': ['formik', 'yup'],
          'i18n': ['i18next', 'react-i18next'],
          'icons-fi': ['react-icons/fi'],
          'icons-fa': ['react-icons/fa'],
          'icons-md': ['react-icons/md'],
        },
      },
    },
  },
})
