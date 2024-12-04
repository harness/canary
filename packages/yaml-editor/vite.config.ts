import { resolve } from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

const pkg = require('./package.json')

const external = Object.keys(pkg.devDependencies || [])
  .concat(Object.keys(pkg.peerDependencies || []))
  .concat(Object.keys(pkg.peerDependencies || []))
  .concat([
    'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices.js',
    'monaco-editor/esm/vs/editor/standalone/browser/outlineModel.js',
    'monaco-editor/esm/vs/editor/standalone/browser/ILanguageFeaturesService.js'
  ])

export default defineConfig({
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [
    react(),
    dts({
      outDir: 'dist',
      tsconfigPath: './tsconfig.json'
    }),
    monacoEditorPlugin.default({ customWorkers: [{ entry: 'monaco-yaml/yaml.worker', label: 'yaml' }] })
  ],
  build: {
    sourcemap: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'yaml-editor',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: { external }
  }
})
