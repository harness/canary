/**
 * Scaffold a component guide into staging/<slug>/.
 * Usage: tsx scaffold.ts --export Text --source <component.tsx> --category "Typography" \
 *          [--slug text] [--description "..."] [--use-when "..."] [--parts Root,Head,Row,Cell]
 * --parts: compound component. Each part is extracted from <Name>.<Part> and merged into one props.json.
 * Never touches canary. Output: SKILL.md, references/{props.json,pattern.md}, intake.md,
 * components-entry.md, .source.json
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const a = Object.fromEntries(
  process.argv.slice(2).reduce<string[][]>((acc, v, i, arr) => (v.startsWith('--') ? [...acc, [v.slice(2), arr[i + 1]]] : acc), [])
)
if (!a.export || !a.source || !a.category) {
  console.error('required: --export <Name> --source <file> --category <Category>')
  process.exit(1)
}
const Name = a.export
const slug = a.slug ?? Name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
const out = path.join(root, 'staging', slug)
if (fs.existsSync(out) && !('force' in a)) {
  console.error(`${out} exists; pass --force true to overwrite`)
  process.exit(1)
}
fs.mkdirSync(path.join(out, 'references'), { recursive: true })

const tsx = path.join(process.env.CANARY_ROOT ?? path.resolve(root, '../../..'), 'node_modules/.bin/tsx')
const spec = a.parts ? a.parts.split(',').map(p => `${Name}.${p.trim()}`).join(',') : Name
const props = JSON.parse(execFileSync(tsx, [path.join(root, 'scripts/extract-props.ts'), spec, a.source], { encoding: 'utf8' }))
// Compound components keep one flat list; each description names the part(s) the prop is set on (the drawer guide's convention).
for (const p of props.props) {
  if (!p.parts) continue
  p.description = `Set on ${p.parts.join(' or ')}. ${p.description}`
  delete p.parts
}
const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`)
const read = (p: string) => fs.readFileSync(path.join(root, p), 'utf8')

const vars = {
  Name,
  slug,
  category: a.category,
  import: props.code.import,
  description: a.description ?? `TODO(designer): one-line summary of ${Name} and its main options`,
  useWhen: (a['use-when'] ?? `TODO(designer): when to use ${Name}. For X, use Y.`).replace(/'/g, "''"),
  propList: props.props.map((p: any) => p.name).join(', '),
  enumList: props.props
    .filter((p: any) => p.type === 'enum')
    .map((p: any) => `- \`${p.name}\`: ${p.values.map((v: any) => v.name).join(', ')}`)
    .join('\n')
}

fs.writeFileSync(path.join(out, 'SKILL.md'), fill(read('templates/SKILL.md.tmpl'), vars))
fs.writeFileSync(path.join(out, 'references/pattern.md'), fill(read('templates/pattern.md.tmpl'), vars))
fs.writeFileSync(path.join(out, 'references/props.json'), JSON.stringify(props, null, 2) + '\n')
fs.writeFileSync(path.join(out, 'intake.md'), fill(read('intake/designer-intake.md'), vars))
fs.writeFileSync(
  path.join(out, 'components-entry.md'),
  `<!-- add under "## ${a.category}" in components.md -->\n- [${Name}](./${slug}/SKILL.md): ${vars.useWhen.replace(/''/g, "'")}\n`
)
fs.writeFileSync(path.join(out, '.source.json'), JSON.stringify({ export: Name, source: path.resolve(a.source), slug, ...(a.parts ? { parts: a.parts.split(',').map(x => x.trim()) } : {}) }, null, 2))
console.log(`scaffolded ${out}\n  props extracted: ${props.props.length}\n  next: have a designer fill intake.md, then ask Claude to draft from it`)
