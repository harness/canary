// Builds .design-sync/.cache/pkg: a view of packages/ui whose dist/ stubs the
// lazy-loaded shiki grammars/themes and monaco chunks, which otherwise push
// _ds_bundle.js past the 12 MB upload cap. Real dist/ is never modified.
import { lstatSync, readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, symlinkSync, copyFileSync } from 'node:fs'
import { join, resolve, relative } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const ui = join(root, 'packages/ui')
const dist = join(ui, 'dist')
const out = join(root, '.design-sync/.cache/pkg')

rmSync(out, { recursive: true, force: true })
mkdirSync(join(out, 'dist'), { recursive: true })

const link = (target, path) => symlinkSync(relative(join(path, '..'), target), path)
link(join(ui, 'src'), join(out, 'src'))
link(join(ui, 'node_modules'), join(out, 'node_modules'))

const lazy = new Set()
const dynRx = /import\("\.\/([^"]+\.js)"\)/g
for (const f of readdirSync(dist).filter((n) => n.endsWith('.js'))) {
  for (const m of readFileSync(join(dist, f), 'utf8').matchAll(dynRx)) lazy.add(m[1])
}
// monaco core chunk is only statically imported by the lazy language chunks
const monaco = readdirSync(dist).filter((n) => /^index-tNWUyI8F\.js$/.test(n))
monaco.forEach((n) => lazy.add(n))

for (const f of readdirSync(dist)) {
  const p = join(out, 'dist', f)
  if (lazy.has(f)) writeFileSync(p, 'export default []\n')
  else if (f.endsWith('.js.map')) continue
  else if (f === 'components.d.ts') writeFileSync(p, readFileSync(join(dist, f), 'utf8').replaceAll("from '..'", "from './components'"))
  else if (lstatSync(join(dist, f)).isDirectory()) link(join(dist, f), p)
  else copyFileSync(join(dist, f), p)
}

const pkg = JSON.parse(readFileSync(join(ui, 'package.json'), 'utf8'))
Object.assign(pkg, { types: './dist/components.d.ts', main: './dist/components.js' })
delete pkg.module
delete pkg.publishConfig
writeFileSync(join(out, 'package.json'), JSON.stringify(pkg, null, 2))
console.error(`staged ${out}: ${lazy.size} lazy chunks stubbed`)
