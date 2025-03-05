import fs from 'node:fs/promises'

import { permutateThemes, register } from '@tokens-studio/sd-transforms'
import StyleDictionary from 'style-dictionary'
import { getReferences, usesReferences } from 'style-dictionary/utils'

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
          transforms: ['attribute/themeable', 'name/kebab'],
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
    const sd = new StyleDictionary(cfg)

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
        if (usesReferences(token.original.value)) {
          const refs = getReferences(token.original.value, sd.tokens)
          if (refs.some(ref => isPartOfEnabledSet(ref))) {
            return {
              themeable: true
            }
          }
        }
      }
    })

    await sd.cleanAllPlatforms()
    await sd.buildAllPlatforms()
  }
}
run()
