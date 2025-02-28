import { resolve } from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsConfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'

const external = [
  'react',
  'react-hook-form',
  'react-router-dom',
  'react-router',
  'react/jsx-runtime',
  'react-i18next',
  'i18next'
]

export default defineConfig({
  plugins: [react(), svgr({ include: '**/*.svg' }), tsConfigPaths(), dts({ rollupTypes: true })],
  build: {
    lib: {
      cssFileName: 'styles',
      entry: {
        // Only include the entries you want to build
        views: resolve(__dirname, 'src/views/index.ts'),
        index: resolve(__dirname, 'src/index.ts')
      },
      formats: ['es']
    },
    rollupOptions: {
      external: external
    },
    sourcemap: true
  }
})
