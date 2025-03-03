import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { permutateThemes, register } from '@tokens-studio/sd-transforms'
import StyleDictionary from 'style-dictionary'

// Get current file's directory name (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Register TokenStudio transforms
register(StyleDictionary)

// Read $themes.json to get theme configuration
const themesConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'design-tokens/$themes.json'), 'utf8'))

console.log(JSON.stringify(themesConfig, null, 2))

// Generate all theme permutations from your structure
const themePermutations = permutateThemes({
  // The base source files that apply to all themes
  sources: ['primitives/**/*.json', 'components/**/*.json', 'breakpoint/**/*.json'],
  // Your themes configuration from $themes.json
  themes: themesConfig,
  // Map theme names to their respective files
  themeOutputs: [
    {
      // For each theme name in $themes.json
      filter: theme => true,
      // Point to the directory with theme files
      outputPath: theme => `theme/${theme.name.toLowerCase()}/**/*.json`
    }
  ]
})

// Create config for each theme permutation
themePermutations.forEach(({ name, sources }) => {
  const themeConfig = {
    source: sources,
    platforms: {
      css: {
        transforms: [
          'ts/resolveMath',
          'ts/size/px',
          'ts/opacity',
          'ts/size/lineheight',
          'ts/typography/fontWeight',
          'ts/color/css',
          'name/cti/kebab'
        ],
        buildPath: 'dist/css/',
        files: [
          {
            destination: `${name}.css`,
            format: 'css/variables',
            options: {
              selector: `:root[data-theme="${name}"]`
            }
          }
        ]
      }
    }
  }

  // Create and build the style dictionary for this theme
  const sd = StyleDictionary.extend(themeConfig)
  sd.buildAllPlatforms()

  console.log(`✅ ${name} theme built`)
})
