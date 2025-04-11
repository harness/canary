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
      outputReferences: true,
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

  // theme-specific outputs
  filesArr.push({
    format,
    filter: semanticFilter(true),
    destination: `${destination}/${entityName}.${type}`,
    options: {
      outputReferences: token => {
        // ADD REFERENCE ONLY TO NON-ALPHA TOKENS, ALPHA TOKENS ARE TRANSFORMED AND REFERENCED MANUALLY
        return token?.$extensions?.['studio.tokens']?.modify?.type !== 'alpha'
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
