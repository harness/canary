import { resolve } from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import svgr from 'vite-plugin-svgr'
import tsConfigPaths from 'vite-tsconfig-paths'

const external = [
  'react',
  'react-dom',
  'react-hook-form',
  'react-router-dom',
  'react-router',
  'react/jsx-runtime',
  'react-i18next',
  'i18next'
]

export default defineConfig({
  plugins: [
    react(),
    svgr({ include: '**/*.svg' }),
    tsConfigPaths(),
    // @ts-expect-error: @TODO: Fix this. Should be removed, added to enable typechecking
    monacoEditorPlugin.default({
      languageWorkers: ['editorWorkerService', 'json', 'typescript', 'html', 'css']
    })
  ],
  resolve: {
    alias: {
      'vaul/style.css?raw': resolve(__dirname, 'node_modules/vaul/style.css?raw')
    }
  },
  build: {
    lib: {
      cssFileName: 'styles',
      entry: {
        components: resolve(__dirname, 'src/components/index.ts'),
        views: resolve(__dirname, 'src/views/index.ts'),
        utils: resolve(__dirname, 'src/utils/index.ts'),
        hooks: resolve(__dirname, 'src/hooks/index.ts'),
        locales: resolve(__dirname, 'locales/index.ts'),
        index: resolve(__dirname, 'src/index.ts'),
        context: resolve(__dirname, 'src/context/index.ts'),
        types: resolve(__dirname, 'src/types/index.ts'),
        'tailwind.config': resolve(__dirname, 'tailwind.config.js')
      },
      formats: ['es']
    },
    rollupOptions: {
      external
    },
    sourcemap: true,
    target: 'esnext'
  },
  worker: {
    format: 'es'
  }
})
