import { resolve } from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const pkg = require('./package.json')

const external = [...new Set([...Object.keys(pkg.devDependencies || []), ...Object.keys(pkg.peerDependencies || [])])]

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
      name: 'filters',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: { external }
  }
})
