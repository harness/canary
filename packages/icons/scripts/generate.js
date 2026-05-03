import { promises as fs } from 'fs'
import path from 'path'

const RESERVED_WORDS = new Set([
  'Import', 'Export', 'Delete', 'Default', 'Switch',
  'Class', 'Function', 'Return', 'New', 'Void', 'Null'
])

function toComponentName(filename) {
  const name = filename
    .replace(/\.svg$/, '')
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('')
  return RESERVED_WORDS.has(name) ? `${name}Icon` : name
}

async function generate() {
  const iconsDir = path.resolve(import.meta.dirname, '../src/icons')
  const files = (await fs.readdir(iconsDir))
    .filter(f => f.endsWith('.svg'))
    .sort()

  const lines = [
    '/**',
    ' * @harnessio/icons - Tree-shakeable icon components',
    ' * Generated file - DO NOT EDIT DIRECTLY',
    ' */',
    ''
  ]

  for (const file of files) {
    const componentName = toComponentName(file)
    lines.push(`export { default as ${componentName} } from './icons/${file}'`)
  }

  lines.push('')
  const indexPath = path.resolve(import.meta.dirname, '../src/index.ts')
  await fs.writeFile(indexPath, lines.join('\n'))
  console.log(`Generated index.ts with ${files.length} icon exports`)

  const typeLines = [
    '/**',
    ' * @harnessio/icons - Icon name types',
    ' * Generated file - DO NOT EDIT DIRECTLY',
    ' */',
    '',
    'export type IconName ='
  ]
  for (let i = 0; i < files.length; i++) {
    const key = files[i].replace(/\.svg$/, '')
    const sep = i === 0 ? '  ' : '| '
    typeLines.push(`  ${sep}'${key}'`)
  }
  typeLines.push('')

  const typesPath = path.resolve(import.meta.dirname, '../src/types.ts')
  await fs.writeFile(typesPath, typeLines.join('\n'))
  console.log(`Generated types.ts with ${files.length} icon names`)
}

generate()
