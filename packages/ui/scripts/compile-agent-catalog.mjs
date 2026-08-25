import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

export const agentCatalogFormatVersion = 1
export const agentCatalogExampleLineCap = 40

const agentCatalogRelativePaths = {
  components: 'catalog/generated/agent/components.json',
  icons: 'catalog/generated/agent/icons.json',
  foundations: 'catalog/generated/agent/foundations.json'
}

const inventoryRelativePath = 'catalog/component-inventory.json'
const aliasesRelativePath = 'catalog/agent-aliases.json'
const synonymsRelativePath = 'catalog/icon-synonyms.json'
const iconNameMapRelativePath = 'src/components/icon-v2/icon-name-map.ts'
const iconV2PortalRelativePath = '../../apps/portal/src/content/docs/components/visual/icon.mdx'
const installationRelativePath = '../../apps/portal/src/content/docs/getting-started/installation.mdx'

const defaultIconImport = 'import { IconV2 } from "@harnessio/ui/components"'
const noiseExportPattern = /(Enum|Context|Map(?:V\d+)?|Props|Type)$/
const stableLifecycles = new Set(['stable', 'piloting'])

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`
}

function toPosix(filePath) {
  return filePath.split('\\').join('/')
}

function unique(values) {
  const seen = new Set()
  const result = []
  for (const value of values) {
    if (!value || seen.has(value)) continue
    seen.add(value)
    result.push(value)
  }
  return result
}

function defaultImport(exportName) {
  return `import { ${exportName} } from "@harnessio/ui/components"`
}

function rewriteIconV2(code) {
  return code.replace(/IconV2(\s+)icon=/g, 'IconV2$1name=')
}

function readText(path) {
  return readFileSync(path, 'utf8')
}

function readJsonIfExists(path) {
  if (!existsSync(path)) return undefined
  return JSON.parse(readText(path))
}

function recordInput(inputs, packageRoot, absolutePath) {
  if (!existsSync(absolutePath)) return undefined
  const contents = readText(absolutePath)
  inputs.set(toPosix(relative(packageRoot, absolutePath)), contents)
  return contents
}

function parseFrontmatter(mdx) {
  const match = mdx.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}

  const fields = {}
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':')
    if (separator === -1) continue
    const key = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    fields[key] = value
  }
  return fields
}

function capExample(code) {
  const stripped = code
    .split('\n')
    .filter(line => !line.includes('@/components'))
    .join('\n')
    .trim()
  const lines = stripped.split('\n')
  if (lines.length <= agentCatalogExampleLineCap) return stripped
  return lines.slice(0, agentCatalogExampleLineCap).join('\n')
}

function extractComponentExamples(mdx) {
  const examples = []
  const pattern = /<DocsPage\.ComponentExample\b[\s\S]*?\bcode=\{`([\s\S]*?)`\}/g
  let match
  let index = 0
  while ((match = pattern.exec(mdx))) {
    index += 1
    const code = rewriteIconV2(capExample(match[1]))
    if (!code) continue
    examples.push({
      id: `portal-example-${index}`,
      name: index === 1 ? 'Portal example' : `Portal example ${index}`,
      purpose: 'Harvested from a Portal ComponentExample.',
      code
    })
  }
  return examples
}

function extractFencedBlocks(mdx) {
  const examples = []
  const pattern = /^```(?:typescript jsx|tsx|typescript)\s*\n([\s\S]*?)^```/gm
  let match
  let index = 0
  while ((match = pattern.exec(mdx))) {
    index += 1
    const code = rewriteIconV2(capExample(match[1]))
    if (!code) continue
    examples.push({
      id: `portal-fence-${index}`,
      name: `Usage ${index}`,
      purpose: 'Harvested from a Portal fenced example.',
      code
    })
  }
  return examples
}

function extractPortalExamples(mdx) {
  return [...extractComponentExamples(mdx), ...extractFencedBlocks(mdx)]
}

function categoryFromPortal(portalPath) {
  const match = (portalPath || '').match(/components\/([^/]+)\//)
  return match?.[1]
}

function isSearchableComponent(component) {
  if (noiseExportPattern.test(component.exportName)) return false
  if (component.recommendedDisposition === 'part-of-family' && !component.portalDoc) return false
  return true
}

function resolvePortalPath(packageRoot, component) {
  if (component.exportName === 'IconV2') return join(packageRoot, iconV2PortalRelativePath)
  if (!component.portalDoc) return undefined
  return join(packageRoot, component.portalDoc)
}

function harvestMembersFromSource(source, exportName) {
  const marker = `export const ${exportName} = {`
  const start = source.indexOf(marker)
  if (start === -1) return []

  let depth = 1
  let index = start + marker.length
  while (index < source.length && depth > 0) {
    const char = source[index]
    if (char === '{') depth += 1
    else if (char === '}') depth -= 1
    index += 1
  }

  const body = source.slice(start + marker.length, index - 1)
  return unique([...body.matchAll(/^\s*([A-Z][A-Za-z0-9]*)\s*(?::|,|$)/gm)].map(match => match[1]))
}

function harvestMembersFromExamples(examples, exportName) {
  const pattern = new RegExp(`${exportName}\\.([A-Z][A-Za-z0-9]*)`, 'g')
  const members = []
  for (const example of examples) {
    const code = example.code ?? ''
    for (const match of code.matchAll(pattern)) members.push(match[1])
  }
  return unique(members)
}

function readContract(packageRoot, component, inputs) {
  if (!component.contractPath) return undefined
  const contractPath = join(packageRoot, component.contractPath)
  const contents = recordInput(inputs, packageRoot, contractPath)
  if (contents === undefined) return undefined
  try {
    return JSON.parse(contents)
  } catch {
    return undefined
  }
}

function aliasesFor(component, contract, aliasMap) {
  return unique([...(contract?.identity?.aliases ?? []), ...(aliasMap[component.exportName] ?? [])])
}

function projectProps(contract) {
  const fromProperties = (contract.properties ?? [])
    .filter(property => property.bindings?.react?.kind === 'prop')
    .map(property => ({
      name: property.bindings.react.name ?? property.name,
      type: property.type,
      ...(property.values ? { values: property.values } : {}),
      ...(property.default !== undefined ? { default: property.default } : {}),
      ...(property.description ? { description: property.description } : {})
    }))

  const fromExtensions = (contract.surfaces?.react?.extensions ?? [])
    .filter(extension => extension.binding?.kind === 'prop')
    .map(extension => ({
      name: extension.binding.name ?? extension.name,
      type: extension.type,
      ...(extension.default !== undefined ? { default: extension.default } : {}),
      ...(extension.description ? { description: extension.description } : {})
    }))

  const seen = new Set()
  const props = []
  for (const prop of [...fromProperties, ...fromExtensions]) {
    if (seen.has(prop.name)) continue
    seen.add(prop.name)
    props.push(prop)
  }
  return props
}

function projectExamples(contract) {
  return (contract.examples ?? []).map(example => ({
    id: example.id,
    name: example.name,
    purpose: example.purpose,
    ...(example.status === 'recommended' ? { recommended: true } : {}),
    ...(example.references?.code ? { code: rewriteIconV2(example.references.code) } : {})
  }))
}

function usageStatements(items) {
  return (items ?? []).map(item => (typeof item === 'string' ? item : item.statement)).filter(Boolean)
}

function withSharedFields(component, aliases, extra, rest) {
  return {
    id: component.id,
    exportName: component.exportName,
    import: rest.import,
    package: '@harnessio/ui',
    family: component.family,
    ...(extra.category ? { category: extra.category } : {}),
    aliases,
    ...(extra.members?.length ? { members: extra.members } : {}),
    summary: rest.summary,
    confidence: rest.confidence,
    useWhen: rest.useWhen ?? [],
    avoidWhen: rest.avoidWhen ?? [],
    related: rest.related ?? [],
    props: rest.props ?? [],
    do: rest.do ?? [],
    dont: rest.dont ?? [],
    examples: rest.examples ?? [],
    ...(rest.constraints ? { constraints: rest.constraints } : {}),
    ...(rest.migrations?.length ? { migrations: rest.migrations } : {}),
    sourcePath: component.sourcePath,
    ...(extra.portalPath ? { portalPath: extra.portalPath } : {}),
    ...(rest.contractVersion ? { contractVersion: rest.contractVersion } : {})
  }
}

function projectStable(component, contract, aliases, extra) {
  return withSharedFields(component, aliases, extra, {
    import: contract.surfaces?.react?.import ?? defaultImport(component.exportName),
    summary: contract.identity?.summary ?? `${component.exportName} in the ${component.family} family.`,
    confidence: 'stable',
    useWhen: contract.semantics?.useWhen ?? [],
    avoidWhen: contract.semantics?.avoidWhen ?? [],
    related: contract.usage?.relatedComponents ?? [],
    props: projectProps(contract),
    do: usageStatements(contract.usage?.do),
    dont: usageStatements(contract.usage?.dont),
    examples: projectExamples(contract),
    ...(contract.constraints
      ? {
          constraints: {
            exhaustive: Boolean(contract.constraints.exhaustive),
            dimensions: contract.constraints.dimensions ?? [],
            combinations: contract.constraints.combinations ?? []
          }
        }
      : {}),
    migrations: (contract.migrations ?? []).map(item => ({
      id: item.id,
      instructions: item.instructions
    })),
    contractVersion: contract.contractVersion
  })
}

function isStubDescription(exportName, text) {
  if (!text?.trim()) return true
  const trimmed = text.trim()
  if (trimmed.length < 20) return true
  return new RegExp(`^${exportName}\\s+component\\b`, 'i').test(trimmed)
}

function catalogSummary(component, portalDescription) {
  if (component.summary) return component.summary
  if (portalDescription && !isStubDescription(component.exportName, portalDescription)) return portalDescription
  return `${component.exportName} in the ${component.family} family.`
}

function projectFallback(component, aliases, extra) {
  return withSharedFields(component, aliases, extra, {
    import: defaultImport(component.exportName),
    summary: extra.summary,
    confidence: 'fallback',
    examples: extra.examples ?? []
  })
}

function projectUnreviewed(component, aliases, extra) {
  return withSharedFields(component, aliases, extra, {
    import: defaultImport(component.exportName),
    summary: extra.summary,
    confidence: 'unreviewed'
  })
}

function parseIconNames(source) {
  const start = source.indexOf('export const IconNameMapV2')
  const body = start === -1 ? source : source.slice(start)
  return unique([...body.matchAll(/^\s+'?([a-z0-9-]+)'?\s*:/gm)].map(match => match[1]))
}

function hashInputs(inputs) {
  const hash = createHash('sha256')
  for (const [relativePath, contents] of [...inputs.entries()].sort(([left], [right]) => left.localeCompare(right))) {
    hash.update(relativePath)
    hash.update('\n')
    hash.update(contents)
    hash.update('\n')
  }
  return hash.digest('hex')
}

function envelope(records, sourceInventoryCount, sourceSha256) {
  return {
    formatVersion: agentCatalogFormatVersion,
    sourceInventoryCount,
    sourceSha256,
    records
  }
}

function compileFoundations(installationMdx) {
  const frontmatter = installationMdx ? parseFrontmatter(installationMdx) : {}
  return [
    {
      id: 'installation',
      title: frontmatter.title || 'Installation',
      summary: frontmatter.description || 'Install @harnessio/ui and import the Canary stylesheet.',
      rules: [
        'Install with `pnpm add @harnessio/ui`.',
        'Peer dependency: React 17 or later (`react >= 17`).',
        'Import `@harnessio/ui/styles.css` once in the app entry.'
      ]
    }
  ]
}

export function compileAgentCatalog({ packageRoot, write = false }) {
  const inputs = new Map()
  const inventoryContents = recordInput(inputs, packageRoot, join(packageRoot, inventoryRelativePath))
  if (inventoryContents === undefined) {
    throw new Error(`Missing component inventory at ${inventoryRelativePath}`)
  }

  const inventory = JSON.parse(inventoryContents)
  const aliasMap = JSON.parse(recordInput(inputs, packageRoot, join(packageRoot, aliasesRelativePath)) ?? '{}')
  const synonymMap = JSON.parse(recordInput(inputs, packageRoot, join(packageRoot, synonymsRelativePath)) ?? '{}')
  const iconNameMapSource = recordInput(inputs, packageRoot, join(packageRoot, iconNameMapRelativePath)) ?? ''
  const installationMdx = recordInput(inputs, packageRoot, join(packageRoot, installationRelativePath))

  const componentRecords = []
  for (const component of inventory.components ?? []) {
    if (!isSearchableComponent(component)) continue

    const contract = readContract(packageRoot, component, inputs)
    const portalAbsolutePath = resolvePortalPath(packageRoot, component)
    const portalMdx = portalAbsolutePath ? recordInput(inputs, packageRoot, portalAbsolutePath) : undefined
    const sourceContents = recordInput(inputs, packageRoot, join(packageRoot, component.sourcePath))
    const aliases = aliasesFor(component, contract, aliasMap)
    const portalPath = portalMdx
      ? component.exportName === 'IconV2'
        ? iconV2PortalRelativePath
        : toPosix(component.portalDoc)
      : undefined
    const examples = portalMdx ? extractPortalExamples(portalMdx) : []
    const members = unique([
      ...(sourceContents ? harvestMembersFromSource(sourceContents, component.exportName) : []),
      ...harvestMembersFromExamples(examples, component.exportName)
    ])
    const extra = {
      category: categoryFromPortal(portalPath),
      members,
      portalPath,
      examples,
      summary: catalogSummary(component, portalMdx ? parseFrontmatter(portalMdx).description : undefined)
    }

    const lifecycle = contract?.lifecycle?.status
    if (contract && stableLifecycles.has(lifecycle)) {
      componentRecords.push(projectStable(component, contract, aliases, extra))
      continue
    }

    if (portalMdx !== undefined) {
      componentRecords.push(projectFallback(component, aliases, extra))
      continue
    }

    componentRecords.push(projectUnreviewed(component, aliases, extra))
  }

  const iconRecords = parseIconNames(iconNameMapSource).map(name => ({
    name,
    import: defaultIconImport,
    usage: `<IconV2 name="${name}" />`,
    synonyms: synonymMap[name] ?? []
  }))

  const foundationRecords = compileFoundations(installationMdx)
  const sourceInventoryCount = (inventory.components ?? []).length
  const sourceSha256 = hashInputs(inputs)
  const files = {
    [agentCatalogRelativePaths.components]: json(envelope(componentRecords, sourceInventoryCount, sourceSha256)),
    [agentCatalogRelativePaths.icons]: json(envelope(iconRecords, sourceInventoryCount, sourceSha256)),
    [agentCatalogRelativePaths.foundations]: json(envelope(foundationRecords, sourceInventoryCount, sourceSha256))
  }

  if (write) {
    for (const [relativePath, contents] of Object.entries(files)) {
      const outputPath = join(packageRoot, relativePath)
      mkdirSync(dirname(outputPath), { recursive: true })
      writeFileSync(outputPath, contents)
    }
  }

  return {
    files,
    catalog: {
      components: componentRecords,
      icons: iconRecords,
      foundations: foundationRecords
    },
    sourceSha256
  }
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (isCli) {
  const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const write = process.argv.includes('--write')
  const result = compileAgentCatalog({ packageRoot, write })
  console.log(
    `${write ? 'Generated' : 'Compiled'} agent catalog: ${result.catalog.components.length} components, ${result.catalog.icons.length} icons`
  )
}
