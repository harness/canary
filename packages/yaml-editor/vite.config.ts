import { resolve } from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

import pkg from './package.json'

const externalPkgs = Object.keys(pkg.devDependencies || []).concat(Object.keys(pkg.peerDependencies || []))
const external = (id: string) =>
  externalPkgs.some(pkg => id === pkg || id.startsWith(pkg + '/')) || id.startsWith('monaco-editor/')

export default defineConfig({
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [
    react(),
    dts({
      outDir: 'dist',
      tsconfigPath: './tsconfig.json'
    }),
    // @ts-expect-error: CJS-only package — Rolldown's ESM interop doesn't auto-unwrap exports.default
    monacoEditorPlugin.default({ customWorkers: [{ entry: 'monaco-yaml/yaml.worker', label: 'yaml' }] })
  ],
  build: {
    sourcemap: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'yaml-editor',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    rollupOptions: { external }
  }
})
