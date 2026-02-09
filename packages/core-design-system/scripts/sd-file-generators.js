import { breakpointFilter, componentsFilter, coreFilter, lchColorsFilter, semanticFilter } from './sd-filters.js'

// const format = 'css/variables'

// ✨ Building core tokens
export const generateCoreFiles = ({ destination, type, format }) => [
  {
    destination: `${destination}/core.${type}`,
    format,
    filter: coreFilter,
    options: {
      outputReferences: false,
      selector: `:root, :host`
    }
  },
  {
    destination: `${destination}/colors.${type}`,
    format,
    filter: lchColorsFilter,
    options: {
      outputReferences: false,
      selector: `:root, :host`
    }
  },
  {
    destination: `${destination}/breakpoint.${type}`,
    format,
    filter: breakpointFilter,
    options: {
      outputReferences: true,
      selector: `:root, :host`
    }
  },
  {
    destination: `${destination}/components.${type}`,
    format,
    filter: componentsFilter,
    options: {
      outputReferences: true,
      selector: `:root, :host`
    }
  }
]

// ✨ Building theme-specific tokens
export const generateThemeFiles = ({ destination, type, theme, format }) => {
  const filesArr = []
  const themeLower = theme.toLowerCase().replace(/(source-|-desktop)/g, '')

  const entityName = themeLower.toLowerCase()
  
  // Extract simple mode name for filename (dark/light)
  const simpleModeName = entityName.includes('-light') ? 'light' : 'dark'

  let mfeSupportedClass = ''

  // To support backward compatibility and testing. It will be removed in future.
  if (simpleModeName === `light` || simpleModeName === `dark`) {
    mfeSupportedClass = `.${simpleModeName}-std-std, .${simpleModeName}-test`
  }

  // Map theme names to ThemeSelector format (collection-mode)
  // ColorType: std, tri, pro, deu
  // ContrastType: std, low, high
  const themeToSelectorMap = {
    // Standard collection
    'standard-dark': 'dark-std-std',
    'standard-light': 'light-std-std',
    
    // High contrast collection
    'high-contrast-dark': 'dark-std-high',
    'high-contrast-light': 'light-std-high',
    
    // Low contrast collection
    'low-contrast-dark': 'dark-std-low',
    'low-contrast-light': 'light-std-low',
    
    // Standard protanopia collection
    'standard-protanopia-dark': 'dark-pro-std',
    'standard-protanopia-light': 'light-pro-std',
    
    // High contrast protanopia collection
    'high-contrast-protanopia-dark': 'dark-pro-high',
    'high-contrast-protanopia-light': 'light-pro-high',
    
    // Low contrast protanopia collection
    'low-contrast-protanopia-dark': 'dark-pro-low',
    'low-contrast-protanopia-light': 'light-pro-low',
    
    // Standard deuteranopia collection
    'standard-deuteranopia-dark': 'dark-deu-std',
    'standard-deuteranopia-light': 'light-deu-std',
    
    // High contrast deuteranopia collection
    'high-contrast-deuteranopia-dark': 'dark-deu-high',
    'high-contrast-deuteranopia-light': 'light-deu-high',
    
    // Low contrast deuteranopia collection
    'low-contrast-deuteranopia-dark': 'dark-deu-low',
    'low-contrast-deuteranopia-light': 'light-deu-low',
    
    // Standard tritanopia collection
    'standard-tritanopia-dark': 'dark-tri-std',
    'standard-tritanopia-light': 'light-tri-std',
    
    // High contrast tritanopia collection
    'high-contrast-tritanopia-dark': 'dark-tri-high',
    'high-contrast-tritanopia-light': 'light-tri-high',
    
    // Low contrast tritanopia collection
    'low-contrast-tritanopia-dark': 'dark-tri-low',
    'low-contrast-tritanopia-light': 'light-tri-low'
  }

  const selectorClass = themeToSelectorMap[entityName]
  if (selectorClass) {
    mfeSupportedClass = mfeSupportedClass ? `${mfeSupportedClass}, .${selectorClass}` : `.${selectorClass}`
  }

  // theme-specific outputs
  filesArr.push({
    format,
    filter: semanticFilter(true),
    destination: `${destination}/${entityName}.${type}`,
    options: {
      outputReferences: token => {
        // ADD REFERENCE ONLY TO NON-MODIFIED TOKENS
        // Alpha, darken, lighten tokens are transformed and need resolved values
        const modifyType = token?.$extensions?.['studio.tokens']?.modify?.type
        if (modifyType === 'alpha' || modifyType === 'darken' || modifyType === 'lighten') {
          return false
        }
        return true
      },
      // To add .dark and .light to support MFE
      selector: `.${simpleModeName}${mfeSupportedClass ? ', ' + mfeSupportedClass : ''}`
    }
  })
  return filesArr
}

// for each component (currently only button), filter those specific component tokens and output them
// to the component folder where the component source code will live
// export const generateComponentFiles = components => {
//   const filesArr = []

//   for (const comp of components) {
//     filesArr.push({
//       format,
//       filter: componentFilter(comp, true),
//       options: {
//         // since these will be used in ShadowDOM
//         selector: ':host',
//         outputReferences: outputReferencesTransformed
//       },
//       destination: `components/${comp}/${comp}.css`
//     })
//   }
//   return filesArr
// }
