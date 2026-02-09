import fs from 'node:fs/promises'

import { permutateThemes, register } from '@tokens-studio/sd-transforms'
import StyleDictionary from 'style-dictionary'
import { getReferences, usesReferences } from 'style-dictionary/utils'

import { harnessLog } from './complete-log.js'
import {
  COMMON_CONFIG,
  DESIGN_SYSTEM_PREFIX,
  DESIGN_SYSTEM_ROOT,
  DESIGN_SYSTEM_ROOT_ESM,
  getExportFileHeader,
  STYLE_BUILD_FORMATS,
  THEME_MODE_FILENAME_PREFIX,
  THEME_COLLECTIONS
} from './constants.js'
import { generateCoreFiles, generateThemeFiles } from './sd-file-generators.js'

register(StyleDictionary)

async function run() {
  let $themes
  try {
    $themes = JSON.parse(await fs.readFile('design-tokens/$themes.json'))
  } catch (error) {
    console.error('Error parsing $themes.json:', error)
    throw error
  }
  
  // Don't use permutateThemes - process themes directly to avoid unwanted combinations
  const themes = {}
  
  // Convert themes array to object with theme names as keys
  $themes.forEach(theme => {
    if (theme.name !== 'source' && theme.name !== 'desktop') {
      // Create theme entry with selected token sets + core sets
      const enabledSets = Object.keys(theme.selectedTokenSets).filter(set => 
        theme.selectedTokenSets[set] === 'enabled'
      )
      
      // Add core token sets to each theme
      themes[theme.name] = [
        'core/colors_hex',
        'core/colors_lch', 
        'core/typography',
        'core/dimensions',
        ...enabledSets
      ]
    }
  })
  
  console.log(`Processing ${Object.keys(themes).length} themes:`, Object.keys(themes))
  
  // collect all tokensets for all themes and dedupe
  const tokensets = [...new Set(Object.values(themes).reduce((acc, sets) => [...acc, ...sets], []))]

  // figure out which tokensets are theme-specific
  // this is determined by checking if a certain tokenset is used for EVERY theme dimension variant
  // if it is, then it is not theme-specific
  const themeableSets = tokensets.filter(set => {
    return !Object.values(themes).every(sets => sets.includes(set))
  })

  const configs = Object.entries(themes).map(([theme, sets]) => {
    return {
      source: sets.map(tokenset => `design-tokens/${tokenset}.json`),
      preprocessors: ['tokens-studio'],
      platforms: {
        css: {
          ...COMMON_CONFIG,
          files: [
            // core tokens (colors, typography, dimensions, components)
            ...generateCoreFiles({
              destination: DESIGN_SYSTEM_ROOT,
              type: 'css',
              format: STYLE_BUILD_FORMATS.CSS_VARIABLES
            }),
            // semantic tokens, e.g. for application developer
            ...generateThemeFiles({
              theme,
              destination: DESIGN_SYSTEM_ROOT,
              type: 'css',
              format: STYLE_BUILD_FORMATS.CSS_VARIABLES
            })
          ]
        },
        js: {
          ...COMMON_CONFIG,
          files: [
            // core tokens (colors, typography, dimensions, components)
            ...generateCoreFiles({
              destination: DESIGN_SYSTEM_ROOT_ESM,
              type: 'ts',
              format: STYLE_BUILD_FORMATS.JS_ESM
            }),
            // semantic tokens, e.g. for application developer
            ...generateThemeFiles({
              theme,
              destination: DESIGN_SYSTEM_ROOT_ESM,
              type: 'ts',
              format: STYLE_BUILD_FORMATS.JS_ESM
            })
          ]
        }
      }
    }
  })

  for (const cfg of configs) {
    const sd = new StyleDictionary(cfg, {
      // verbosity: 'verbose'
    })

    /**
     * This transform checks for each token whether that token's value could change
     * due to Tokens Studio theming.
     * Any tokenset from Tokens Studio marked as "enabled" in the $themes.json is considered
     * a set in which any token could change if the theme changes.
     * Any token that is inside such a set or is a reference with a token in that reference chain
     * that is inside such a set, is considered "themeable",
     * which means it could change by theme switching.
     *
     * This metadata is applied to the token so we can use it as a way of filtering outputs
     * later in the "format" stage.
     */
    sd.registerTransform({
      name: 'attribute/themeable',
      type: 'attribute',
      transform: token => {
        function isPartOfEnabledSet(token) {
          const set = token.filePath.replace(/^design-tokens\//g, '').replace(/.json$/g, '')
          return themeableSets.includes(set)
        }

        // Set token to themeable if it's part of an enabled set
        if (isPartOfEnabledSet(token)) {
          return {
            themeable: true
          }
        }

        // Set token to themeable if it's using a reference and inside the reference chain
        // any one of them is from a themeable set
        if (usesReferences(token.original.$value)) {
          const refs = getReferences(token.original.$value, sd.tokens)

          if (refs.some(ref => isPartOfEnabledSet(ref))) {
            return {
              themeable: true
            }
          }
        }
      }
    })

    sd.registerTransform({
      name: 'ts/transform/alpha',
      type: 'value',
      filter: prop => {
        return (
          prop.$extensions?.['studio.tokens']?.modify?.type === 'alpha' &&
          prop.$extensions?.['studio.tokens']?.modify?.space === 'lch'
        )
      },
      transitive: true,
      transform: prop => {
        const baseColor = prop.original.$value.replace(/[{}]/g, '').replace(/\./g, '-')
        const alphaValue = prop.$extensions['studio.tokens'].modify.value
        return `lch(from var(--${DESIGN_SYSTEM_PREFIX}-${baseColor}) l c h / ${alphaValue})`
      }
    })

    /**
     * Transform shadow tokens under comp.shadow.data-viz to CSS drop-shadow() format.
     * drop-shadow() does not support spread, so we convert "x y blur spread color" to "drop-shadow(x y blur color)".
     */
    sd.registerTransform({
      name: 'shadow/dropShadow',
      type: 'value',
      filter: token => token.$type === 'shadow' && token.path.includes('shadow') && token.path.includes('data-viz'),
      transitive: true,
      transform: token => {
        const value = token.$value
        if (!value || typeof value !== 'string') return value
        // Parse box-shadow format: x y blur spread color
        const match = value.match(/^(\S+)\s+(\S+)\s+(\S+)\s+\S+\s+(.+)$/)
        if (match) {
          const [, x, y, blur, color] = match
          return `${x} ${y} ${blur} ${color}`
        }
        return value
      }
    })

    await sd.cleanAllPlatforms()
    await sd.buildAllPlatforms()
  }

  console.log('\n\x1b[1m\x1b[32m%s\x1b[0m', '✔︎ Generated style tokens successfully!')

  // Create index.css that imports all generated files
  await createCssFiles()
  await createEsmIndexFile()

  harnessLog()
}

async function createCssFiles() {
  console.log(`\n\x1b[34mCreating import files in ${DESIGN_SYSTEM_ROOT}...\x1b[0m`)

  // Get list of all CSS files
  const cssFiles = (await fs.readdir(DESIGN_SYSTEM_ROOT)).filter(file => file.endsWith('.css')).sort()

  // Organize files by type
  const coreFiles = cssFiles.filter(file => {
    const fileName = file.replace('.css', '')
    return !THEME_COLLECTIONS.some(collection => 
      fileName.startsWith(`${collection}-dark`) || fileName.startsWith(`${collection}-light`)
    )
  })
  
  const themeFiles = cssFiles.filter(file => {
    const fileName = file.replace('.css', '')
    return THEME_COLLECTIONS.some(collection => 
      fileName.startsWith(`${collection}-dark`) || fileName.startsWith(`${collection}-light`)
    )
  })

  console.log('\n=== Theme File Summary ===')
  console.table([
    { Type: 'Core Files', Count: coreFiles.length },
    { Type: 'Theme Files', Count: themeFiles.length }
  ])
  console.log('\n')

  /**
   * Core imports
   * */
  const coreStyles = `${getExportFileHeader()}
   
/* Core tokens */
${coreFiles.map(file => `@import './${file}';`).join('\n')}`

  /**
   *  themes imports
   * */
  const themesContent = `${getExportFileHeader()}

/* Theme files */
${themeFiles.map(file => `@import './${file}';`).join('\n')}`

  /**
   * MFE themes imports
   * */
  const mfeThemesContent = `${getExportFileHeader()}

/* Standard themes */
@import './standard-dark.css';
@import './standard-light.css';

/* High contrast themes */
@import './high-contrast-dark.css';
@import './high-contrast-light.css';

/* Low contrast themes */
@import './low-contrast-dark.css';
@import './low-contrast-light.css';`

  // Write file
  await Promise.all([
    fs.writeFile(`${DESIGN_SYSTEM_ROOT}/themes.css`, themesContent),
    fs.writeFile(`${DESIGN_SYSTEM_ROOT}/mfe-themes.css`, mfeThemesContent),
    fs.writeFile(`${DESIGN_SYSTEM_ROOT}/core-imports.css`, coreStyles)
  ])

  console.log('\n\x1b[1m\x1b[32m%s\x1b[0m', `✔︎ Created import files in ${DESIGN_SYSTEM_ROOT}`)
}

async function createEsmIndexFile() {
  console.log(`\n\x1b[34mCreating ${DESIGN_SYSTEM_ROOT_ESM}/index.ts import file...\x1b[0m`)

  // Get list of all JS files
  const styleValueFiles = (await fs.readdir(DESIGN_SYSTEM_ROOT_ESM))
    .filter(file => file.endsWith('.ts') && file !== 'index.ts')
    .sort()

  // Organize files by type
  const coreFiles = styleValueFiles.filter(file => {
    const fileName = file.replace('.ts', '')
    return !THEME_COLLECTIONS.some(collection => 
      fileName.startsWith(`${collection}-dark`) || fileName.startsWith(`${collection}-light`)
    )
  })
  
  const themeFiles = styleValueFiles.filter(file => {
    const fileName = file.replace('.ts', '')
    return THEME_COLLECTIONS.some(collection => 
      fileName.startsWith(`${collection}-dark`) || fileName.startsWith(`${collection}-light`)
    )
  })

  console.log('\n=== Theme File Summary (ts) ===')

  console.table([
    { Type: 'Core Files', Count: coreFiles.length },
    { Type: 'Theme Files', Count: themeFiles.length }
  ])
  console.log('\n')

  // Generate content
  const content = `/**
 * Harness Design System
 * DO NOT UPDATE IT MANUALLY
 */

  /* Theme files - Combined */
export const designSystemThemeMap = {
${themeFiles
  .map(file => {
    const name = file.replace('.ts', '')
    return `'${name}': '${name}',`
  })
  .join('\n')}
}

/* Core tokens */
${coreFiles
  .map(file => {
    const fileName = file.replace('.ts', '')
    const name = fileName.replace(/-./g, x => x[1].toUpperCase())
    return `export { default as ${name} } from './${fileName}';`
  })
  .join('\n')}

/* Theme files */
${themeFiles
  .map(file => {
    const fileName = file.replace('.ts', '')
    const name = fileName.replace(/-./g, x => x[1].toUpperCase())
    return `export { default as ${name} } from './${fileName}';`
  })
  .join('\n')};
`

  // Write file
  await fs.writeFile(`${DESIGN_SYSTEM_ROOT_ESM}/index.ts`, content)

  console.log(
    '\n\x1b[1m\x1b[32m%s\x1b[0m',
    `✔︎ Created ${DESIGN_SYSTEM_ROOT_ESM}/index.ts with imports to all token files`
  )
}

run()
