/**
 * Lint for a page-level pattern file (page layouts and similar).
 * Usage: tsx lint-pattern.ts <pattern.md> [more.md ...] [--strict]
 * Errors fail (exit 1). TODO(...) markers are warnings, errors under --strict.
 * Checks structure only; it never judges what the designer decided.
 */
import fs from 'node:fs'
import path from 'node:path'

const argv = process.argv.slice(2)
const strict = argv.includes('--strict')
const files = argv.filter(a => !a.startsWith('--'))
if (!files.length) {
  console.error('usage: tsx lint-pattern.ts <pattern.md> [...] [--strict]')
  process.exit(2)
}

const slugOf = (t: string) => t.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s/g, '-')
let total = 0

for (const file of files) {
  const abs = path.resolve(file)
  const name = path.basename(abs)
  const src = fs.readFileSync(abs, 'utf8')
  const errors: string[] = []
  const warns: string[] = []
  const err = (m: string) => errors.push(m)
  const warn = (m: string) => warns.push(m)

  // 1. required structure
  if (!/^Page-level patterns compose existing components\./m.test(src)) err('missing the shared preamble paragraph')
  if (!/^# .+/m.test(src)) err('missing the "# Title" heading')
  if (!/^\*\*Contents\*\*/m.test(src)) err('missing the "**Contents**" list')
  if (!/^\*\*Use when:?\*\*/m.test(src)) err('missing "**Use when:**"')
  if (!/^\*\*Do not use when:?\*\*/m.test(src)) err('missing "**Do not use when:**"')
  for (const h of ['Anatomy', 'Example', "Do's and Don'ts", 'Accessibility', 'Known gaps'])
    if (!new RegExp(`^## ${h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'm').test(src)) err(`missing section "## ${h}"`)
  if (!/Inherits everything in \[rules\.md\]\([^)]*rules\.md\)\./.test(src)) err('missing the closing "Inherits everything in [rules.md](...)." line')

  // 2. contents list matches headings, both ways
  const headings = [...src.matchAll(/^## (.+)$/gm)].map(m => m[1].trim())
  const anchors = new Set(headings.map(slugOf))
  const contents = src.match(/\*\*Contents\*\*\s*\n([\s\S]*?)(?=\n\*\*|\n## |\n# )/)?.[1] ?? ''
  const linked = [...contents.matchAll(/\]\(#([^)]+)\)/g)].map(m => m[1])
  for (const l of linked) if (!anchors.has(l)) err(`contents link #${l} matches no "##" heading`)
  for (const h of headings) if (!linked.includes(slugOf(h))) err(`"## ${h}" is missing from the Contents list`)

  // 3. relative links resolve (skip anchors and urls)
  for (const m of src.matchAll(/\]\((\.{1,2}\/[^)#]+)(#[^)]*)?\)/g)) {
    if (!fs.existsSync(path.resolve(path.dirname(abs), m[1]))) err(`link ${m[1]} does not resolve to a file`)
  }

  // 4. examples obey rules.md
  const code = [...src.matchAll(/```tsx\n([\s\S]*?)```/g)].map(m => m[1]).join('\n')
  const rules: [RegExp, string][] = [
    [/#[0-9a-fA-F]{3,8}\b|\b(rgb|hsl|oklch)a?\(/, 'no-color-literals'],
    [/\b(bg|text|border)-(blue|red|green|gray|slate|white|black)(-\d+)?\b/, 'no-palette-colors'],
    [/\b[\w:-]+-\[[^\]]+\]/, 'no-arbitrary-values'],
    [/\bstyle=\{/, 'no-inline-style'],
    [/<(input|textarea|select|label|button|table|dialog)[\s>]/, 'no-raw-elements'],
    [/from ['"][^'"]*(\/src\/|\/dist\/)/, 'public-imports']
  ]
  for (const [re, id] of rules) if (re.test(code)) err(`example violates rules.md (${id})`)
  const allowed = new Set(['min-w-0', 'min-h-0', 'overflow-auto', 'mx-auto', 'h-full', 'flex-1'])
  for (const m of code.matchAll(/className="([^"]*)"/g))
    for (const c of m[1].split(/\s+/).filter(Boolean))
      if (!/(^|-)cn-/.test(c) && !allowed.has(c)) warn(`example className "${c}" is neither a cn-* class nor a structural utility in rules.md`)

  // 5. patterns carry nothing about Figma
  if (/figma/i.test(src)) err('mentions Figma; patterns are consumer-facing and carry nothing about Figma')

  // 6. unfinished judgment text
  const todos = (src.match(/TODO\((designer|review)\)/g) ?? []).length
  if (todos) (strict ? err : warn)(`${todos} unfilled TODO marker(s)`)

  console.log(`\n${name}`)
  for (const w of warns) console.log('  warn  ' + w)
  for (const e of errors) console.log('  ERROR ' + e)
  if (!warns.length && !errors.length) console.log('  ok')
  total += errors.length
}

console.log(`\n${total} error(s)${strict ? ' [strict]' : ''}`)
process.exit(total ? 1 : 0)
