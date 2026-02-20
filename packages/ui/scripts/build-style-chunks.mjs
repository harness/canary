import { mkdir, rename, rm } from 'fs/promises'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = join(__dirname, '..')
const distDir = join(root, 'dist')
const chunkTempDir = join(distDir, 'chunk-temp')

const CHUNKS = ['base', 'utilities', 'diff', 'monaco', 'layout', 'overrides']

for (const chunk of CHUNKS) {
  const result = spawnSync(
    'pnpm',
    ['exec', 'vite', 'build', '--config', './vite-styles-chunks.config.ts'],
    {
      cwd: root,
      stdio: 'inherit',
      env: { ...process.env, STYLE_CHUNK: chunk }
    }
  )
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }

  const cssFile = join(chunkTempDir, `styles-${chunk}.css`)
  const dest = join(distDir, `styles-${chunk}.css`)
  await rename(cssFile, dest)
}

await rm(chunkTempDir, { recursive: true, force: true })
console.log('Style chunks built: ' + CHUNKS.map((c) => `styles-${c}.css`).join(', '))
