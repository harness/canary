#!/usr/bin/env node
/**
 * ds-consumer-check: verify that application code built on @harnessio/ui follows the design system.
 *
 * ds-check validates the manifests inside this package. This script checks the other side:
 * code in a consuming app (for example a generated page) against the same rules.
 *
 * Usage:
 *   pnpm ds-check:consumer <dir> [<dir>...]          # scan .ts/.tsx files, skipping tests
 *   pnpm ds-check:consumer <dir> --include-tests
 *
 * Exits 1 when any check fails. Checks are implemented in RULES below and named by readable slug.
 * The checks to run are declared in the frontmatter `checks:` list of the pattern docs
 * (docs/system/shared-rules.md, docs/system/*-patterns.md, schemas/*.md), so each rule's prose and
 * its enforcement share one name. The scan is syntactic (TypeScript AST + token patterns): it proves
 * these rules hold, not that the design is good.
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

import * as ts from 'typescript'
import { parse as parseYaml } from 'yaml'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PACKAGE_ROOT = path.resolve(__dirname, '..')
const DIST_COMPONENTS = path.join(PACKAGE_ROOT, 'dist/components.d.ts')
const DIST_STYLES = path.join(PACKAGE_ROOT, 'dist/styles.css')
const PACKAGE_JSON = path.join(PACKAGE_ROOT, 'package.json')

interface Violation {
  rule: string
  file: string
  line: number
  message: string
}

const RULES: Record<string, string> = {
  'public-imports': 'Imports come from a public @harnessio/ui entry point and every imported name is exported there',
  'no-color-literals': 'No color literals (hex, rgb, hsl, oklch)',
  'no-arbitrary-values': 'No Tailwind arbitrary values (w-[420px], text-[#333])',
  'no-palette-colors': 'No raw palette or fixed colors (bg-blue-500, text-white); semantic tokens only',
  'no-inline-style': 'No inline style attribute',
  'no-raw-elements': 'No hand-built form, table or button elements; use the design-system components',
  'drawer-parts-unstyled': 'No className or style on Drawer parts; width and padding come from props',
  'drawer-complete': 'Drawer.Root is built with Content, Header, Body and Footer',
  'single-primary-button': 'At most one primary Button per file',
  'known-cn-classes': 'Every cn-* class exists in the shipped stylesheet'
}

function frontmatterChecks(file: string): string[] {
  const match = /^---\n([\s\S]*?)\n---/.exec(fs.readFileSync(file, 'utf-8'))
  if (!match) return []
  const data = parseYaml(match[1]) as { checks?: unknown } | null
  return Array.isArray(data?.checks) ? data.checks.map(String) : []
}

function patternDocs(): string[] {
  const list = (dir: string, accept: (name: string) => boolean): string[] =>
    fs.existsSync(dir)
      ? fs
          .readdirSync(dir)
          .filter(accept)
          .map(f => path.join(dir, f))
      : []
  return [
    ...list(path.join(PACKAGE_ROOT, 'docs/system'), f => f === 'shared-rules.md' || f.endsWith('-patterns.md')),
    ...list(path.join(PACKAGE_ROOT, 'schemas'), f => f.endsWith('.md'))
  ]
}

/** Check names declared by pattern docs, mapped to the doc that declares them. */
function loadDeclaredChecks(): Map<string, string> {
  const declared = new Map<string, string>()
  for (const doc of patternDocs()) {
    for (const name of frontmatterChecks(doc)) declared.set(name, path.relative(PACKAGE_ROOT, doc))
  }
  return declared
}

const RAW_ELEMENTS = new Set([
  'input',
  'textarea',
  'select',
  'label',
  'button',
  'table',
  'thead',
  'tbody',
  'tr',
  'td',
  'th',
  'dialog'
])
const DRAWER_PARTS = new Set(['Drawer.Root', 'Drawer.Content', 'Drawer.Header', 'Drawer.Body', 'Drawer.Footer'])
const COLOR_LITERAL = /(^|[^\w&/])#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|\b(?:rgba?|hsla?|oklch|oklab)\(/
const ARBITRARY_VALUE = /(^|[\s:!])-?[a-z][a-z0-9-]*-\[[^\]]+\]/
const PALETTE_COLOR =
  /(?:^|[\s:!])(?:bg|text|border|ring|fill|stroke|from|to|via|divide|outline|decoration|accent|caret|shadow)-(?:(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}|white|black)(?:\/\d+)?(?=$|[\s"'`])/
const CN_CLASS = /(?:^|[\s:!])(cn-[a-z0-9-]+)/g

function loadPublicEntries(): Set<string> {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf-8')) as { name: string; exports: Record<string, unknown> }
  return new Set(Object.keys(pkg.exports).map(key => (key === '.' ? pkg.name : `${pkg.name}/${key.slice(2)}`)))
}

function isPublicEntry(spec: string, publicEntries: Set<string>): boolean {
  if (publicEntries.has(spec)) return true
  for (const entry of publicEntries) {
    if (entry.endsWith('/*') && spec.startsWith(entry.slice(0, -1)) && spec.length > entry.length - 1) return true
  }
  return false
}

function loadComponentExports(): Set<string> | null {
  if (!fs.existsSync(DIST_COMPONENTS)) return null
  const text = fs.readFileSync(DIST_COMPONENTS, 'utf-8')
  const names = new Set<string>()
  for (const m of text.matchAll(/export declare (?:const|function|class|enum|type|interface|namespace) (\w+)/g)) {
    names.add(m[1])
  }
  for (const m of text.matchAll(/export\s*(?:type\s*)?\{([^}]+)\}/g)) {
    for (const part of m[1].split(',')) {
      const name = part
        .trim()
        .split(/\s+as\s+/)
        .pop()
      if (name) names.add(name.replace(/^type\s+/, ''))
    }
  }
  return names
}

function loadCnClasses(): Set<string> | null {
  if (!fs.existsSync(DIST_STYLES)) return null
  const css = fs.readFileSync(DIST_STYLES, 'utf-8')
  return new Set([...css.matchAll(/\.(cn-[a-z0-9-]+)/g)].map(m => m[1]))
}

function collectFiles(target: string, includeTests: boolean): string[] {
  const stat = fs.statSync(target)
  if (stat.isFile()) return [target]
  const files: string[] = []
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const full = path.join(target, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || (!includeTests && entry.name === '__tests__')) continue
      files.push(...collectFiles(full, includeTests))
    } else if (/\.tsx?$/.test(entry.name) && (includeTests || !/\.test\.tsx?$/.test(entry.name))) {
      files.push(full)
    }
  }
  return files
}

function tagName(node: ts.JsxTagNameExpression): string {
  return node.getText()
}

function stringsIn(node: ts.Node): ts.Node[] {
  const found: ts.Node[] = []
  const visit = (n: ts.Node): void => {
    if (
      ts.isStringLiteral(n) ||
      ts.isNoSubstitutionTemplateLiteral(n) ||
      ts.isTemplateHead(n) ||
      ts.isTemplateMiddle(n) ||
      ts.isTemplateTail(n)
    ) {
      found.push(n)
    }
    ts.forEachChild(n, visit)
  }
  visit(node)
  return found
}

function checkFile(
  file: string,
  publicEntries: Set<string>,
  componentExports: Set<string> | null,
  cnClasses: Set<string> | null
): Violation[] {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, 'utf-8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  const violations: Violation[] = []
  const add = (rule: string, node: ts.Node, message: string): void => {
    const { line } = source.getLineAndCharacterOfPosition(node.getStart())
    violations.push({ rule, file, line: line + 1, message })
  }
  let primaryButtons = 0
  const drawerParts = new Set<string>()

  const checkClassTokens = (node: ts.Node, text: string): void => {
    if (ARBITRARY_VALUE.test(text)) add('no-arbitrary-values', node, `arbitrary value in "${text.trim().slice(0, 60)}"`)
    if (PALETTE_COLOR.test(text))
      add('no-palette-colors', node, `palette or fixed color in "${text.trim().slice(0, 60)}"`)
    if (cnClasses) {
      for (const m of text.matchAll(CN_CLASS)) {
        if (!cnClasses.has(m[1])) add('known-cn-classes', node, `unknown class ${m[1]}`)
      }
    }
  }

  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const spec = node.moduleSpecifier.text
      if (spec.startsWith('@harnessio/ui')) {
        if (!isPublicEntry(spec, publicEntries)) {
          add('public-imports', node, `"${spec}" is not a public entry point`)
        } else if (spec === '@harnessio/ui/components' && componentExports) {
          const bindings = node.importClause?.namedBindings
          if (bindings && ts.isNamedImports(bindings)) {
            for (const el of bindings.elements) {
              const name = (el.propertyName ?? el.name).text
              if (!componentExports.has(name)) add('public-imports', el, `"${name}" is not exported by ${spec}`)
            }
          }
        }
      }
    }

    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const name = tagName(node.tagName)
      if (RAW_ELEMENTS.has(name)) add('no-raw-elements', node, `raw <${name}>`)
      if (DRAWER_PARTS.has(name)) {
        drawerParts.add(name)
        for (const attr of node.attributes.properties) {
          if (ts.isJsxAttribute(attr) && ['className', 'style'].includes(attr.name.getText())) {
            add('drawer-parts-unstyled', attr, `${attr.name.getText()} on <${name}>`)
          }
        }
      }
      if (name === 'Button') {
        const isPrimary = node.attributes.properties.some(
          attr =>
            ts.isJsxAttribute(attr) &&
            attr.name.getText() === 'variant' &&
            attr.initializer !== undefined &&
            ts.isStringLiteral(attr.initializer) &&
            attr.initializer.text === 'primary'
        )
        if (isPrimary) primaryButtons += 1
      }
      for (const attr of node.attributes.properties) {
        if (!ts.isJsxAttribute(attr)) continue
        const attrName = attr.name.getText()
        if (attrName === 'style') add('no-inline-style', attr, 'inline style attribute')
        if (attrName === 'className' && attr.initializer) {
          for (const s of stringsIn(attr.initializer)) checkClassTokens(s, (s as ts.StringLiteral).text ?? '')
        }
      }
    }

    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      if (COLOR_LITERAL.test(node.text)) add('no-color-literals', node, `color literal in "${node.text.slice(0, 40)}"`)
    }

    ts.forEachChild(node, visit)
  }
  visit(source)

  if (primaryButtons > 1)
    violations.push({ rule: 'single-primary-button', file, line: 1, message: `${primaryButtons} primary Buttons` })
  if (drawerParts.has('Drawer.Root')) {
    for (const part of ['Drawer.Content', 'Drawer.Header', 'Drawer.Body', 'Drawer.Footer']) {
      if (!drawerParts.has(part))
        violations.push({ rule: 'drawer-complete', file, line: 1, message: `missing ${part}` })
    }
  }
  return violations
}

function main(): void {
  const args = process.argv.slice(2)
  const includeTests = args.includes('--include-tests')
  const targets = args.filter(a => !a.startsWith('--'))
  if (targets.length === 0) {
    console.error('Usage: ds-consumer-check <dir|file>... [--include-tests]')
    process.exit(2)
  }

  const declared = loadDeclaredChecks()
  const unimplemented = [...declared.keys()].filter(name => !(name in RULES))
  const undeclared = Object.keys(RULES).filter(name => !declared.has(name))
  if (unimplemented.length > 0 || undeclared.length > 0) {
    for (const name of unimplemented)
      console.error(`Check "${name}" is declared in ${declared.get(name)} but not implemented`)
    for (const name of undeclared) console.error(`Check "${name}" is implemented but declared in no pattern doc`)
    process.exit(2)
  }

  const publicEntries = loadPublicEntries()
  const componentExports = loadComponentExports()
  const cnClasses = loadCnClasses()
  const files = targets.flatMap(t => collectFiles(path.resolve(t), includeTests))
  const violations = files.flatMap(f => checkFile(f, publicEntries, componentExports, cnClasses))

  console.log(`Scanned ${files.length} file(s)`)
  if (!componentExports)
    console.log('! dist/components.d.ts missing: export-name check (public-imports) limited to entry points')
  if (!cnClasses) console.log('! dist/styles.css missing: cn-* class check (known-cn-classes) skipped')
  console.log('')
  const width = Math.max(...Object.keys(RULES).map(n => n.length))
  for (const [name, description] of Object.entries(RULES)) {
    const hits = violations.filter(v => v.rule === name)
    console.log(`${hits.length === 0 ? 'PASS' : 'FAIL'}  ${name.padEnd(width)}  ${description}`)
    for (const v of hits) console.log(`        ${path.relative(process.cwd(), v.file)}:${v.line}  ${v.message}`)
  }
  console.log('')
  console.log(violations.length === 0 ? 'All checks passed.' : `${violations.length} violation(s).`)
  process.exit(violations.length === 0 ? 0 : 1)
}

main()
