/**
 * Cross-exam lint for a component guide.
 * Usage: tsx lint.ts <guideDir> [--strict] [--export Name --source file]   (source defaults to <guideDir>/.source.json)
 * Errors fail (exit 1). TODO(...) markers are warnings, errors under --strict (use before copying to canary).
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const argv = process.argv.slice(2)
const dir = path.resolve(argv[0])
const flag = (n: string) => argv[argv.indexOf(`--${n}`) + 1]
const strict = argv.includes('--strict')
const errors: string[] = []
const warns: string[] = []
const err = (f: string, m: string) => errors.push(`${f}: ${m}`)
const warn = (f: string, m: string) => warns.push(`${f}: ${m}`)

const srcMeta = argv.includes('--export')
  ? { export: flag('export'), source: path.resolve(flag('source')), ...(argv.includes('--parts') ? { parts: flag('parts').split(',') } : {}), ...(argv.includes('--include-from') ? { includeFrom: flag('include-from').split(',') } : {}) }
  : JSON.parse(fs.readFileSync(path.join(dir, '.source.json'), 'utf8'))

const skillPath = path.join(dir, 'SKILL.md')
const propsPath = path.join(dir, 'references/props.json')
const patPath = path.join(dir, 'references/pattern.md')
const skill = fs.readFileSync(skillPath, 'utf8')
const doc = JSON.parse(fs.readFileSync(propsPath, 'utf8'))
const pattern = fs.readFileSync(patPath, 'utf8')

// 1. SKILL.md frontmatter and boilerplate
const fm = skill.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''
for (const k of ['name:', 'description:', 'metadata:', '  category:', '  use-when:']) if (!fm.includes(k)) err('SKILL.md', `frontmatter missing "${k}"`)
const name = fm.match(/^name:\s*(.+)$/m)?.[1]?.trim()
if (name && name !== path.basename(dir)) err('SKILL.md', `name "${name}" != folder "${path.basename(dir)}"`)
for (const s of ['references/props.json', 'references/pattern.md', '../rules.md', '../components.md', 'Import only from `@harnessio/ui/components`'])
  if (!skill.includes(s)) err('SKILL.md', `boilerplate missing "${s}"`)
if (!skill.includes(doc.code.import)) err('SKILL.md', `import line does not match props.json (${doc.code.import})`)

// 2. props.json vs source (the cross-exam)
const spec = srcMeta.parts ? srcMeta.parts.map((p: string) => (p === '.' ? srcMeta.export : `${srcMeta.export}.${p}`)).join(',') : srcMeta.export
const truth = JSON.parse(
  execFileSync(path.join(process.env.CANARY_ROOT ?? path.resolve(root, '../../..'), 'node_modules/.bin/tsx'), [path.join(root, 'scripts/extract-props.ts'), spec, srcMeta.source, ...(srcMeta.includeFrom?.length ? ['--include-from', srcMeta.includeFrom.join(',')] : [])], { encoding: 'utf8' })
)
const truthByName = new Map<string, any[]>()
for (const p of truth.props) truthByName.set(p.name, [...(truthByName.get(p.name) ?? []), p])
const docByName = new Map<string, any>(doc.props.map((p: any) => [p.name, p]))
// The same name can be a different prop on different parts (Tabs value). Match a documented entry to the source entry whose parts its description names.
const matched = new Set<any>()
const pickTruth = (p: any) => {
  const c = (truthByName.get(p.name) ?? []).filter(x => !matched.has(x))
  if (c.length <= 1) return c[0]
  const score = (x: any) => (x.parts ?? []).filter((part: string) => p.description?.includes(part)).length - (x.parts ?? []).filter((part: string) => !p.description?.includes(part)).length
  return c.sort((x, y) => score(y) - score(x))[0]
}
// Props documented but not in source (e.g. inherited HTML attrs like className/title) are allowed only if not enum-typed.
for (const p of doc.props) {
  const n = p.name
  const t = pickTruth(p)
  if (t) matched.add(t)
  // Compound: the description must say which part(s) the prop is set on.
  if (t?.parts) for (const part of t.parts) if (!p.description?.includes(part)) warn('props.json', `${n}: description does not mention ${part}`)
  if (!t) { warn('props.json', `prop "${n}" not an own prop in source (inherited attribute?)`); continue }
  if (t.type !== p.type) err('props.json', `${n}: type "${p.type}" != source "${t.type}"`)
  const nd = (x: any) => (x === 'false' || x === false ? undefined : x) // boolean false == unset
  // A cva default on a prop the types require can never apply, so the guide may omit it.
  const unreachableDefault = t.required && p.default === undefined
  if (!unreachableDefault && nd(t.default ?? undefined) !== nd(p.default ?? undefined)) err('props.json', `${n}: default "${p.default}" != source "${t.default}"`)
  if (!!t.required !== !!p.required) err('props.json', `${n}: required mismatch`)
  const sv = new Set((t.values ?? []).map((v: any) => v.name)), dv = new Set((p.values ?? []).map((v: any) => v.name))
  for (const v of dv) if (!sv.has(v)) err('props.json', `${n}: value "${v}" does not exist in source`)
  for (const v of sv) if (!dv.has(v)) err('props.json', `${n}: source value "${v}" missing from guide`)
}
for (const [n, list] of truthByName) for (const t of list) if (!matched.has(t)) err('props.json', `source prop "${n}"${t.parts ? ` (${t.parts.join(', ')})` : ''} missing from guide`)

// 3. pattern.md structure
for (const h of ['Overview', 'Decision Framework', "Do's and Don'ts", 'Examples', 'Accessibility', 'Known Gaps'])
  if (!new RegExp(`^## ${h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'm').test(pattern)) err('pattern.md', `missing section "## ${h}"`)
for (const h of ['Correct', 'Incorrect']) if (!new RegExp(`^### [✅❌] ${h}`, 'm').test(pattern)) err('pattern.md', `missing "### ${h}" examples`)
for (const m of pattern.matchAll(/\]\((#[^)]+)\)/g)) {
  const slugOf = (t: string) => t.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s/g, '-')
  const anchors = [...pattern.matchAll(/^#{1,6} (.+)$/gm)].map(x => slugOf(x[1]))
  if (!anchors.includes(m[1].slice(1))) warn('pattern.md', `contents link ${m[1]} matches no heading`)
}

// 4. examples: ✅ must obey rules.md and use real props; ❌ exempt
const section = (h: string) => pattern.match(new RegExp(`### ${h}[^\\n]*\\n([\\s\\S]*?)(?=\\n### |\\n## |$)`))?.[1] ?? ''
const good = section('✅ Correct')
const rules: [RegExp, string][] = [
  [/#[0-9a-fA-F]{3,8}\b|\b(rgb|hsl|oklch)a?\(/, 'no-color-literals'],
  [/\b(bg|text|border)-(blue|red|green|gray|slate|white|black)(-\d+)?\b/, 'no-palette-colors'],
  [/\b[\w:-]+-\[[^\]]+\]/, 'no-arbitrary-values'],
  [/\bstyle=\{/, 'no-inline-style'],
  [/<(input|textarea|select|label|button|table|dialog)[\s>]/, 'no-raw-elements'],
  [/from ['"][^'"]*(\/src\/|\/dist\/)/, 'public-imports']
]
for (const [re, id] of rules) if (re.test(good)) err('pattern.md', `✅ example violates rules.md (${id})`)
const tagRe = new RegExp(`<${srcMeta.export}\\b([^>]*)>`, 'g')
for (const m of good.matchAll(tagRe))
  for (const a of m[1].matchAll(/\b([a-zA-Z][\w-]*)=(?:"([^"]*)"|\{'([^']*)'\})/g)) {
    const p = docByName.get(a[1]); const val = a[2] ?? a[3]
    if (!p) { if (!/^(id|className|aria-.*|data-.*|href|onClick|title|htmlFor)$/.test(a[1])) warn('pattern.md', `✅ example uses <${srcMeta.export} ${a[1]}> not in props.json`) ; continue }
    if (p.type === 'enum' && !(p.values ?? []).some((v: any) => v.name === val)) err('pattern.md', `✅ example: ${a[1]}="${val}" is not a valid value`)
  }

// 5. unfinished judgment text
const todo = (f: string, s: string) => { const n = (s.match(/TODO\((designer|review)\)/g) ?? []).length; if (n) (strict ? err : warn)(f, `${n} unfilled TODO marker(s)`) }
todo('SKILL.md', skill); todo('pattern.md', pattern); todo('props.json', JSON.stringify(doc))

for (const w of warns) console.log('warn  ' + w)
for (const e of errors) console.log('ERROR ' + e)
console.log(`\n${errors.length} error(s), ${warns.length} warning(s)${strict ? ' [strict]' : ''}`)
process.exit(errors.length ? 1 : 0)
