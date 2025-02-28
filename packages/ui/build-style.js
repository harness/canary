import fs from 'fs'
import path from 'path'

import { register } from '@tokens-studio/sd-transforms'
import StyleDictionary from 'style-dictionary'

// will register them on StyleDictionary object
// that is installed as a dependency of this package.
await register(StyleDictionary)

// Function to get all theme files
const getThemeFiles = () => {
  console.log('\n🔍 ========== THEME DIRECTORY SCAN ==========\n')
  const themeDirPath = path.resolve('./design-tokens/theme')
  console.log('🗂️ Theme directory path:', themeDirPath)

  const files = fs.readdirSync(themeDirPath)
  console.log('📄 All files in theme directory:', files)
  console.log('\n📋 ========== THEME FILES VALIDATION ==========\n')

  const themeFiles = files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join('theme', file)
      const fullPath = path.resolve(themeDirPath, file)

      // Check if file exists and is readable
      try {
        const stats = fs.statSync(fullPath)

        console.log(`✅ File ${file} exists: ${stats.isFile()}`)

        // Try to read the file content to verify it's readable
        const content = fs.readFileSync(fullPath, 'utf8')
        console.log(`📖 File ${file} is readable, number of lines: ${content.split('\n').length}`)
        console.log('\n')
      } catch (error) {
        console.error(`❌ Error checking file ${file}:`, error.message)
      }

      return {
        name: file.split('.')[0],
        path: `design-tokens/${filePath}`,
        fullPath: fullPath
      }
    })

  console.log('\n🎨 ========== THEME FILES SUMMARY ==========\n')
  console.log('🎨 Theme files found:', themeFiles)
  console.log('\n================================================\n')
  return themeFiles
}

// Get all theme files
const themeFiles = getThemeFiles()

// Create a base StyleDictionary configuration
const baseConfig = {
  source: [
    'design-tokens/primitives/**/*.json',
    'design-tokens/breakpoint/**/*.json',
    'design-tokens/components/**/*.json'
  ],
  preprocessors: ['tokens-studio'],
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
      transforms: ['name/kebab'],
      buildPath: 'src/styles/',
      prefix: 'canary-',
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
            return token.filePath.includes('primitives/colors.json')
          },
          destination: 'colors.css',
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
          destination: 'icon.css',
          format: 'css/variables'
        },
        {
          filter: token => {
            return token.filePath.includes('components/')
          },
          destination: 'components.css',
          format: 'css/variables'
        }
      ]
    }
  }
}

// const styleDictionaryConfigWithThemes = themeFiles.reduce((acc, theme) => {
//   acc.source = [...acc.source, theme.path]
//   acc.platforms.css.files.push({
//     filter: token => {
//       return token.filePath.includes(theme.path)
//     },
//     destination: `themes/${theme.name}.css`,
//     format: 'css/variables'
//   })
//   return acc
// }, baseConfig)

// console.log(JSON.stringify(styleDictionaryConfigWithThemes, null, 4))

// Process each theme file separately
themeFiles.forEach(async theme => {
  console.log(`\n ✨ ========== PROCESSING THEME: ${theme.name.toUpperCase()} ==========\n`)
  // console.log(`🔄 Processing theme: ${theme.name}`)

  // Create a configuration for this theme
  const themeConfig = {
    ...baseConfig,
    source: [...baseConfig.source, theme.path],
    platforms: {
      css: {
        ...baseConfig.platforms.css,
        files: [
          ...baseConfig.platforms.css.files,
          {
            filter: token => {
              return token.filePath.includes(theme.path)
            },
            destination: `themes/${theme.name}.css`,
            format: 'css/variables',
            options: {
              selector: `.${theme.name}`
            }
          }
        ]
      }
    }
  }

  // Build this theme
  const sd = new StyleDictionary(themeConfig)
  await sd.buildAllPlatforms()
})
