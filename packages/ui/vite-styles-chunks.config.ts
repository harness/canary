import { resolve } from 'path'

import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

const STYLE_CHUNKS = ['base', 'utilities', 'diff', 'monaco', 'layout', 'overrides'] as const
const chunk = (process.env.STYLE_CHUNK ?? '') as (typeof STYLE_CHUNKS)[number]

if (!STYLE_CHUNKS.includes(chunk)) {
  throw new Error(`STYLE_CHUNK must be one of: ${STYLE_CHUNKS.join(', ')}`)
}

export default defineConfig({
  plugins: [tsConfigPaths()],
  build: {
    outDir: resolve(__dirname, 'dist/chunk-temp'),
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/styles/entries', `${chunk}.ts`),
      name: `styles-${chunk}`,
      formats: ['es'],
      fileName: () => 'styles-chunk-placeholder.js'
    },
    rollupOptions: {
      output: {
        assetFileNames: () => `styles-${chunk}.css`
      }
    },
    sourcemap: false,
    minify: true
  }
})
