import { breakpointFilter, componentsFilter, coreFilter, lchColorsFilter, semanticFilter } from './sd-filters.js'

// const format = 'css/variables'

// ✨ Building core tokens
export const generateCoreFiles = ({ destination, type, format }) => [
  {
    destination: `${destination}/core.${type}`,
    format,
    filter: coreFilter,
    options: {
      outputReferences: false
    }
  },
  {
    destination: `${destination}/colors.${type}`,
    format,
    filter: lchColorsFilter,
    options: {
      outputReferences: true
    }
  },
  {
    destination: `${destination}/breakpoint.${type}`,
    format,
    filter: breakpointFilter,
    options: {
      outputReferences: true
    }
  },
  {
    destination: `${destination}/components.${type}`,
    format,
    filter: componentsFilter,
    options: {
      outputReferences: true
    }
  }
]

// ✨ Building theme-specific tokens
export const generateThemeFiles = ({ destination, type, theme, format }) => {
  const filesArr = []
  const themeLower = theme.toLowerCase().replace(/(source-|desktop-)/g, '')

  // theme-specific outputs
  filesArr.push({
    format,
    filter: semanticFilter(true),
    destination: `${destination}/${themeLower.toLowerCase()}.${type}`,
    options: {
      outputReferences: token => {
        // ADD REFERENCE ONLY TO NON-ALPHA TOKENS, ALPHA TOKENS ARE TRANSFORMED AND REFERENCED MANUALLY
        return token?.$extensions?.['studio.tokens']?.modify?.type !== 'alpha'
      },
      selector: `.${themeLower.toLowerCase()}`
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
