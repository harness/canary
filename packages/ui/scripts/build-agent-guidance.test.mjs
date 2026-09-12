import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

import { exportComponentMarkdown } from './export-component-markdown.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const page = body => `---\ntitle: Demo\ndescription: A demo\n---\n\n${body}`
const example = '<DocsPage.ComponentExample client:only code={`<Button>Run</Button>`} />'

test('converts existing presentation components without losing Markdown or prop fields', () => {
  const prose = 'Use **carefully**. Read [setup](../setup.md).\n\n```tsx\nimport { Button } from "package"\n```'
  const result = exportComponentMarkdown(
    page(
      `${prose}\n\n${example}\n\n## Props\n\n<DocsPage.PropsTable props={[{name:'value', value:'string | undefined', required:false, defaultValue:'', description:'A <value> with a pipe | and newline\\nhere.'}]} />\n\n<Aside title="Important">\n\nKeep this caveat.\n\n</Aside>`
    ),
    ''
  )
  assert.ok(result.markdown.includes(prose))
  assert.ok(result.markdown.includes('```tsx\n<Button>Run</Button>\n```'))
  assert.ok(
    result.markdown.includes(
      '| value | string &#124; undefined | false |  | A &lt;value&gt; with a pipe &#124; and newline<br>here. |'
    )
  )
  assert.ok(result.markdown.includes('> **Important**\n>\n> Keep this caveat.'))
  assert.equal(result.propCount, 1)
  assert.equal(result.exampleCount, 1)
})

test('decodes escaped template literals without evaluating nested example expressions', () => {
  const code = '() => <span>{`Count ${count}`}</span>'
  const escaped = code.replaceAll('`', '\\`').replaceAll('${', '\\${')
  const result = exportComponentMarkdown(page('<DocsPage.ComponentExample code={`' + escaped + '`} />'), '')
  assert.equal(result.example, code)
  assert.ok(result.markdown.includes(code))
})

test('rejects dynamic expressions, unknown MDX and props instead of silently dropping them', () => {
  for (const unsupported of [
    '<DocsPage.ComponentExample code={exampleFromImport} />',
    '<DocsPage.ComponentExample code={`<span>${unknown}</span>`} />',
    '<DocsPage.ComponentExample {...args} />',
    '<DocsPage.ComponentExample code={`<span />`} scope={{unknown}} />',
    '<DocsPage.PropsTable props={[{name:"x", ...other}]} />',
    '<DocsPage.PropsTable props={[{name:"x", newField:"unhandled"}]} />',
    '<Unknown>Important information</Unknown>',
    '{dynamicContent}',
    'export const content = "unhandled"'
  ])
    assert.throws(
      () => exportComponentMarkdown(page(example + '\n\n' + unsupported), ''),
      /Unsupported component documentation/
    )
})

test('starter selection follows a named section and rejects ambiguous selection', () => {
  const result = exportComponentMarkdown(
    page(
      '## Other\n\n' + example + '\n\n## Starter\n\n<DocsPage.ComponentExample code={`<Button>Starter</Button>`} />'
    ),
    'Starter'
  )
  assert.equal(result.example, '<Button>Starter</Button>')
  assert.throws(() => exportComponentMarkdown(page(example + '\n\n' + example), ''), /exactly one example/)
})

test('canonical setup is valid MDX for the documentation site', () => {
  const source = readFileSync(resolve(root, 'apps/portal/src/content/docs/design-system/usage.mdx'), 'utf8')
  const body = source.replace(/^---\n[\s\S]*?\n---\n/, '')
  assert.doesNotThrow(() => unified().use(remarkParse).use(remarkMdx).parse(body))
})

test('exports all three real pages and preserves an existing output if conversion fails', () => {
  const fixture = mkdtempSync(resolve(tmpdir(), 'canary-guidance-export-'))
  try {
    for (const path of [
      'packages/ui/package.json',
      'packages/ui/scripts/build-agent-guidance.mjs',
      'packages/ui/scripts/export-component-markdown.mjs',
      'packages/ui/src/components/button.tsx',
      'packages/ui/src/components/inputs/text-input.tsx',
      'packages/ui/src/components/form-primitives/select.tsx',
      'apps/portal/src/content/docs/design-system/usage.mdx',
      'apps/portal/src/content/docs/components/actions/button.mdx',
      'apps/portal/src/content/docs/components/form/text-input.mdx',
      'apps/portal/src/content/docs/components/form/select.mdx'
    ])
      cpSync(resolve(root, path), resolve(fixture, path), { recursive: true })
    symlinkSync(resolve(root, 'packages/ui/node_modules'), resolve(fixture, 'packages/ui/node_modules'))
    const script = resolve(fixture, 'packages/ui/scripts/build-agent-guidance.mjs')
    execFileSync(process.execPath, [script])
    const manifest = JSON.parse(readFileSync(resolve(fixture, 'packages/ui/agent/manifest.json'), 'utf8'))
    for (const [name, record] of Object.entries(manifest.components)) {
      const source = readFileSync(resolve(fixture, record.canonicalSource), 'utf8')
      const md = readFileSync(resolve(fixture, 'packages/ui/agent', record.document), 'utf8')
      assert.doesNotMatch(source, /agent-example:/)
      assert.equal(record.liveExampleCount, source.split('<DocsPage.ComponentExample').length - 1)
      assert.equal(record.documentedPropCount, [...source.matchAll(/^\s+name: "/gm)].length)
      for (const heading of source.match(/^## .+$/gm)) assert.ok(md.includes(heading), `${name}: ${heading}`)
      assert.doesNotMatch(md, /<DocsPage\.|<Aside/)
    }
    const setup = readFileSync(resolve(fixture, 'packages/ui/agent/setup.md'), 'utf8')
    assert.match(setup, /## Installed-package consumers/)
    assert.doesNotMatch(setup, /package-guidance:|## Setup/)
    const select = readFileSync(resolve(fixture, 'packages/ui/agent/components/Select.md'), 'utf8')
    assert.ok(select.includes('Dropdown opened ${openCount} time(s)'))
    assert.ok(select.includes('> **Note**'))
    const output = resolve(fixture, 'packages/ui/agent/examples/Select.tsx')
    const expected = readFileSync(output, 'utf8')
    const source = resolve(fixture, manifest.components.Select.canonicalSource)
    writeFileSync(source, readFileSync(source, 'utf8') + '\n\n<Unknown />\n')
    const failed = spawnSync(process.execPath, [script], { encoding: 'utf8' })
    assert.notEqual(failed.status, 0)
    assert.match(failed.stderr, /Unsupported component documentation/)
    assert.equal(readFileSync(output, 'utf8'), expected)
  } finally {
    rmSync(fixture, { recursive: true, force: true })
  }
})
