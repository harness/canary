import { resolve } from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsConfigPaths from 'vite-tsconfig-paths'

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
  plugins: [react(), svgr({ include: '**/*.svg' }), tsConfigPaths()],
  build: {
    lib: {
      cssFileName: 'styles',
      entry: {
        components: resolve(__dirname, 'src/components/index.ts'),
        views: resolve(__dirname, 'src/views/index.ts'),
        hooks: resolve(__dirname, 'src/hooks/index.ts'),
        locales: resolve(__dirname, 'locales/index.ts'),
        index: resolve(__dirname, 'src/index.ts'),
        context: resolve(__dirname, 'src/context/index.ts')
      },
      formats: ['es']
    },
    rollupOptions: {
      external: external
    },
    sourcemap: true
  }
})
