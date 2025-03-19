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
  OSS_STYLES_SOURCE_NAME,
  STYLE_BUILD_FORMATS,
  THEME_MODE_FILENAME_PREFIX
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
  const themes = permutateThemes($themes)
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

    await sd.cleanAllPlatforms()
    await sd.buildAllPlatforms()
  }

  console.log('\n\x1b[1m\x1b[32m%s\x1b[0m', '✔︎ Generated style tokens successfully!')

  // Create index.css that imports all generated files
  await createIndexFile()
  await createEsmIndexFile()

  harnessLog()
}

async function createIndexFile() {
  console.log(`\n\x1b[34mCreating import files in ${DESIGN_SYSTEM_ROOT}...\x1b[0m`)

  // Get list of all CSS files
  const cssFiles = (await fs.readdir(DESIGN_SYSTEM_ROOT)).filter(file => file.endsWith('.css')).sort()

  // Organize files by type
  const coreFiles = cssFiles.filter(
    file => !file.startsWith(THEME_MODE_FILENAME_PREFIX.DARK) && !file.startsWith(THEME_MODE_FILENAME_PREFIX.LIGHT)
  )
  const ossDarkFiles = cssFiles.filter(
    file => file.includes(OSS_STYLES_SOURCE_NAME) && file.startsWith(THEME_MODE_FILENAME_PREFIX.DARK)
  )
  const ossLightFiles = cssFiles.filter(
    file => file.includes(OSS_STYLES_SOURCE_NAME) && file.startsWith(THEME_MODE_FILENAME_PREFIX.LIGHT)
  )

  console.log('\n=== Theme File Summary (OSS) ===')
  console.table([
    { Type: 'Dark Theme Files', Count: ossDarkFiles.length },
    { Type: 'Light Theme Files', Count: ossLightFiles.length }
  ])
  console.log('\n')

  /**
   * Core imports
   * */
  const coreStyles = `${getExportFileHeader()}
   
/* Core tokens */
${coreFiles.map(file => `@import './${file}';`).join('\n')}`

  /**
   * OSS themes imports
   * */
  const ossContent = `${getExportFileHeader()}

/* Theme files - Dark */
${ossDarkFiles.map(file => `@import './${file}';`).join('\n')}

/* Theme files - Light */
${ossLightFiles.map(file => `@import './${file}';`).join('\n')}`

  /**
   * Enterprise themes imports
   * */
  const enterpriseContent = `${getExportFileHeader()}

/* Theme files - Dark */
@import './dark-harness.css';

/* Theme files - Light */
@import './light-harness.css';`

  // Write file
  await Promise.all([
    fs.writeFile(`${DESIGN_SYSTEM_ROOT}/oss.css`, ossContent),
    fs.writeFile(`${DESIGN_SYSTEM_ROOT}/enterprise.css`, enterpriseContent),
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
  const coreFiles = styleValueFiles.filter(
    file => !file.startsWith(THEME_MODE_FILENAME_PREFIX.DARK) && !file.startsWith(THEME_MODE_FILENAME_PREFIX.LIGHT)
  )
  const darkFiles = styleValueFiles.filter(file => file.startsWith(THEME_MODE_FILENAME_PREFIX.DARK))
  const lightFiles = styleValueFiles.filter(file => file.startsWith(THEME_MODE_FILENAME_PREFIX.LIGHT))

  console.log('\n=== Theme File Summary (ts) ===')

  console.table([
    { Type: 'Dark Theme Files', Count: darkFiles.length },
    { Type: 'Light Theme Files', Count: lightFiles.length }
  ])
  console.log('\n')

  // Generate content
  const content = `/**
 * Harness Design System
 * DO NOT UPDATE IT MANUALLY
 * Generated on ${new Date().toUTCString()}
 */

  /* Theme files - Combined */
export const designSystemThemeMap = {
${[...darkFiles, ...lightFiles]
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

/* Theme files - Dark */
${darkFiles
  .map(file => {
    const fileName = file.replace('.ts', '')
    const name = fileName.replace(/-./g, x => x[1].toUpperCase())
    return `export { default as ${name} } from './${fileName}';`
  })
  .join('\n')}

/* Theme files - Light */
${lightFiles
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
