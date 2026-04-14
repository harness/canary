import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

export default defineConfig({
  server: {
    port: 3003
  },
  plugins: [
    react(),
    // @ts-expect-error: CJS-only package — Rolldown's ESM interop doesn't auto-unwrap exports.default
    monacoEditorPlugin.default({
      globalAPI: true,
      customWorkers: [{ entry: 'monaco-yaml/yaml.worker', label: 'yaml' }]
    })
  ],
  root: 'playground'
})
