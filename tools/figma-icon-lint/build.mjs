// Bundles src/code.js (+ the shared rules from the publish skill) into dist/code.js and copies the UI.
import { build } from 'esbuild'
import { mkdirSync, copyFileSync } from 'fs'

mkdirSync('dist', { recursive: true })
await build({
  entryPoints: ['src/code.js'],
  bundle: true,
  format: 'iife',
  target: 'es2017', // Figma's plugin sandbox
  outfile: 'dist/code.js'
})
copyFileSync('src/ui.html', 'dist/ui.html')
console.log('built dist/code.js, dist/ui.html')
