import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import yaml from '@rollup/plugin-yaml'

// https://vitejs.dev/config/
export default defineConfig({
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [
    react(),
    yaml({}),
    monacoEditorPlugin.default({ customWorkers: [{ entry: 'monaco-yaml/yaml.worker', label: 'yaml' }] })
  ]
})
