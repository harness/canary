import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const docsRoot = resolve(packageRoot, '../../apps/portal/src/content/docs')
const output = resolve(packageRoot, 'agent')
const pkg = JSON.parse(readFileSync(resolve(packageRoot, 'package.json'), 'utf8'))
const selected = [
  ['Button', 'actions/button', 'button.tsx'],
  ['TextInput', 'form/text-input', 'inputs/text-input.tsx'],
  ['Select', 'form/select', 'form-primitives/select.tsx']
]
const hash = value => createHash('sha256').update(value).digest('hex')
const records = selected.map(([name, page, source]) => {
  const document = readFileSync(resolve(docsRoot, `components/${page}.mdx`), 'utf8')
  const start = '{/* agent-example:start */}'
  const end = '{/* agent-example:end */}'
  if (document.split(start).length !== 2 || document.split(end).length !== 2)
    throw new Error(`Expected one agent-example marker pair in ${page}`)
  const section = document.slice(document.indexOf(start) + start.length, document.indexOf(end))
  const matches = [...section.matchAll(/code=\{`([\s\S]*?)`\}/g)]
  const match = matches.length === 1 ? matches[0] : undefined
  if (!match || match[1].includes('${'))
    throw new Error(`Unsupported example in ${page}; keep one literal code example inside the agent-example markers`)
  const example = match[1].trim()
  const description = document.match(/^description: (.+)$/m)?.[1] || name
  const implementation = readFileSync(resolve(packageRoot, 'src/components', source), 'utf8')
  const body = example.startsWith('() =>')
    ? `export const Example = ${example}\n`
    : `export function Example(): JSX.Element { return (${example}) }\n`
  return { name, page, description, documentHash: hash(document), sourceHash: hash(implementation), example, body }
})
const setupSource = readFileSync(resolve(docsRoot, 'design-system/usage.mdx'), 'utf8')
const setup = setupSource.match(/<!-- package-guidance:start -->\n([\s\S]*?)\n<!-- package-guidance:end -->/)?.[1]
if (!setup) throw new Error('Missing canonical package setup section')
rmSync(output, { recursive: true, force: true })
mkdirSync(resolve(output, 'components'), { recursive: true })
mkdirSync(resolve(output, 'examples'), { recursive: true })
const header = `Package: ${pkg.name}@${pkg.version}. Generated from canonical documentation.\n\n`
writeFileSync(resolve(output, 'setup.md'), header + setup + '\n')
for (const record of records) {
  writeFileSync(
    resolve(output, `examples/${record.name}.tsx`),
    `import React from 'react'\nimport { ${record.name}, Layout } from '@harnessio/ui/components'\n\n${record.body}`
  )
  writeFileSync(
    resolve(output, `components/${record.name}.md`),
    `# ${record.name}\n\n${header}${record.description}\n\nImport from \`@harnessio/ui/components\`. Read [setup](../setup.md) first.\n\n## Canonical example\n\n\`\`\`tsx\n${record.example}\n\`\`\`\n\n[Compilable example](../examples/${record.name}.tsx)\n\nCoverage: this document supplies the explicitly marked canonical example, not the complete API. Resolve additional props against this package's dist/components.d.ts. Missing coverage is not evidence that a component or prop is unavailable.\n\nSource: apps/portal/src/content/docs/components/${record.page}.mdx\n`
  )
}
writeFileSync(
  resolve(output, 'index.md'),
  `# Canary package guidance\n\n${header}Read only the relevant document. [Setup](setup.md) describes consumer prerequisites.\n\n${records.map(r => `- [${r.name}](components/${r.name}.md): ${r.description}`).join('\n')}\n\nCoverage is limited to setup and these three examples. For other components, inspect the installed declarations and existing consumer patterns. Do not substitute documentation from an unrelated checkout or release. These examples are not a full accessibility or application-integration certification.\n`
)
writeFileSync(
  resolve(output, 'manifest.json'),
  JSON.stringify(
    {
      schemaVersion: 1,
      package: pkg.name,
      version: pkg.version,
      peerDependencies: pkg.peerDependencies,
      index: 'index.md',
      setup: 'setup.md',
      setupSourceSha256: hash(setupSource),
      components: Object.fromEntries(
        records.map(r => [
          r.name,
          {
            document: `components/${r.name}.md`,
            example: `examples/${r.name}.tsx`,
            canonicalSource: `apps/portal/src/content/docs/components/${r.page}.mdx`,
            documentSourceSha256: r.documentHash,
            implementationSourceSha256: r.sourceHash
          }
        ])
      )
    },
    null,
    2
  ) + '\n'
)
console.log(`Generated ${pkg.name}@${pkg.version} guidance for ${records.length} components`)
