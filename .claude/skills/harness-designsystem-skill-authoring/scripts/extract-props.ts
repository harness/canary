/**
 * Derive a props.json skeleton from canary component source using the TypeScript compiler API.
 * Usage: tsx extract-props.ts <ExportName> <path/to/component.tsx> [canaryRoot]
 * Compound components: pass dotted parts, comma separated (Table.Root,Table.Row). Props are merged by name; each
 * prop carries `parts` (where it is set) so descriptions and the lint can name the part.
 * Writes JSON to stdout. Judgment fields are emitted as "TODO(designer): ..." and fail the lint until filled.
 */
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const [exportName, componentFile, canaryRootArg] = process.argv.slice(2)
if (!exportName || !componentFile) {
  console.error('usage: extract-props <ExportName> <component.tsx> [canaryRoot]')
  process.exit(1)
}
const canaryRoot = path.resolve(canaryRootArg ?? process.env.CANARY_ROOT ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..'))
const uiRoot = path.join(canaryRoot, 'packages/ui')
const ts: typeof import('typescript') = createRequire(path.join(canaryRoot, 'package.json'))('typescript')

const cfgPath = path.join(uiRoot, 'tsconfig.json')
const cfg = ts.readConfigFile(cfgPath, ts.sys.readFile)
const parsed = ts.parseJsonConfigFileContent(cfg.config, ts.sys, uiRoot)
const file = path.resolve(componentFile)
if (!ts.sys.fileExists(file)) throw new Error(`source file not found: ${file} (is it a folder? pass the .tsx that exports ${exportName})`)
const program = ts.createProgram({ rootNames: [file], options: { ...parsed.options, noEmit: true, types: [] } })
const checker = program.getTypeChecker()
const sf = program.getSourceFile(file)!
const modSym = checker.getSymbolAtLocation(sf)!
const extractOne = (spec: string): any[] => {
  // Dotted names (Table.Row) address a part of a compound export; the part's component is declared as <Parent><Part> in the file.
  const [parentName, partName] = spec.split('.')
  const exp = checker.getExportsOfModule(modSym).find(s => s.name === parentName)
  if (!exp) throw new Error(`export ${parentName} not found in ${file}`)
  let expType = checker.getTypeOfSymbolAtLocation(exp, sf)
  if (partName) {
    const part = expType.getProperty(partName)
    if (!part) throw new Error(`part ${partName} not found on ${parentName}`)
    expType = checker.getTypeOfSymbolAtLocation(part, sf)
  }
  const declName = partName ? `${parentName}${partName}` : spec

  // Props type = first parameter of the first call signature.
  const sig = expType.getCallSignatures()[0]
  if (!sig) throw new Error('no call signature (compound components not supported yet; run per subcomponent)')
  const paramSym = sig.getParameters()[0]
  let propsType = checker.getTypeOfSymbolAtLocation(paramSym, sf)
  propsType = checker.getApparentType(checker.getBaseConstraintOfType(propsType) ?? propsType)

  // Defaults: cva defaultVariants + destructuring defaults in the component body.
  const defaults: Record<string, string> = {}
  const walk = (n: import('typescript').Node) => {
    if (ts.isPropertyAssignment(n) && n.name.getText() === 'defaultVariants' && ts.isObjectLiteralExpression(n.initializer))
      for (const p of n.initializer.properties)
        if (ts.isPropertyAssignment(p)) defaults[p.name.getText()] = p.initializer.getText().replace(/^['"]|['"]$/g, '')
    ts.forEachChild(n, walk)
  }
  // Defaults live where the component is declared, which may differ from the file that exports it (index.ts re-exports).
  const declSf = sig.declaration?.getSourceFile()
  const dsf = declSf && !/node_modules|typescript\/lib\//.test(declSf.fileName) ? declSf : sf
  walk(dsf)
  // Destructuring defaults: only inside the exported component's own declaration (not sibling components in the file).
  const walkBindings = (n: import('typescript').Node) => {
    if (ts.isBindingElement(n) && n.initializer && ts.isIdentifier(n.name))
      defaults[n.name.text] ??= n.initializer.getText().replace(/^['"]|['"]$/g, '')
    ts.forEachChild(n, walkBindings)
  }
  dsf.forEachChild(function find(n) {
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && [declName, `${declName}WithRef`].includes(n.name.text)) walkBindings(n)
    else ts.forEachChild(n, find)
  })

  const isOwn = (s: import('typescript').Symbol) =>
    (s.declarations ?? []).some(d => {
      const f = d.getSourceFile().fileName
      return !f.includes('node_modules') && !/typescript\/lib\//.test(f)
    })

  const props: any[] = []
  for (const s of checker.getPropertiesOfType(propsType)) {
    if (!isOwn(s) || s.name === 'ref' || s.name === 'children') continue
    const declared = checker.typeToString(checker.getTypeOfSymbolAtLocation(s, sf))
    const t = checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(s, sf))
    const optional = !!(s.flags & ts.SymbolFlags.Optional)
    const doc = ts.displayPartsToString(s.getDocumentationComment(checker)).replace(/\s+/g, ' ').trim()
    const prop: any = { name: s.name, type: 'string', description: doc || 'TODO(designer): describe what this prop is for and how to choose its value.' }
    const members = t.isUnion() ? t.types : [t]
    const lits = members.filter(m => m.isStringLiteral() || m.isNumberLiteral()) as any[]
    const bool = members.some(m => m.flags & ts.TypeFlags.BooleanLiteral)
    // `'asc' | 'desc' | false`: false means "none", described in the guide, not an enum value.
    const nonFalse = members.filter(m => !(m.flags & ts.TypeFlags.Undefined) && !((m.flags & ts.TypeFlags.BooleanLiteral) && checker.typeToString(m) === 'false'))
    if (lits.length > 40) prop.type = 'string' // huge unions (icon names) stay free-form; see notes in the guide
    else if (/\bReact(Node|Element)\b/.test(declared)) prop.type = 'node'
    else if (lits.length && lits.length === nonFalse.length) {
      prop.type = 'enum'
      prop.values = lits.map(l => ({ name: String(l.value), whenToUse: 'TODO(designer): when to pick this value.' }))
    } else if (bool && nonFalse.every(m => m.flags & ts.TypeFlags.BooleanLiteral)) prop.type = 'boolean'
    else if (t.getCallSignatures().length) prop.type = 'function'
    else if (t.flags & ts.TypeFlags.Number) prop.type = 'number'
    else if (t.flags & ts.TypeFlags.String) prop.type = 'string'
    else if (t.flags & ts.TypeFlags.Object) prop.type = 'object'
    else if (members.some(m => m.flags & (ts.TypeFlags.String | ts.TypeFlags.StringLiteral))) prop.type = 'string'
    else if (/Ref\b|Props\b/.test(declared) || t.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown | ts.TypeFlags.Union)) prop.type = 'object'
    if (defaults[s.name] !== undefined) prop.default = defaults[s.name]
    if (!optional) prop.required = true
    props.push(prop)
  }
  return props
}

const specs = exportName.split(',')
const byName = new Map<string, any>()
for (const spec of specs)
  for (const prop of extractOne(spec)) {
    const prev = byName.get(prop.name)
    if (prev) {
      // Same name on two parts is one prop only if it is the same prop. Otherwise one flat list cannot describe both.
      const sig = (x: any) => JSON.stringify([x.type, !!x.required, x.default ?? null, (x.values ?? []).map((v: any) => v.name)])
      if (sig(prev) !== sig(prop))
        throw new Error(`prop "${prop.name}" differs between ${prev.parts.join(', ')} and ${spec}; extract those parts into separate guides`)
      prev.parts.push(spec)
    }
    else byName.set(prop.name, { ...prop, ...(specs.length > 1 || spec.includes('.') ? { parts: [spec] } : {}) })
  }
const props = [...byName.values()]
const rootName = exportName.split(',')[0].split('.')[0]
// A single part (DataTable.ColumnFilter) is its own guide: it keeps its full name and id, and imports from the root.
const fullName = specs.length === 1 ? exportName : rootName

const out = {
  id: `canary.${fullName.replace(/\./g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`,
  code: {
    package: '@harnessio/ui',
    export: fullName,
    import: `import { ${rootName} } from '@harnessio/ui/components'`
  },
  props
}
console.log(JSON.stringify(out, null, 2))
