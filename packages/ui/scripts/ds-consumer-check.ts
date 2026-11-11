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
 * Exits 1 when any rule is violated. Rules are listed in RULES below; each has a stable id so a
 * report can be cited. The scan is syntactic (TypeScript AST + token patterns): it proves
 * these rules hold, not that the design is good.
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

import * as ts from 'typescript'

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
  'DSC-001': 'Imports come from a public @harnessio/ui entry point and every imported name is exported there',
  'DSC-002': 'No color literals (hex, rgb, hsl, oklch)',
  'DSC-003': 'No Tailwind arbitrary values (w-[420px], text-[#333])',
  'DSC-004': 'No raw palette or fixed colors (bg-blue-500, text-white); semantic tokens only',
  'DSC-005': 'No inline style attribute',
  'DSC-006': 'No hand-built form, table or button elements; use the design-system components',
  'DSC-007': 'No className or style on Drawer parts; width and padding come from props',
  'DSC-008': 'Drawer.Root is built with Content, Header, Body and Footer',
  'DSC-009': 'At most one primary Button per file',
  'DSC-010': 'Every cn-* class exists in the shipped stylesheet'
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
    if (ARBITRARY_VALUE.test(text)) add('DSC-003', node, `arbitrary value in "${text.trim().slice(0, 60)}"`)
    if (PALETTE_COLOR.test(text)) add('DSC-004', node, `palette or fixed color in "${text.trim().slice(0, 60)}"`)
    if (cnClasses) {
      for (const m of text.matchAll(CN_CLASS)) {
        if (!cnClasses.has(m[1])) add('DSC-010', node, `unknown class ${m[1]}`)
      }
    }
  }

  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const spec = node.moduleSpecifier.text
      if (spec.startsWith('@harnessio/ui')) {
        if (!publicEntries.has(spec)) {
          add('DSC-001', node, `"${spec}" is not a public entry point`)
        } else if (spec === '@harnessio/ui/components' && componentExports) {
          const bindings = node.importClause?.namedBindings
          if (bindings && ts.isNamedImports(bindings)) {
            for (const el of bindings.elements) {
              const name = (el.propertyName ?? el.name).text
              if (!componentExports.has(name)) add('DSC-001', el, `"${name}" is not exported by ${spec}`)
            }
          }
        }
      }
    }

    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const name = tagName(node.tagName)
      if (RAW_ELEMENTS.has(name)) add('DSC-006', node, `raw <${name}>`)
      if (DRAWER_PARTS.has(name)) {
        drawerParts.add(name)
        for (const attr of node.attributes.properties) {
          if (ts.isJsxAttribute(attr) && ['className', 'style'].includes(attr.name.getText())) {
            add('DSC-007', attr, `${attr.name.getText()} on <${name}>`)
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
        if (attrName === 'style') add('DSC-005', attr, 'inline style attribute')
        if (attrName === 'className' && attr.initializer) {
          for (const s of stringsIn(attr.initializer)) checkClassTokens(s, (s as ts.StringLiteral).text ?? '')
        }
      }
    }

    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      if (COLOR_LITERAL.test(node.text)) add('DSC-002', node, `color literal in "${node.text.slice(0, 40)}"`)
    }

    ts.forEachChild(node, visit)
  }
  visit(source)

  if (primaryButtons > 1)
    violations.push({ rule: 'DSC-009', file, line: 1, message: `${primaryButtons} primary Buttons` })
  if (drawerParts.has('Drawer.Root')) {
    for (const part of ['Drawer.Content', 'Drawer.Header', 'Drawer.Body', 'Drawer.Footer']) {
      if (!drawerParts.has(part)) violations.push({ rule: 'DSC-008', file, line: 1, message: `missing ${part}` })
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

  const publicEntries = loadPublicEntries()
  const componentExports = loadComponentExports()
  const cnClasses = loadCnClasses()
  const files = targets.flatMap(t => collectFiles(path.resolve(t), includeTests))
  const violations = files.flatMap(f => checkFile(f, publicEntries, componentExports, cnClasses))

  console.log(`Scanned ${files.length} file(s)`)
  if (!componentExports)
    console.log('! dist/components.d.ts missing: export-name check (DSC-001) limited to entry points')
  if (!cnClasses) console.log('! dist/styles.css missing: cn-* class check (DSC-010) skipped')
  console.log('')
  for (const [id, description] of Object.entries(RULES)) {
    const hits = violations.filter(v => v.rule === id)
    console.log(`${hits.length === 0 ? 'PASS' : 'FAIL'}  ${id}  ${description}`)
    for (const v of hits) console.log(`        ${path.relative(process.cwd(), v.file)}:${v.line}  ${v.message}`)
  }
  console.log('')
  console.log(violations.length === 0 ? 'All rules passed.' : `${violations.length} violation(s).`)
  process.exit(violations.length === 0 ? 0 : 1)
}

main()
