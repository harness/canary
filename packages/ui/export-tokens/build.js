import fs from 'node:fs/promises'

import { permutateThemes, register, transformColorModifiers } from '@tokens-studio/sd-transforms'
import StyleDictionary from 'style-dictionary'
// import { commentStyles } from 'style-dictionary/enums'
// import { Config } from 'style-dictionary/types'
import { getReferences, resolveReferences, usesReferences } from 'style-dictionary/utils'

import { STYLE_FILE_PATH } from './constants.js'
import { generateCoreFiles, generateThemeFiles } from './sd-file-generators.js'

register(StyleDictionary)

// Register a custom CSS formatter that handles alpha values
// StyleDictionary.registerFormat({
//   name: 'css/variables-with-alpha',
//   format: function ({ dictionary, file, options = {} }) {
//     const { selector = ':root' } = options

//     // Generate file header if needed
//     let header = ''
//     if (options.fileHeader) {
//       header = '/**\n'
//       ;(typeof options.fileHeader === 'function' ? options.fileHeader() : ['Style Dictionary Generated']).forEach(
//         line => {
//           header += ` * ${line}\n`
//         }
//       )
//       header += ' */\n'
//     }

//     return (
//       header +
//       `\n${selector} {\n` +
//       dictionary.allTokens
//         .map(token => {
//           // Handle alpha values from extensions

//           if (token?.original?.$extensions?.['studio.tokens']?.modify?.type === 'alpha') {
//             console.log('resolveReferences', resolveReferences)

//             // console.log(
//             //   'transformColorModifiers(token)',
//             //   transformColorModifiers(token, {
//             //     format: 'lch'
//             //   })
//             // )
//           }

//           return ''

//           const hasAlpha =
//             token.original &&
//             token.original.$extensions &&
//             token.original.$extensions['studio.tokens'] &&
//             token.original.$extensions['studio.tokens'].modify &&
//             token.original.$extensions['studio.tokens'].modify.type === 'alpha'

//           if (hasAlpha) {
//             const alphaValue = token.original.$extensions['studio.tokens'].modify.value
//             // console.log(`Using custom format for ${token.name} with alpha ${alphaValue}`)

//             // Check if we need to handle a reference
//             const baseValue = token.original.$value
//             if (typeof baseValue === 'string' && baseValue.startsWith('{') && baseValue.endsWith('}')) {
//               // This is a reference - format it with the alpha value
//               const path = baseValue.substring(1, baseValue.length - 1)
//               const varName = path.replace(/\./g, '-')
//               return `  --${token.name}: var(--canary-${varName}) / ${alphaValue};`
//             } else {
//               // Direct color value - add the alpha
//               return `  --${token.name}: ${token.value} / ${alphaValue};`
//             }
//           } else {
//             console.log('token', JSON.stringify(token, null, 2))

//             return `  --${token.name}: ${transformColorModifiers(token)};`
//             // Normal token without alpha - check for undefined values
//             if (token.value === undefined) {
//               console.warn(`Warning: Token ${token.name} has undefined value`)
//               return `  --${token.name}: ${token.$value}; /* WARNING: Original value was undefined */`
//             }
//             return `  --${token.name}: ${token.value};`
//           }
//         })
//         .join('\n') +
//       '\n}\n'
//     )
//   }
// })

// Custom transform to handle alpha values with the '/' syntax
// Custom transform for handling alpha values in color tokens
// StyleDictionary.registerTransform({
//   name: 'color/alpha-separate',
//   type: 'value',
//   filter: function (token) {
//     // This filter function checks for color type and alpha extension
//     const isMatch =
//       token.$type === 'color' &&
//       token.original &&
//       token.original.$extensions &&
//       token.original.$extensions['studio.tokens'] &&
//       token.original.$extensions['studio.tokens'].modify &&
//       token.original.$extensions['studio.tokens'].modify.type === 'alpha'

//     if (isMatch) {
//       console.log('MATCH FOUND: Token with alpha:', token.path?.join('.') || token.name)
//       console.log('Alpha value:', token.original.$extensions['studio.tokens'].modify.value)
//       console.log('Base value:', token.original.$value)
//     }

//     return isMatch
//   },
//   transform: function (token, config, options) {
//     // Get the alpha value directly from the token
//     const alphaValue = token.original.$extensions['studio.tokens'].modify.value
//     const baseColor = token.original.$value

//     // Log for debugging
//     console.log(`Applying alpha ${alphaValue} to token ${token.name}`)
//     console.log(`Base color: ${baseColor}, Current value: ${token.$value}`)

//     // Add alpha to the color using the / syntax
//     if (typeof baseColor === 'string' && baseColor.startsWith('{') && baseColor.endsWith('}')) {
//       // Handle reference to another token
//       const path = baseColor.substring(1, baseColor.length - 1)
//       const varName = path.replace(/\./g, '-')
//       return `var(--canary-${varName}) / ${alphaValue}`
//     } else {
//       // Handle direct color value
//       return `${token.$value} / ${alphaValue}`
//     }
//   }
// })

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
        css: {
          transformGroup: 'tokens-studio',
          prefix: 'canary-',
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

        // console.log('usesReferences(token.original.value)', usesReferences(token.original.value))
        // console.log('(token.original.value)', JSON.stringify(token.original, null, 2))

        // Set token to themeable if it's using a reference and inside the reference chain
        // any one of them is from a themeable set
        if (usesReferences(token.original.$value)) {
          const refs = getReferences(token.original.$value, sd.tokens)
          // console.log('refs', refs)

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
        // return prop.type === 'color'
        return (
          prop.$extensions?.['studio.tokens']?.modify?.type === 'alpha' &&
          prop.$extensions?.['studio.tokens']?.modify?.space === 'lch'
        )
      },
      transitive: true,
      transform: prop => {
        console.log('prop', JSON.stringify(prop, null, 2))

        const baseColor = prop.original.$value.replace(/[{}]/g, '').replace(/\./g, '-')
        const alphaValue = prop.$extensions['studio.tokens'].modify.value
        return `lch(from var(--canary-${baseColor}) l c h / ${alphaValue})`
        // return `lch(var(--canary-${baseColor}) / ${alphaValue})`
      }
    })

    await sd.cleanAllPlatforms()
    await sd.buildAllPlatforms()
  }

  // Create index.css that imports all generated files
  await createIndexFile()
}

async function createIndexFile() {
  console.log('\nCreating styles/index.css import file...')

  // Get list of all CSS files
  const cssFiles = (await fs.readdir(STYLE_FILE_PATH.DESIGN_SYSTEM))
    .filter(file => file.endsWith('.css') && file !== 'index.css')
    .sort()

  // Organize files by type
  const coreFiles = cssFiles.filter(file => !file.startsWith('source-'))
  const darkFiles = cssFiles.filter(file => file.includes('-dark-'))
  const lightFiles = cssFiles.filter(file => file.includes('-light-'))

  console.log('\n=== Theme File Summary ===')
  console.log('Total dark theme files: ', darkFiles.length)
  console.log('Total light theme files:', lightFiles.length)
  console.log('\n')

  // Generate content
  const content = `/**
 * Harness Design System
 * Main stylesheet importing all token files
 * DO NOT UPDATE IT MANUALLY
 * Generated on ${new Date().toUTCString()}
 */

/* Core tokens */
${coreFiles.map(file => `@import './${file}';`).join('\n')}

/* Theme files - Dark */
${darkFiles.map(file => `@import './${file}';`).join('\n')}

/* Theme files - Light */
${lightFiles.map(file => `@import './${file}';`).join('\n')};
`

  // Write file
  await fs.writeFile(STYLE_FILE_PATH.INDEX, content)
  console.log(`\u2705 Created ${STYLE_FILE_PATH.INDEX} with imports to all token files`)
}

run()
