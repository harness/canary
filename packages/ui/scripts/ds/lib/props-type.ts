import { dirname } from 'node:path'

import ts from 'typescript'

export type PropKind = 'never' | 'boolean' | 'literal-union' | 'string' | 'number' | 'function' | 'other'

export interface TypeProp {
  name: string
  optional: boolean
  kind: PropKind
  /** String literal values when kind is 'literal-union'. */
  literals: string[]
  /** True when the prop is declared outside node_modules (not inherited from React or the DOM). */
  declaredLocally: boolean
}

export interface PropsTypeInfo {
  /** One entry per union member. A non-union type has one member. */
  members: Map<string, TypeProp>[]
  /** Names exported from the component module. */
  moduleExports: string[]
  error?: string
}

const cache = new Map<string, PropsTypeInfo>()

const loadCompilerOptions = (tsconfigPath: string): ts.CompilerOptions => {
  const config = ts.readConfigFile(tsconfigPath, ts.sys.readFile)
  if (config.error) return {}
  return ts.parseJsonConfigFileContent(config.config, ts.sys, dirname(tsconfigPath)).options
}

const classify = (checker: ts.TypeChecker, type: ts.Type): Pick<TypeProp, 'kind' | 'literals'> => {
  const t = checker.getNonNullableType(type)
  if (t.flags & ts.TypeFlags.Never) return { kind: 'never', literals: [] }
  if (t.flags & ts.TypeFlags.BooleanLike) return { kind: 'boolean', literals: [] }
  if (t.flags & ts.TypeFlags.String) return { kind: 'string', literals: [] }
  if (t.flags & ts.TypeFlags.NumberLike) return { kind: 'number', literals: [] }
  if (t.getCallSignatures().length > 0) return { kind: 'function', literals: [] }

  const parts = t.isUnion() ? t.types : [t]
  if (parts.length > 0 && parts.every(part => part.isStringLiteral())) {
    return { kind: 'literal-union', literals: parts.map(part => (part as ts.StringLiteralType).value).sort() }
  }
  return { kind: 'other', literals: [] }
}

const isLocal = (symbol: ts.Symbol): boolean =>
  (symbol.declarations ?? []).some(declaration => !declaration.getSourceFile().fileName.includes('/node_modules/'))

/**
 * Reads an exported props type with the TypeScript compiler API and returns
 * the props of each union member, with never-typed props kept as kind 'never'.
 */
export const readPropsType = (componentPath: string, typeName: string, tsconfigPath: string): PropsTypeInfo => {
  const cacheKey = `${componentPath}#${typeName}`
  const cached = cache.get(cacheKey)
  if (cached) return cached

  const program = ts.createProgram([componentPath], loadCompilerOptions(tsconfigPath))
  const checker = program.getTypeChecker()
  const sourceFile = program.getSourceFile(componentPath)
  const moduleSymbol = sourceFile ? checker.getSymbolAtLocation(sourceFile) : undefined
  if (!sourceFile || !moduleSymbol) {
    return { members: [], moduleExports: [], error: `Cannot load ${componentPath} as a TypeScript module.` }
  }

  const exports = checker.getExportsOfModule(moduleSymbol)
  const moduleExports = exports.map(symbol => symbol.getName())
  const typeSymbol = exports.find(symbol => symbol.getName() === typeName)
  if (!typeSymbol) {
    const info = { members: [], moduleExports, error: `${typeName} is not exported from ${componentPath}.` }
    cache.set(cacheKey, info)
    return info
  }

  const resolved = typeSymbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(typeSymbol) : typeSymbol
  const declared = checker.getDeclaredTypeOfSymbol(resolved)
  const memberTypes = declared.isUnion() ? declared.types : [declared]

  const members = memberTypes.map(member => {
    const props = new Map<string, TypeProp>()
    for (const symbol of checker.getPropertiesOfType(member)) {
      const type = checker.getTypeOfSymbolAtLocation(symbol, sourceFile)
      props.set(symbol.getName(), {
        name: symbol.getName(),
        optional: (symbol.flags & ts.SymbolFlags.Optional) !== 0,
        declaredLocally: isLocal(symbol),
        ...classify(checker, type)
      })
    }
    return props
  })

  const info = { members, moduleExports }
  cache.set(cacheKey, info)
  return info
}
