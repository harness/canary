import fs from 'node:fs/promises'

import { permutateThemes, register } from '@tokens-studio/sd-transforms'
import StyleDictionary from 'style-dictionary'
import { getReferences, usesReferences } from 'style-dictionary/utils'

import { generateComponentFiles, generateCoreFiles, generateSemanticFiles } from './sd-file-generators.js'

register(StyleDictionary)

// list of components that we have tokens for, assume the tokenset path for it is tokens/${comp}.json
const components = ['button']

async function run() {
  const $themes = JSON.parse(await fs.readFile('design-tokens/$themes.json'))
  
  // Group themes by their group property
  const themesByGroup = $themes.reduce((acc, theme) => {
    if (!theme.group) return acc;
    if (!acc[theme.group]) acc[theme.group] = [];
    acc[theme.group].push(theme);
    return acc;
  }, {});
  
  // Create theme combinations from brand and mode groups
  const themeCombinations = [];
  if (themesByGroup.brand && themesByGroup.mode) {
    for (const brandTheme of themesByGroup.brand) {
      for (const modeTheme of themesByGroup.mode) {
        themeCombinations.push({
          id: `${brandTheme.name.toLowerCase()}-${modeTheme.name}`,
          name: `${brandTheme.name} ${modeTheme.name}`,
          group: 'theme', // Add a group property for combined themes
          selectedTokenSets: {
            ...brandTheme.selectedTokenSets,
            ...modeTheme.selectedTokenSets,
            'core/colors': 'enabled',
            'core/typography': 'enabled',
            'core/dimensions': 'enabled'
          }
        });
      }
    }
  }
  
  // Use the permutateThemes function with our combined themes
  const combinedThemes = [...$themes, ...themeCombinations];
  const themes = permutateThemes(combinedThemes);
  
  // collect all tokensets for all themes and dedupe
  const tokensets = [...new Set(Object.values(themes).reduce((acc, sets) => [...acc, ...sets], []))]
  // figure out which tokensets are theme-specific
  // this is determined by checking if a certain tokenset is used for EVERY theme dimension variant
  // if it is, then it is not theme-specific
  const themeableSets = tokensets.filter(set => {
    return !Object.values(themes).every(sets => sets.includes(set))
  })

  const configs = Object.entries(themes).map(([theme, sets]) => ({
    source: sets.map(tokenset => `design-tokens/${tokenset}.json`),
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        transformGroup: 'tokens-studio',
        transforms: ['attribute/themeable', 'name/kebab'],
        files: [
          // core tokens, e.g. for application developer, although in this project we don't really use core tokens directly, which is common
          ...generateCoreFiles(),
          // semantic tokens, e.g. for application developer
          ...generateSemanticFiles(theme),
          // component tokens, e.g. for design system developer
          ...generateComponentFiles(components)
        ]
      }
    }
  }))

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
          const set = token.filePath.replace(/^tokens\//g, '').replace(/.json$/g, '')
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
