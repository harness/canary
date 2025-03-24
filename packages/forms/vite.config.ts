import { resolve } from 'path'

import react from '@vitejs/plugin-react-swc'
import { uniq } from 'lodash-es'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import pkg from './package.json'

const external = uniq(Object.keys(pkg.devDependencies || []).concat(Object.keys(pkg.peerDependencies || [])))

export default defineConfig({
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [
    react(),
    dts({
      outDir: 'dist',
      tsconfigPath: './tsconfig.json'
    })
  ],
  build: {
    sourcemap: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'forms',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    rollupOptions: { external }
  }
})
