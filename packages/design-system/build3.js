import { register } from '@tokens-studio/sd-transforms'
import StyleDictionary from 'style-dictionary'

// will register them on StyleDictionary object
// that is installed as a dependency of this package.
register(StyleDictionary)

const sd = new StyleDictionary({
  // make sure to have source match your token files!
  // be careful about accidentally matching your package.json or similar files that are not tokens
  source: ['primitives/**/*.json', 'theme/**/*.json', 'breakpoint/**/*.json'],
  preprocessors: ['tokens-studio'], // <-- since 0.16.0 this must be explicit
  platforms: {
    css: {
      transformGroup: 'tokens-studio', // <-- apply the tokens-studio transformGroup to apply all transforms
      transforms: ['name/kebab'], // <-- add a token name transform for generating token names, default is camel
      buildPath: 'dist/css/',
      prefix: 'canary-',
      options: {
        outputReferences: true,
        showFileHeader: true
      },
      files: [
        {
          filter: token => {
            return token.filePath.includes('primitives/colors.json')
          },
          destination: 'colors-variables.css',
          format: 'css/variables'
        },
        {
          filter: token => {
            return token.filePath.includes('theme/')
          },
          destination: 'themes.css',
          format: 'css/variables'
        },
        {
          filter: token => {
            return token.filePath.includes('primitives/typography.json')
          },
          destination: 'typography.css',
          format: 'css/variables'
        },
        {
          filter: token => {
            return token.filePath.includes('primitives/dimensions.json')
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
            return token.filePath.includes('primitives/icon.json')
          },
          destination: 'icons.css',
          format: 'css/variables'
        }
      ]
    }
  }
})

await sd.cleanAllPlatforms()
await sd.buildAllPlatforms()
