import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import tsConfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsConfigPaths(),
    // @ts-expect-error: @TODO: Fix  this. Should be removed, added to enable typecheck
    monacoEditorPlugin.default({ customWorkers: [{ entry: 'monaco-yaml/yaml.worker', label: 'yaml' }] })
  ]
})
