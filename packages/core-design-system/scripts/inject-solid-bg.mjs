import fs from 'node:fs'
import path from 'node:path'

// Dropdown indicator items reference `--cn-set-<color>-solid-bg` tokens that never
// existed. Add a neutral solid swatch per color, pointing at the raw palette weight
// that this mode already uses for that hue's prominent fill (so it stays mode-correct).
//
// Each dropdown color maps to a raw palette by NAME (not to a semantic family — those
// hue-shift across modes, e.g. `forest-green` -> lime in dark). We discover the right
// mode-appropriate weight by finding the family whose `primary.bg` references that palette.
const PALETTE = {
  gray: 'gray', green: 'forest', red: 'red', yellow: 'yellow', blue: 'blue',
  purple: 'purple', brown: 'brown', cyan: 'cyan', indigo: 'indigo', lime: 'lime',
  mint: 'mint', orange: 'orange', pink: 'pink', violet: 'violet'
}

const DRY_RUN = process.argv.includes('--dry')
const ROOT = path.resolve('design-tokens')

const files = []
for (const mode of ['light', 'dark']) {
  const dir = path.join(ROOT, 'mode', mode)
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue
    const full = path.join(dir, f)
    if (JSON.parse(fs.readFileSync(full, 'utf8')).set) files.push(full)
  }
}

// Find the raw palette reference (e.g. "{forest.700}") this file uses for a given hue.
function paletteValue(setObj, palette, color) {
  const matches = []
  for (const [family, groups] of Object.entries(setObj)) {
    const v = groups?.primary?.bg?.$value
    if (typeof v === 'string' && new RegExp(`^\\{${palette}\\.\\d+\\}$`).test(v)) {
      matches.push([family, v])
    }
  }
  if (matches.length === 0) throw new Error(`no primary.bg references {${palette}.*}`)
  const named = matches.find(([family]) => family === color)
  if (named) return named[1]
  if (matches.length === 1) return matches[0][1]
  throw new Error(`ambiguous palette ${palette} for ${color}: ${matches.map(m => m[0]).join(', ')}`)
}

let touched = 0
for (const full of files) {
  const raw = fs.readFileSync(full, 'utf8')
  const d = JSON.parse(raw)

  // Guard: never silently reformat a whole token file.
  if (JSON.stringify(d, null, 2) + '\n' !== raw) {
    console.error(`SKIP (would reformat): ${full}`)
    continue
  }

  for (const [color, palette] of Object.entries(PALETTE)) {
    const value = paletteValue(d.set, palette, color)
    const token = {
      $type: 'color',
      $value: value,
      $description: `Solid fill color for ${color} indicators and swatches (e.g. dropdown menu indicator items).`
    }
    if (d.set[color]) d.set[color].solid = { bg: token }
    else d.set[color] = { solid: { bg: token } }
  }

  if (!DRY_RUN) fs.writeFileSync(full, JSON.stringify(d, null, 2) + '\n')
  touched++
}
console.log(`${DRY_RUN ? '[dry] ' : ''}Injected solid.bg into ${touched}/${files.length} mode files.`)
