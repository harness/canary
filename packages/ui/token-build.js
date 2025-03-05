import { promises } from 'fs'

import { permutateThemes, register } from '@tokens-studio/sd-transforms'
import StyleDictionary from 'style-dictionary'

register(StyleDictionary, {
  /* options here if needed */
})

/** @type {import('style-dictionary').Config} */
const baseConfig = {
  // 'design-tokens/breakpoint/**/*.json', 'design-tokens/components/**/*.json'
  source: ['design-tokens/core/**/*.json', 'design-tokens/breakpoint/**/*.json', 'design-tokens/components/**/*.json'],
  preprocessors: ['tokens-studio'],
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
      transforms: ['name/kebab'],
      buildPath: 'src/styles/',
      prefix: '--canary-',
      options: {
        outputReferences: true,
        showFileHeader: true,
        fileHeader: () => {
          return [
            'Harness Design System',
            'Generated style tokens - DO NOT EDIT DIRECTLY',
            `Generated on ${new Date().toUTCString()}`,
            'Copyright (c) Harness.'
          ]
        }
      },
      files: [
        {
          filter: token => {
            return token.filePath.includes('core/colors.json')
          },
          destination: 'colors.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            showFileHeader: true
          }
        },
        {
          filter: token => {
            return token.filePath.includes('core/typography.json')
          },
          destination: 'typography.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            showFileHeader: true
          }
        },
        {
          filter: token => {
            return token.filePath.includes('core/dimensions.json')
          },
          destination: 'dimensions.css',
          format: 'css/variables'
        },
        {
          filter: token => {
            return token.filePath.includes('breakpoint/')
          },
          destination: 'breakpoints.css',
          format: 'css/variables'
        },
        {
          filter: token => {
            return token.filePath.includes('components/')
          },
          destination: 'components.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            showFileHeader: true
          }
        }
      ]
    }
  }
}

async function run() {
  // process.env.LOG_VERBOSITY = 'verbose' // Enable verbose logging
  const $themes = JSON.parse(await promises.readFile('design-tokens/$themes.json', 'utf-8'))
  const themes = permutateThemes($themes, { separator: '-' })
  const configs = Object.entries(themes).map(([name, tokensets]) => {
    // filter to remove tokensets starts with core
    // const coreTokensets = tokensets.filter(tokenset => !tokenset.startsWith('core/'))

    return {
      source: tokensets.map(tokenset => `design-tokens/${tokenset}.json`),
      preprocessors: ['tokens-studio'], // <-- since 0.16.0 this must be explicit
      platforms: {
        css: {
          transformGroup: 'tokens-studio',
          transforms: ['name/kebab'],
          expand: (...args) => {
            console.log('args', args)
          },
          prefix: '--canary-',
          options: {
            outputReferences: true,
            showFileHeader: true,
            fileHeader: () => {
              return [
                'Harness Design System',
                'Generated style tokens - DO NOT EDIT DIRECTLY',
                `Generated on ${new Date().toUTCString()}`,
                'Copyright (c) Harness.'
              ]
            }
          },
          files: [
            {
              filter: token => {
                // console.log('=======================')
                // console.log('token', token)
                // console.log('token', token.filePath)
                // console.log(`token.filePath.includes('code/')`, token.filePath.includes('code/'))

                return !token.filePath.includes('code/')
              },
              destination: `src/styles/${name}.css`,
              format: 'css/variables',
              // selector: '.className',
              options: {
                selector: `.${name}`
              }
            }
          ]
        }
      }
    }
  })

  // console.log('configs', JSON.stringify(configs, null, 2))

  async function cleanAndBuild(cfg) {
    const sd = new StyleDictionary(cfg, {
      verbosity: 'verbose'
    })
    // await sd.cleanAllPlatforms() // optionally, cleanup files first..
    await sd.buildAllPlatforms()
  }
  await Promise.all([baseConfig, ...configs].map(cleanAndBuild))
}

run()
