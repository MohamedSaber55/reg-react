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
    // Kept tight on purpose: the entry chunk previously reached 35 MB and the
    // raised limit hid it. If this warns again, something is being pulled onto
    // the critical path that shouldn't be.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // NOTE: react-icons packs are deliberately NOT listed here.
        // Naming a module in manualChunks forces the whole module into that
        // chunk, which defeats tree-shaking — listing react-icons/fa, /md and
        // /fi produced 3.3 MB of icon chunks that were then modulepreloaded on
        // every page, despite only a handful of icons being used. Left alone,
        // Rollup shakes them down to just the imported icons.
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'redux': ['@reduxjs/toolkit', 'react-redux'],
          'ui': ['framer-motion', 'swiper', 'react-hot-toast', 'sweetalert2'],
          'forms': ['formik', 'yup'],
          'i18n': ['i18next', 'react-i18next'],
        },
      },
    },
  },
})
