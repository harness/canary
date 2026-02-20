import { resolve } from 'path'

import react from '@vitejs/plugin-react-swc'
import { uniq } from 'lodash-es'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import svgr from 'vite-plugin-svgr'

import pkg from './package.json'

const external = uniq(
  Object.keys(pkg.devDependencies || [])
    .concat(Object.keys(pkg.peerDependencies || []))
    .concat(Object.keys(pkg.dependencies || []))
)

export default defineConfig({
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [
    react(),
    svgr({ include: '**/*.svg' }),
    dts({
      outDir: 'dist',
      tsconfigPath: './tsconfig.json'
    })
  ],
  resolve: {
    alias: {
      '@views': resolve(__dirname, 'src')
    }
  },
  build: {
    sourcemap: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'views',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: { external }
  }
})
