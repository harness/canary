import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // @ts-expect-error: @TODO: Fix  this. Should be removed, added to enable typecheck
    monacoEditorPlugin.default({ customWorkers: [{ entry: 'monaco-yaml/yaml.worker', label: 'yaml' }] })
  ],
  server: {
    host: process.env.UI_HOST || '127.0.0.1',
    port: Number(process.env.UI_DEV_SERVER_PORT) || 5137,
    proxy: {
      '/api/v1': {
        /* https://stackoverflow.com/questions/70694187/vite-server-is-running-but-not-working-on-localhost */
        target: 'http://127.0.0.1:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    assetsDir: ''
  }
})
