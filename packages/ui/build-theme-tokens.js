import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import { permutateThemes, register } from '@tokens-studio/sd-transforms'
import StyleDictionary from 'style-dictionary'

// Get current file's directory name (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Paths
const DESIGN_TOKENS_DIR = path.join(__dirname, 'design-tokens')
const OUTPUT_DIR = path.join(__dirname, 'src', 'styles', 'tokens')

// Register TokenStudio transforms
register(StyleDictionary)

// Create output directory if it doesn't exist
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true })
    console.log(`Directory created or already exists: ${dirPath}`)
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error)
    throw error
  }
}

// Load JSON file
async function loadJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error loading JSON file ${filePath}:`, error)
    throw error
  }
}

// Get all files in a directory with a specific extension
async function getFilesInDirectory(dirPath, extension = '.json') {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })

    const files = entries.filter(entry => entry.isFile() && entry.name.endsWith(extension)).map(entry => entry.name)

    return files
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error)
    return []
  }
}

// Get all subdirectories in a directory
async function getSubdirectories(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })

    const directories = entries.filter(entry => entry.isDirectory()).map(entry => entry.name)

    return directories
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error)
    return []
  }
}

// Build core colors separately
async function buildCoreColors() {
  try {
    console.log('Building core colors...')

    const colorsConfig = {
      source: [`${DESIGN_TOKENS_DIR}/core/colors.json`],
      platforms: {
        css: {
          transformGroup: 'tokens-studio',
          buildPath: `${OUTPUT_DIR}/`,
          files: [
            {
              destination: 'colors.css',
              format: 'css/variables',
              options: {
                selector: ':root',
                outputReferences: true
              }
            }
          ]
        }
      }
    }

    const sd = new StyleDictionary(colorsConfig)
    sd.buildAllPlatforms()

    console.log('✅ Core colors built')
    return true
  } catch (error) {
    console.error('Error building core colors:', error)
    return false
  }
}

// Main function to build themes
async function buildThemes() {
  try {
    // Ensure output directory exists
    await ensureDirectoryExists(OUTPUT_DIR)

    // Build core colors first
    await buildCoreColors()

    // Get brand themes
    const brandDir = path.join(DESIGN_TOKENS_DIR, 'brand')
    const brandFiles = await getFilesInDirectory(brandDir)
    const brandThemes = brandFiles.map(file => ({
      name: path.basename(file, '.json'),
      group: 'brand',
      selectedTokenSets: {
        [`brand/${path.basename(file, '.json')}`]: 'enabled'
      }
    }))

    // Get mode themes
    const modeDir = path.join(DESIGN_TOKENS_DIR, 'mode')
    const modeTypes = await getSubdirectories(modeDir)

    const modeThemes = []
    for (const modeType of modeTypes) {
      const modeTypeDir = path.join(modeDir, modeType)
      const modeFiles = await getFilesInDirectory(modeTypeDir)

      for (const file of modeFiles) {
        modeThemes.push({
          name: `${modeType}-${path.basename(file, '.json')}`,
          group: 'mode',
          selectedTokenSets: {
            [`mode/${modeType}/${path.basename(file, '.json')}`]: 'enabled'
          }
        })
      }
    }

    // Create combined themes
    const combinedThemes = []
    for (const brandTheme of brandThemes) {
      for (const modeTheme of modeThemes) {
        combinedThemes.push({
          id: `${brandTheme.name.toLowerCase()}-${modeTheme.name.toLowerCase()}`,
          name: `${brandTheme.name}-${modeTheme.name}`,
          group: 'theme',
          selectedTokenSets: {
            ...brandTheme.selectedTokenSets,
            ...modeTheme.selectedTokenSets,
            'core/colors': 'enabled', // Keep colors in themes to ensure references work
            'core/typography': 'enabled',
            'core/dimensions': 'enabled',
            'breakpoint/desktop': 'enabled'
          }
        })
      }
    }

    // Get all component token sets
    const componentsDir = path.join(DESIGN_TOKENS_DIR, 'components')
    const componentSets = []

    // Function to recursively get all JSON files in a directory
    async function getAllJsonFiles(dir, basePath = '') {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        const relativePath = path.join(basePath, entry.name)

        if (entry.isDirectory()) {
          await getAllJsonFiles(fullPath, relativePath)
        } else if (entry.isFile() && entry.name.endsWith('.json')) {
          const tokenSetPath = `components/${relativePath.replace(/\\/g, '/')}`.replace('.json', '')
          componentSets.push(tokenSetPath)
        }
      }
    }

    await getAllJsonFiles(componentsDir)

    // Add component token sets to all themes
    for (const theme of combinedThemes) {
      for (const componentSet of componentSets) {
        theme.selectedTokenSets[componentSet] = 'enabled'
      }
    }

    // Use the permutateThemes function to generate all theme permutations
    const themePermutations = permutateThemes(combinedThemes)

    // Build each theme
    for (const [themeName, tokenSets] of Object.entries(themePermutations)) {
      console.log(`Building theme: ${themeName}`)
      console.log(`Token sets: ${tokenSets.join(', ')}`)

      // Create Style Dictionary configuration
      const themeConfig = {
        source: tokenSets.map(set => `${DESIGN_TOKENS_DIR}/${set}.json`),
        preprocessors: ['tokens-studio'],
        platforms: {
          css: {
            prefix: 'canary-',
            transformGroup: 'tokens-studio',
            buildPath: `${OUTPUT_DIR}/`,
            files: [
              {
                destination: `${themeName}.css`,
                format: 'css/variables',
                options: {
                  selector: `:root[data-theme="${themeName}"]`,
                  outputReferences: true
                }
              }
            ]
          }
        }
      }

      // Build the theme
      const sd = new StyleDictionary(themeConfig)
      sd.buildAllPlatforms()

      console.log(`✅ Theme built: ${themeName}`)
    }

    // Create a theme index file
    const themeNames = Object.keys(themePermutations)
    const themeIndexContent = `// Generated theme index
export const availableThemes = ${JSON.stringify(themeNames, null, 2)};

export const defaultTheme = '${themeNames[0]}';

export function setTheme(themeName) {
  if (!availableThemes.includes(themeName)) {
    console.warn(\`Theme \${themeName} not found. Using default theme \${defaultTheme}\`);
    themeName = defaultTheme;
  }
  
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('theme', themeName);
}

export function getTheme() {
  return document.documentElement.getAttribute('data-theme') || defaultTheme;
}

export function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme || defaultTheme);
}
`

    await fs.writeFile(path.join(OUTPUT_DIR, 'theme-index.js'), themeIndexContent)
    console.log('✅ Theme index file created')

    // Create a base CSS file that imports all themes
    const baseCssContent = `/* Generated theme CSS */
/* Import core colors first */
@import './colors.css';

/* Import theme files */
${themeNames.map(theme => `@import './${theme}.css';`).join('\n')}

:root {
  color-scheme: light dark;
}

/* Default to first theme if no theme is set */
:root:not([data-theme]) {
  --theme-name: '${themeNames[0]}';
}
`

    await fs.writeFile(path.join(OUTPUT_DIR, 'themes.css'), baseCssContent)
    console.log('✅ Base theme CSS file created')

    console.log('🎉 All themes built successfully!')
  } catch (error) {
    console.error('Error building themes:', error)
    process.exit(1)
  }
}

// Run the build function
buildThemes()
