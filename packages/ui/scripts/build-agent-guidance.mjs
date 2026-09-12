import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { exportComponentMarkdown } from './export-component-markdown.mjs'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const docsRoot = resolve(packageRoot, '../../apps/portal/src/content/docs')
const output = resolve(packageRoot, 'agent')
const pkg = JSON.parse(readFileSync(resolve(packageRoot, 'package.json'), 'utf8'))
const selected = [
  ['Button', 'actions/button', 'button.tsx', 'Default Button', []],
  ['TextInput', 'form/text-input', 'inputs/text-input.tsx', '', ['Layout']],
  ['Select', 'form/select', 'form-primitives/select.tsx', '', []]
]
const hash = value => createHash('sha256').update(value).digest('hex')
const records = selected.map(([name, page, source, exampleSection, additionalImports]) => {
  const document = readFileSync(resolve(docsRoot, `components/${page}.mdx`), 'utf8')
  const exported = exportComponentMarkdown(document, exampleSection)
  const { example, description } = exported
  const implementation = readFileSync(resolve(packageRoot, 'src/components', source), 'utf8')
  const body = example.startsWith('() =>')
    ? `export const Example: () => React.ReactElement = ${example}\n`
    : `export function Example(): React.ReactElement { return (${example}) }\n`
  return {
    ...exported,
    name,
    page,
    exampleSection,
    imports: [name, ...additionalImports],
    description,
    documentHash: hash(document),
    sourceHash: hash(implementation),
    example,
    body
  }
})
const setupSource = readFileSync(resolve(docsRoot, 'design-system/usage.mdx'), 'utf8')
const setup = setupSource.match(
  /\{\/\* package-guidance:start \*\/\}\n([\s\S]*?)\n\{\/\* package-guidance:end \*\/\}/
)?.[1]
if (!setup) throw new Error('Missing canonical package setup section')
rmSync(output, { recursive: true, force: true })
mkdirSync(resolve(output, 'components'), { recursive: true })
mkdirSync(resolve(output, 'examples'), { recursive: true })
const header = `Package: ${pkg.name}@${pkg.version}. Generated from canonical documentation.\n\n`
writeFileSync(resolve(output, 'setup.md'), header + setup + '\n')
for (const record of records) {
  writeFileSync(
    resolve(output, `examples/${record.name}.tsx`),
    `import React from 'react'\nimport { ${record.imports.join(', ')} } from '@harnessio/ui/components'\n\n${record.body}`
  )
  writeFileSync(
    resolve(output, `components/${record.name}.md`),
    `# ${record.name}\n\n${header}${record.description}\n\nImport from \`@harnessio/ui/components\`. Read [setup](../setup.md) first.\n\n${record.markdown}\n\n## Package verification scope\n\n[Standalone starter example](../examples/${record.name}.tsx). Export includes ${record.exampleCount} live-example snippets and ${record.propCount} documented prop rows from this page. Exported snippets retain the documentation site's shared scope; they are not all standalone or type-checked. The packaged starter is selected from ${record.exampleSection ? `the "${record.exampleSection}" section` : 'the introductory section'}. Consult installed dist/components.d.ts for the complete contract; export does not certify documentation accuracy or runtime behavior.\n\nSource: apps/portal/src/content/docs/components/${record.page}.mdx\n`
  )
}
writeFileSync(
  resolve(output, 'index.md'),
  `# Canary package guidance\n\n${header}Read only the relevant document. [Setup](setup.md) describes consumer prerequisites.\n\n${records.map(r => `- [${r.name}](components/${r.name}.md): ${r.description}`).join('\n')}\n\nCoverage is limited to setup and these three component pages, with one standalone starter example each. For other components, inspect the installed declarations and existing consumer patterns. Do not substitute documentation from an unrelated checkout or release. These examples are not a full accessibility or application-integration certification.\n`
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
            liveExampleCount: r.exampleCount,
            documentedPropCount: r.propCount,
            starterExampleSection: r.exampleSection || 'introduction',
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
