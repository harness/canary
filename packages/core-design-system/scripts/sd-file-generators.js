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

  let mfeSupportedClass = ''

  // To support backward compatibility and testing. It will be removed in future.
  if (entityName === `light` || entityName === `dark`) {
    mfeSupportedClass = `.${entityName}-std-std, .${entityName}-test`
  }

  // Map theme names to ThemeSelector format (mode-color-contrast)
  // ColorType: std, tri, pro, deu
  // ContrastType: std, low, high
  const themeToSelectorMap = {
    // High contrast (standard color)
    'light-high-contrast': 'light-std-high',
    'dark-high-contrast': 'dark-std-high',
    // Dimmer/Low contrast (standard color)
    'light-dimmer': 'light-std-low',
    'dark-dimmer': 'dark-std-low',
    // High contrast + color blindness
    'light-high-contrast-deuteranopia': 'light-deu-high',
    'dark-high-contrast-deuteranopia': 'dark-deu-high',
    'light-high-contrast-protanopia': 'light-pro-high',
    'dark-high-contrast-protanopia': 'dark-pro-high',
    'light-high-contrast-tritanopia': 'light-tri-high',
    'dark-high-contrast-tritanopia': 'dark-tri-high',
    // Dimmer/Low contrast + color blindness
    'light-dimmer-deuteranopia': 'light-deu-low',
    'dark-dimmer-deuteranopia': 'dark-deu-low',
    'light-dimmer-protanopia': 'light-pro-low',
    'dark-dimmer-protanopia': 'dark-pro-low',
    'light-dimmer-tritanopia': 'light-tri-low',
    'dark-dimmer-tritanopia': 'dark-tri-low',
    // Standard contrast + color blindness
    'light-deuteranopia': 'light-deu-std',
    'dark-deuteranopia': 'dark-deu-std',
    'light-protanopia': 'light-pro-std',
    'dark-protanopia': 'dark-pro-std',
    'light-tritanopia': 'light-tri-std',
    'dark-tritanopia': 'dark-tri-std'
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
      selector: `.${entityName}${mfeSupportedClass ? ', ' + mfeSupportedClass : ''}`
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
