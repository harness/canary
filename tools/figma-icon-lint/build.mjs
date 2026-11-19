// Bundles src/code.js (+ the shared rules from the publish skill) into dist/code.js and copies the UI.
import { build } from 'esbuild'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'

mkdirSync('dist', { recursive: true })
await build({
  entryPoints: ['src/code.js'],
  bundle: true,
  format: 'iife',
  target: 'es2017', // Figma's plugin sandbox
  outfile: 'dist/code.js'
})
// Inline the extracted design tokens (gen-tokens.mjs) into the UI; Figma loads one self-contained file.
writeFileSync('dist/ui.html', readFileSync('src/ui.html', 'utf8').replace('/*TOKENS*/', readFileSync('src/tokens.css', 'utf8')))
console.log('built dist/code.js, dist/ui.html')
