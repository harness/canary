// Extracts ONLY the design tokens the panel uses from @harnessio/core-design-system's built CSS
// (light + dark themes, plus every primitive they reference) into src/tokens.css. The full theme
// files are ~36 KB each; this keeps the plugin UI to a couple of KB while still using the real
// Harness tokens. Requires `pnpm build` in packages/core-design-system first.
import { readFileSync, writeFileSync } from 'fs'

const DIR = '../../packages/core-design-system/dist/styles/'
const SEED = [
  'font-family-default', 'font-size-3', 'rounded-3', 'rounded-4', 'spacing-1', 'spacing-2', 'spacing-3', 'spacing-4',
  'bg-1', 'bg-2', 'bg-3', 'text-1', 'text-2', 'text-3', 'border-2', 'border-3',
  'border-danger', 'border-success', 'border-warning', 'text-danger', 'text-success', 'text-warning',
  'set-brand-primary-bg', 'set-brand-primary-text'
].map(n => `--cn-${n}`)

// `selector{--a:1;--b:2}` blocks -> Map of declarations for the block whose selector list contains `sel`.
function declsFor(file, sel) {
  const css = readFileSync(DIR + file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  const m = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].find(b => b[1].split(',').map(s => s.trim()).includes(sel))
  if (!m) throw new Error(`No ${sel} block in ${file}. Build core-design-system first.`)
  return new Map([...m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(d => [d[1], d[2].trim()]))
}

const light = declsFor('light.css', '.light')
const dark = declsFor('dark.css', '.dark')
const base = new Map([...declsFor('core.css', ':root'), ...declsFor('colors.css', ':root')])

const need = new Set()
function pull(name) {
  if (need.has(name)) return
  need.add(name)
  for (const src of [light, dark, base]) {
    const v = src.get(name)
    if (v) for (const r of v.matchAll(/var\((--[\w-]+)/g)) pull(r[1])
  }
}
SEED.forEach(pull)

const pick = (map, names) => [...names].filter(n => map.has(n)).map(n => `${n}:${map.get(n)}`).join(';')
const semantic = n => light.has(n) || dark.has(n)
const prims = [...need].filter(n => !semantic(n))
const sem = [...need].filter(semantic)

const css =
  `:root{${pick(base, prims)};${pick(light, sem)}}\n` +
  `.figma-dark{${pick(dark, sem)}}\n`
writeFileSync('src/tokens.css', css)
console.log(`tokens: ${need.size} vars, ${css.length} bytes -> src/tokens.css`)
