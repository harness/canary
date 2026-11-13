import { resolve } from 'path'

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const pkg = require('./package.json')

const external = Object.keys(pkg.devDependencies || [])
  .concat(Object.keys(pkg.peerDependencies || []))
  .concat(['react/jsx-runtime'])

export default defineConfig({
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [
    dts({
      outDir: 'dist',
      tsconfigPath: './tsconfig.json',
      rollupTypes: true,
      // Keep tests and test mocks out of the published type declarations (and the dts type-check).
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/__tests__/**', 'config/**']
    })
  ],
  build: {
    sourcemap: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'pipeline-graph',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: { external }
  }
})
