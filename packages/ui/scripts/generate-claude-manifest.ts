/**
 * generate-claude-manifest.ts
 *
 * Emits packages/ui/.claude/manifest.json — a machine-readable component manifest
 * for AI codegen/grounding tools. Fixes the broken `./.claude/manifest.json`
 * package export (declared in package.json `exports`/`files`, never generated).
 *
 * Source of truth is the built type surface of the `@harnessio/ui/components`
 * subpath: dist/components.d.ts. That file is bundled by rollup-plugin-dts, so
 * every local type is inlined; React / Radix / 3rd-party types resolve from this
 * package's node_modules (@types/react is pinned to 17 here).
 *
 * The manifest is MECHANICAL truth only — names, import paths, variant enums,
 * required props (merged + per-discriminated-branch), and subcomponents. Judgment
 * (when-to-use, token sets, usage-brief refs) is overlaid downstream and is not
 * this script's concern.
 *
 * Run:  pnpm --filter @harnessio/ui manifest
 *   (or) node --experimental-strip-types scripts/generate-claude-manifest.ts [--check]
 *
 * --check  : generate in-memory and diff against the committed manifest; exit 1
 *            if they differ (CI staleness guard). Writes nothing.
 */

import {
  Project,
  Node,
  SymbolFlags,
  ts,
  type Type,
  type Symbol as MorphSymbol,
  type SourceFile,
} from 'ts-morph'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(HERE, '..') // packages/ui
const DTS_PATH = join(PKG_ROOT, 'dist', 'components.d.ts')
const OUT_DIR = join(PKG_ROOT, '.claude')
const OUT_PATH = join(OUT_DIR, 'manifest.json')
const IMPORT_PATH = '@harnessio/ui/components'

// Props that are never author-meaningful API: ref/key are injected by
// ForwardRefExoticComponent; asChild is the Radix slot escape hatch.
const NOISE_PROPS = new Set(['ref', 'key'])

// A variant axis is a small set of named choices (Button.variant has 7,
// Tag.theme has 15). Value spaces like icon names (~500 literals) are not
// variants — they're recorded as a count in `largeEnumProps`, not enumerated.
const ENUM_CAP = 40

// React's global HTML/ARIA attributes get physically inlined into the bundled
// d.ts for a few components (rollup-plugin-dts hoists HTMLAttributes), so they
// pass the declaration-source-file ownership test despite being inherited DOM
// noise. They are never a designed variant axis — drop them by name.
function isDomNoiseProp(name: string): boolean {
  if (name.startsWith('aria-') || name.startsWith('data-')) return true
  return DOM_GLOBAL_PROPS.has(name)
}
const DOM_GLOBAL_PROPS = new Set([
  'role',
  'contentEditable',
  'draggable',
  'spellCheck',
  'translate',
  'dir',
  'autoCapitalize',
  'autoCorrect',
  'inputMode',
  'enterKeyHint',
  'hidden',
  'tabIndex',
  'accessKey',
  'autoFocus',
  'slot',
  'itemScope',
])

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ComponentRecord {
  name: string
  importPath: string
  shape: 'forwardRef' | 'compound' | 'arrow' | 'fc' | 'function'
  /** own string/number variant axes -> allowed literal values (cva variants) */
  variantEnums: Record<string, string[]>
  /** own boolean props (loading, disabled, dismissible, …) — present/absent */
  booleanProps: string[]
  /** own props with a literal value-space too large to enumerate -> its size */
  largeEnumProps: Record<string, number>
  /** required props on the merged (apparent) type — the safe minimum to render */
  requiredProps: string[]
  /**
   * required props that exist only inside a discriminated-union branch
   * (e.g. Button.iconOnly, Accordion.type). Empty for non-union props.
   */
  perBranchRequired: string[][]
  /**
   * compound subcomponents, each with its own variants/required props
   * (Accordion -> {name:"Root", variantEnums:{…}}, {name:"Item"}, …).
   * Empty for non-compound components.
   */
  subcomponents: SubcomponentRecord[]
}

interface SubcomponentRecord {
  /** accessor key, e.g. "Root" — used as `<Accordion.Root>` */
  name: string
  variantEnums: Record<string, string[]>
  booleanProps: string[]
  largeEnumProps: Record<string, number>
  requiredProps: string[]
  /** discriminated-union obligations, as on top-level components (Dialog.Close) */
  perBranchRequired: string[][]
}

// ---------------------------------------------------------------------------
// Project setup — standalone d.ts with this package's node_modules for types
// ---------------------------------------------------------------------------

function makeProject(): Project {
  return new Project({
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      jsx: ts.JsxEmit.ReactJSX,
      strict: true, // strictNullChecks ON so optionality is honest
      skipLibCheck: true,
      skipDefaultLibCheck: true,
      // resolve react/radix/etc. from this package's installed modules.
      baseUrl: PKG_ROOT,
      typeRoots: [join(PKG_ROOT, 'node_modules', '@types')],
    },
    skipAddingFilesFromTsConfig: true,
  })
}

// ---------------------------------------------------------------------------
// Resolving a declaration to its props Type
// ---------------------------------------------------------------------------

/** Strip a `P & RefAttributes<E>` (forwardRef) intersection down to `P`. */
function unwrapRefAttributes(t: Type): Type {
  if (!t.isIntersection()) return t
  const keep = t.getIntersectionTypes().filter((part) => {
    const sym = part.getSymbol() ?? part.getAliasSymbol()
    const name = sym?.getName() ?? ''
    return name !== 'RefAttributes' && name !== 'PropsWithoutRef'
  })
  if (keep.length === 0) return t
  if (keep.length === 1) return keep[0]
  // ts-morph has no "make intersection"; the apparent props of the original
  // already merge correctly, so fall back to the original here.
  return t
}

/**
 * Given an exported declaration node, resolve the Type representing its props.
 * Returns null for things that aren't components (handled by the caller's
 * isComponent gate, but defensive here too).
 */
function propsTypeFor(decl: Node): Type | null {
  // forwardRef / FC / variable consts: ComponentType<P> — the props are the
  // first type argument of the component type, or the sole call-signature param.
  if (Node.isVariableDeclaration(decl) || Node.isPropertyAssignment(decl)) {
    const t = decl.getType()
    return propsFromComponentType(t)
  }
  if (Node.isFunctionDeclaration(decl)) {
    const params = decl.getParameters()
    return params.length ? params[0].getType() : null
  }
  return null
}

/** Extract the props Type from a resolved component value type. */
function propsFromComponentType(t: Type): Type | null {
  // ForwardRefExoticComponent<P & RefAttributes<E>>, FC<P>, etc. all expose
  // their props as the first param of their construct/call signature.
  const sigs = [...t.getCallSignatures(), ...t.getConstructSignatures()]
  for (const sig of sigs) {
    const params = sig.getParameters()
    if (params.length) {
      const decl = params[0].getValueDeclaration() ?? params[0].getDeclarations()[0]
      if (decl) return unwrapRefAttributes(params[0].getTypeAtLocation(decl))
    }
  }
  // Type-argument fallback: ForwardRefExoticComponent<Props>.
  const args = t.getTypeArguments()
  if (args.length) return unwrapRefAttributes(args[0])
  return null
}

// ---------------------------------------------------------------------------
// Prop extraction
// ---------------------------------------------------------------------------

/** Is this symbol declared inside our own d.ts (vs. inherited from @types)? */
function isOwnProp(sym: MorphSymbol, dts: SourceFile): boolean {
  const decls = sym.getDeclarations()
  if (decls.length === 0) return false
  return decls.some((d) => d.getSourceFile().getFilePath() === dts.getFilePath())
}

type EnumKind =
  | { kind: 'boolean' }
  | { kind: 'enum'; values: string[]; alsoBoolean?: boolean }
  | { kind: 'large'; size: number; alsoBoolean?: boolean }
  | { kind: 'none' }

/** Classify a prop type: boolean, small literal union, oversized union, or none. */
function enumValuesOf(t: Type): EnumKind {
  const stripped = t.getNonNullableType() // drop null | undefined
  if (stripped.isBoolean() || stripped.isBooleanLiteral()) return { kind: 'boolean' }
  if (stripped.isStringLiteral() || stripped.isNumberLiteral()) {
    return { kind: 'enum', values: [String(stripped.getLiteralValue())] }
  }
  if (stripped.isUnion()) {
    const lits: string[] = []
    let allLiteral = true
    let sawBoolean = false
    for (const m of stripped.getUnionTypes()) {
      if (m.isUndefined() || m.isNull()) continue
      if (m.isBooleanLiteral() || m.isBoolean()) {
        sawBoolean = true
        continue
      }
      if (m.isStringLiteral() || m.isNumberLiteral()) {
        lits.push(String(m.getLiteralValue()))
      } else {
        allLiteral = false
      }
    }
    const unique = [...new Set(lits)]
    if (sawBoolean && unique.length === 0) return { kind: 'boolean' }
    if (allLiteral && unique.length > 0) {
      // A mixed `'asc' | 'desc' | false` union is both an enum and a boolean —
      // record the literals AND flag the prop as boolean so neither is lost.
      return unique.length > ENUM_CAP
        ? { kind: 'large', size: unique.length, alsoBoolean: sawBoolean }
        : { kind: 'enum', values: unique, alsoBoolean: sawBoolean }
    }
  }
  return { kind: 'none' }
}

interface ExtractedProps {
  variantEnums: Record<string, string[]>
  booleanProps: string[]
  largeEnumProps: Record<string, number>
  requiredProps: string[]
}

/**
 * Walk a props Type's apparent (merged) properties: collect own enum/boolean
 * props and own required props. DOM/HTML attributes are inherited and
 * universally optional, so they never appear as required and are excluded.
 */
function extractProps(propsType: Type, dts: SourceFile): ExtractedProps {
  const variantEnums: Record<string, string[]> = {}
  const booleanProps: string[] = []
  const largeEnumProps: Record<string, number> = {}
  const requiredProps: string[] = []
  const apparent = propsType.getApparentType()
  for (const sym of apparent.getProperties()) {
    const name = sym.getName()
    if (NOISE_PROPS.has(name)) continue
    const own = isOwnProp(sym, dts)
    const optional = (sym.getFlags() & SymbolFlags.Optional) !== 0
    if (!optional && own) requiredProps.push(name)
    if (!own || isDomNoiseProp(name)) continue // enums only for own, non-DOM props
    const decl = sym.getValueDeclaration() ?? sym.getDeclarations()[0]
    if (!decl) continue
    const e = enumValuesOf(sym.getTypeAtLocation(decl))
    if (e.kind === 'enum') {
      variantEnums[name] = e.values
      if (e.alsoBoolean) booleanProps.push(name)
    } else if (e.kind === 'boolean') {
      booleanProps.push(name)
    } else if (e.kind === 'large') {
      largeEnumProps[name] = e.size
      if (e.alsoBoolean) booleanProps.push(name)
    }
  }
  requiredProps.sort()
  booleanProps.sort()
  return { variantEnums, booleanProps, largeEnumProps, requiredProps }
}

/**
 * Per-branch required props for a discriminated union (or `Common & (A|B|C)`).
 * Returns one sorted required-prop list per branch; [] when the type is not a
 * union. Surfaces obligations the merged view hides (Button.iconOnly, etc.).
 */
function perBranchRequired(propsType: Type, dts: SourceFile): string[][] {
  // Find the union — directly, or as a member of a top-level intersection.
  let union: Type | null = null
  let intersectionCommon: string[] = []
  if (propsType.isUnion()) {
    union = propsType
  } else if (propsType.isIntersection()) {
    for (const part of propsType.getIntersectionTypes()) {
      if (part.isUnion()) union = part
    }
    // required props from the non-union intersection members
    intersectionCommon = extractProps(propsType, dts).requiredProps
  }
  if (!union) return []
  const branches: string[][] = []
  for (const branch of union.getUnionTypes()) {
    if (branch.isUndefined() || branch.isNull()) continue
    const req = new Set<string>(intersectionCommon)
    for (const sym of branch.getApparentType().getProperties()) {
      const name = sym.getName()
      if (NOISE_PROPS.has(name)) continue
      const optional = (sym.getFlags() & SymbolFlags.Optional) !== 0
      if (!optional && isOwnProp(sym, dts)) req.add(name)
    }
    // Keep empty branches: a branch requiring nothing (Button's `Regular`) is
    // what makes the union satisfiable with no extra props. Dropping it would
    // make a consumer believe every branch's props are mandatory.
    branches.push([...req].sort())
  }
  // de-dupe identical branches (collapses repeated empty branches to one)
  const seen = new Set<string>()
  const out: string[][] = []
  for (const b of branches) {
    const key = b.join('|')
    if (!seen.has(key)) {
      seen.add(key)
      out.push(b)
    }
  }
  // If ANY branch requires nothing, the whole union is trivially satisfiable —
  // collapse to [] so the manifest doesn't imply false obligations.
  if (out.some((b) => b.length === 0)) return []
  return out
}

// ---------------------------------------------------------------------------
// Component detection
// ---------------------------------------------------------------------------

/**
 * Does a type ultimately produce a JSX element (i.e. is it a component)?
 * Relies on call/construct signatures and the type's OWN symbol-brand — never
 * the full type text, which is polluted by member types (a compound object's
 * text contains "ForwardRefExoticComponent" from its subcomponents).
 */
function isRenderable(t: Type): boolean {
  for (const sig of [...t.getCallSignatures(), ...t.getConstructSignatures()]) {
    const ret = sig.getReturnType().getText()
    if (/JSX|ReactElement|ReactNode|Element\b/.test(ret)) return true
  }
  const brand = (t.getSymbol() ?? t.getAliasSymbol())?.getName() ?? ''
  return /ExoticComponent|FunctionComponent/.test(brand)
}

/**
 * Compound component: a const whose type is an object literal of renderable
 * subcomponents (Accordion = { Root, Item, ... }). Returns each subcomponent's
 * accessor name paired with its resolved props Type. Name-only for the shape
 * check; full prop extraction happens in `compoundSubcomponentRecords`.
 */
function compoundSubcomponents(t: Type): { name: string; props: Type | null }[] {
  if (isRenderable(t)) return [] // a callable forwardRef, not a compound bag
  const out: { name: string; props: Type | null }[] = []
  for (const prop of t.getProperties()) {
    const name = prop.getName()
    if (!/^[A-Z]/.test(name)) continue // subcomponents are PascalCase
    const decl = prop.getValueDeclaration() ?? prop.getDeclarations()[0]
    if (!decl) continue
    const pt = prop.getTypeAtLocation(decl)
    if (isRenderable(pt)) out.push({ name, props: propsFromComponentType(pt) })
  }
  return out
}

/** Full per-subcomponent records (variants + required props) for a compound. */
function compoundSubcomponentRecords(t: Type, dts: SourceFile): SubcomponentRecord[] {
  return compoundSubcomponents(t).map(({ name, props }) => {
    if (!props) {
      return {
        name,
        variantEnums: {},
        booleanProps: [],
        largeEnumProps: {},
        requiredProps: [],
        perBranchRequired: [],
      }
    }
    const ex = extractProps(props, dts)
    return {
      name,
      variantEnums: ex.variantEnums,
      booleanProps: ex.booleanProps,
      largeEnumProps: ex.largeEnumProps,
      requiredProps: ex.requiredProps,
      perBranchRequired: perBranchRequired(props, dts),
    }
  })
}

function classifyShape(decl: Node, t: Type): ComponentRecord['shape'] | null {
  if (Node.isFunctionDeclaration(decl)) return 'function'
  // Compound bag first: an object of subcomponents is not itself callable, so
  // it must be detected before the renderable-brand checks.
  if (compoundSubcomponents(t).length > 0) return 'compound'
  const brand = (t.getSymbol() ?? t.getAliasSymbol())?.getName() ?? ''
  if (/ExoticComponent/.test(brand)) return 'forwardRef'
  if (/FunctionComponent/.test(brand)) return 'fc'
  if (isRenderable(t)) return 'arrow'
  return null
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function buildManifest(): { generatedFrom: string; importPath: string; componentCount: number; components: ComponentRecord[] } {
  if (!existsSync(DTS_PATH)) {
    throw new Error(
      `dist/components.d.ts not found at ${DTS_PATH}.\nRun \`pnpm --filter @harnessio/ui build\` first (dist is gitignored, built on demand).`,
    )
  }
  const project = makeProject()
  const dts = project.addSourceFileAtPath(DTS_PATH)
  project.resolveSourceFileDependencies() // force @types/react resolution

  // Resolution sanity check: a known HTML member must type as string, not any.
  // If @types/react failed to resolve, every inherited prop collapses to `any`
  // and the own/inherited partition silently degrades.
  assertTypesResolved(dts)

  const components: ComponentRecord[] = []
  for (const [name, decls] of dts.getExportedDeclarations()) {
    if (!/^[A-Z]/.test(name)) continue // components are PascalCase
    const decl = decls[0]
    if (!decl) continue
    if (
      !Node.isVariableDeclaration(decl) &&
      !Node.isFunctionDeclaration(decl)
    ) {
      continue
    }
    const t = decl.getType()
    const shape = classifyShape(decl, t)
    if (!shape) continue // enums, cva *Variants consts, util consts, types

    const subcomponents =
      shape === 'compound' ? compoundSubcomponentRecords(t, dts) : []
    const propsType = shape === 'compound' ? null : propsTypeFor(decl)

    let variantEnums: Record<string, string[]> = {}
    let booleanProps: string[] = []
    let largeEnumProps: Record<string, number> = {}
    let requiredProps: string[] = []
    let branches: string[][] = []
    if (propsType) {
      const ex = extractProps(propsType, dts)
      variantEnums = ex.variantEnums
      booleanProps = ex.booleanProps
      largeEnumProps = ex.largeEnumProps
      requiredProps = ex.requiredProps
      branches = perBranchRequired(propsType, dts)
    }

    components.push({
      name,
      importPath: IMPORT_PATH,
      shape,
      variantEnums,
      booleanProps,
      largeEnumProps,
      requiredProps,
      perBranchRequired: branches,
      subcomponents,
    })
  }

  components.sort((a, b) => a.name.localeCompare(b.name))
  return {
    generatedFrom: 'dist/components.d.ts',
    importPath: IMPORT_PATH,
    componentCount: components.length,
    components,
  }
}

/** Fail loudly if React types didn't resolve (would corrupt own/inherited). */
function assertTypesResolved(dts: SourceFile): void {
  const button = dts.getVariableDeclaration('Button')
  if (!button) return // structure changed; not this guard's job to fail
  const props = propsTypeFor(button)
  if (!props) return
  const className = props
    .getApparentType()
    .getProperties()
    .find((p) => p.getName() === 'className')
  if (!className) return
  const decl = className.getValueDeclaration() ?? className.getDeclarations()[0]
  if (!decl) return
  const text = className.getTypeAtLocation(decl).getText()
  if (text === 'any') {
    throw new Error(
      'Type resolution failed: Button.className resolved to `any`, which means ' +
        '@types/react did not resolve. Check packages/ui/node_modules/@types/react ' +
        'exists (pnpm install) before generating the manifest.',
    )
  }
}

function main(): void {
  const check = process.argv.includes('--check')
  const manifest = buildManifest()
  const json = JSON.stringify(manifest, null, 2) + '\n'

  if (check) {
    if (!existsSync(OUT_PATH)) {
      console.error('✗ manifest --check: no committed manifest at', OUT_PATH)
      process.exit(1)
    }
    const current = readFileSync(OUT_PATH, 'utf8')
    if (current !== json) {
      console.error(
        '✗ manifest --check: .claude/manifest.json is stale. ' +
          'Run `pnpm --filter @harnessio/ui manifest` and commit the result.',
      )
      process.exit(1)
    }
    console.log('✓ manifest --check: up to date (' + manifest.componentCount + ' components)')
    return
  }

  mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(OUT_PATH, json)
  console.log(
    `✓ wrote ${OUT_PATH} — ${manifest.componentCount} components from ${manifest.generatedFrom}`,
  )
}

main()
