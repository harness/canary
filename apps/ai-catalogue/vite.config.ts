import { resolve } from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsConfigPaths()],
  resolve: {
    alias: {
      '@harnessio/ai-chat-components': resolve(__dirname, '../../packages/ai-chat-components/src/index.ts')
    }
  },
  server: {
    port: 3007
  }
})
