import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

export default defineConfig({
  server: {
    port: 3003
  },
  plugins: [
    react(),
    monacoEditorPlugin.default({
      globalAPI: true,
      customWorkers: [{ entry: 'monaco-yaml/yaml.worker', label: 'yaml' }]
    })
  ],
  root: 'playground'
})
