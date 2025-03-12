import fs from 'node:fs/promises'

import { permutateThemes, register } from '@tokens-studio/sd-transforms'
import StyleDictionary from 'style-dictionary'
import { getReferences, usesReferences } from 'style-dictionary/utils'

import { harnessLog } from './complete-log.js'
import { DESIGN_SYSTEM_PREFIX, STYLE_FILE_PATH } from './constants.js'
import { generateCoreFiles, generateThemeFiles } from './sd-file-generators.js'

register(StyleDictionary)

async function run() {
  const $themes = JSON.parse(await fs.readFile('design-tokens/$themes.json'))
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
        js: {
          transformGroup: 'tokens-studio',
          prefix: DESIGN_SYSTEM_PREFIX,
          options: {
            fileHeader: () => {
              return [
                'Harness Design System',
                'Generated style tokens - DO NOT EDIT DIRECTLY',
                `Generated on ${new Date().toUTCString()}`,
                'Copyright (c) Harness.'
              ]
            }
          },
          transforms: ['name/kebab', 'attribute/themeable', 'ts/transform/alpha'],
          files: [
            // core tokens (colors, typography, dimensions, components)
            ...generateCoreFiles(),
            // semantic tokens, e.g. for application developer
            ...generateThemeFiles(theme)
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
}

async function createIndexFile() {
  console.log('\n\x1b[34mCreating styles/index.css import file...\x1b[0m')

  // Get list of all CSS files
  const styleValueFiles = (await fs.readdir(STYLE_FILE_PATH.DESIGN_SYSTEM))
    .filter(file => file.endsWith('.js') && file !== 'index.js')
    .sort()

  // Organize files by type
  const coreFiles = styleValueFiles.filter(file => !file.startsWith('source-'))
  const darkFiles = styleValueFiles.filter(file => file.includes('-dark-'))
  const lightFiles = styleValueFiles.filter(file => file.includes('-light-'))

  console.log('\n=== Theme File Summary ===')
  console.table({
    'Dark Theme Files': { count: darkFiles.length },
    'Light Theme Files': { count: lightFiles.length }
  })
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
    const name = file.replace('.js', '')
    return `'${name}': '${name}',`
  })
  .join('\n')}
}

/* Core tokens */
${coreFiles
  .map(file => {
    const name = file.replace('.js', '').replace(/-./g, x => x[1].toUpperCase())
    return `export { default as ${name} } from './${file}';`
  })
  .join('\n')}

/* Theme files - Dark */
${darkFiles
  .map(file => {
    const name = file.replace('.js', '').replace(/-./g, x => x[1].toUpperCase())
    return `export { default as ${name} } from './${file}';`
  })
  .join('\n')}

/* Theme files - Light */
${lightFiles
  .map(file => {
    const name = file.replace('.js', '').replace(/-./g, x => x[1].toUpperCase())
    return `export { default as ${name} } from './${file}';`
  })
  .join('\n')};
`

  // Write file
  await fs.writeFile(STYLE_FILE_PATH.INDEX, content)

  console.log('\n\x1b[1m\x1b[32m%s\x1b[0m', `✔︎ Created ${STYLE_FILE_PATH.INDEX} with imports to all token files`)
  harnessLog()
}

run()
