import path from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Prebundled `@harnessio/ui` imports this optional framer-motion peer; resolve from this app so Vite can pre-bundle in dev.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@emotion/is-prop-valid': path.resolve(__dirname, 'node_modules/@emotion/is-prop-valid')
    }
  }
})
