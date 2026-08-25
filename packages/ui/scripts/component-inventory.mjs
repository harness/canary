import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path'

import { format, resolveConfig } from 'prettier'
import ts from 'typescript'

const PILOT_COMPONENTS = new Set(['Button', 'Drawer', 'Select', 'StatusBadge', 'TextInput'])

function toPosixPath(filePath) {
  return filePath.split(sep).join('/')
}

function slugify(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

function isPublicRuntimeName(name) {
  return /^[A-Z]/.test(name)
}

function hasExportModifier(node) {
  return node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false
}

function resolveModuleFile(sourceFilePath, moduleSpecifier) {
  const base = resolve(dirname(sourceFilePath), moduleSpecifier)
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    join(base, 'index.ts'),
    join(base, 'index.tsx'),
    join(base, 'index.js'),
    join(base, 'index.jsx')
  ]

  return candidates.find(candidate => existsSync(candidate) && statSync(candidate).isFile()) ?? null
}

function collectRuntimeExports(filePath, visited = new Set()) {
  const resolvedPath = resolve(filePath)
  if (visited.has(resolvedPath)) return []
  visited.add(resolvedPath)

  const runtimeSource = ts.transpileModule(readFileSync(resolvedPath, 'utf8'), {
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext
    },
    fileName: resolvedPath
  }).outputText
  const source = ts.createSourceFile(resolvedPath, runtimeSource, ts.ScriptTarget.Latest, true)
  const exports = []

  for (const statement of source.statements) {
    if (ts.isExportDeclaration(statement)) {
      if (statement.isTypeOnly) continue

      const moduleSpecifier = statement.moduleSpecifier?.text
      const modulePath = moduleSpecifier ? resolveModuleFile(resolvedPath, moduleSpecifier) : null

      if (statement.exportClause && ts.isNamespaceExport(statement.exportClause)) {
        const exportName = statement.exportClause.name.text
        if (modulePath && isPublicRuntimeName(exportName)) {
          exports.push({ exportName, sourcePath: modulePath })
        }
        continue
      }

      if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) {
          if (element.isTypeOnly) continue
          const exportName = element.name.text
          if (isPublicRuntimeName(exportName)) {
            exports.push({ exportName, sourcePath: modulePath ?? resolvedPath })
          }
        }
        continue
      }

      if (modulePath) {
        exports.push(...collectRuntimeExports(modulePath, visited))
      }
      continue
    }

    if (ts.isVariableStatement(statement) && hasExportModifier(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && isPublicRuntimeName(declaration.name.text)) {
          exports.push({ exportName: declaration.name.text, sourcePath: resolvedPath })
        }
      }
      continue
    }

    if (
      (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement) || ts.isEnumDeclaration(statement)) &&
      hasExportModifier(statement) &&
      statement.name &&
      isPublicRuntimeName(statement.name.text)
    ) {
      exports.push({ exportName: statement.name.text, sourcePath: resolvedPath })
    }
  }

  return exports
}

function listFiles(root, predicate) {
  if (!existsSync(root)) return []

  const files = []
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const entryPath = join(root, entry.name)
    if (entry.isDirectory()) files.push(...listFiles(entryPath, predicate))
    if (entry.isFile() && predicate(entryPath)) files.push(entryPath)
  }
  return files
}

function componentFamily(sourcePath, componentsRoot) {
  const sourceRelative = toPosixPath(relative(componentsRoot, sourcePath))
  const [firstSegment] = sourceRelative.split('/')
  return slugify(firstSegment.replace(extname(firstSegment), ''))
}

function relativeEvidencePath(packageRoot, filePath) {
  return toPosixPath(relative(packageRoot, filePath))
}

function readCodeConnectComponentName(filePath) {
  return readFileSync(filePath, 'utf8').match(/^\/\/ component=(.+)$/m)?.[1]?.trim() || undefined
}

export function generateComponentInventory({
  packageRoot,
  componentsIndexPath,
  portalDocsRoot,
  codeConnectRoot,
  existingInventory = { components: [] },
  warn = console.warn
}) {
  const componentsRoot = dirname(componentsIndexPath)
  const docs = listFiles(portalDocsRoot, filePath => filePath.endsWith('.mdx'))
  const codeConnectFiles = listFiles(
    codeConnectRoot,
    filePath => filePath.endsWith('.figma.ts') || filePath.endsWith('.figma.tsx')
  ).sort()
  const codeConnectEvidence = []
  for (const filePath of codeConnectFiles) {
    const componentName = readCodeConnectComponentName(filePath)
    if (!componentName) {
      warn(
        `Code Connect file ${relativeEvidencePath(packageRoot, filePath)} is missing a parseable // component= header and will not be attached as inventory evidence`
      )
      continue
    }
    codeConnectEvidence.push({ filePath, componentName })
  }

  const byExportName = new Map()
  const existingById = new Map((existingInventory.components ?? []).map(component => [component.id, component]))
  for (const componentExport of collectRuntimeExports(componentsIndexPath)) {
    if (!byExportName.has(componentExport.exportName)) {
      byExportName.set(componentExport.exportName, componentExport)
    }
  }

  const candidates = [...byExportName.values()]
    .map(({ exportName, sourcePath }) => {
      const slug = slugify(exportName)
      const id = `canary.${slug}`
      const existing = existingById.get(id)
      const isReviewed =
        (existing?.status && existing.status !== 'unreviewed') ||
        (existing?.disposition && existing.disposition !== 'unreviewed')
      const portalDoc = docs.find(filePath => slugify(basename(filePath, '.mdx')) === slug)
      const codeConnect = codeConnectEvidence
        .filter(({ componentName }) => {
          return componentName === exportName || componentName?.startsWith(`${exportName}.`)
        })
        .map(({ filePath }) => relativeEvidencePath(packageRoot, filePath))
        .sort()

      return {
        id,
        exportName,
        sourcePath: relativeEvidencePath(packageRoot, sourcePath),
        family: existing?.family ?? componentFamily(sourcePath, componentsRoot),
        disposition: existing?.disposition ?? 'unreviewed',
        ...(portalDoc ? { portalDoc: relativeEvidencePath(packageRoot, portalDoc) } : {}),
        codeConnect,
        figmaComponentKeys: existing?.figmaComponentKeys ?? [],
        ...(existing?.contractPath ? { contractPath: existing.contractPath } : {}),
        ...(existing?.governedBy ? { governedBy: existing.governedBy } : {}),
        ...(existing?.replacedBy ? { replacedBy: existing.replacedBy } : {}),
        ...(existing?.surfaces ? { surfaces: existing.surfaces } : {}),
        existingPriority: isReviewed ? existing.priority : undefined,
        hasDirectEvidence: PILOT_COMPONENTS.has(exportName) || Boolean(portalDoc) || codeConnect.length > 0,
        status: existing?.status ?? 'unreviewed'
      }
    })
    .sort((a, b) => a.exportName.localeCompare(b.exportName))

  const contractFamilies = new Set(
    candidates.filter(component => component.hasDirectEvidence).map(component => component.family)
  )
  const components = candidates.map(({ existingPriority, hasDirectEvidence, ...component }) => ({
    ...component,
    recommendedDisposition: hasDirectEvidence
      ? 'contract'
      : contractFamilies.has(component.family)
        ? 'part-of-family'
        : 'unreviewed',
    priority:
      existingPriority ?? (PILOT_COMPONENTS.has(component.exportName) ? 'pilot' : hasDirectEvidence ? 'high' : 'medium')
  }))

  return {
    schemaVersion: 1,
    source: '@harnessio/ui/components',
    components
  }
}

export async function serializeComponentInventory(inventory, outputPath) {
  const config = outputPath ? await resolveConfig(outputPath) : null
  return format(JSON.stringify(inventory), { ...config, filepath: outputPath, parser: 'json' })
}
