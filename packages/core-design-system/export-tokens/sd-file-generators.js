import { STYLE_FILE_PATH } from './constants.js'
import { breakpointFilter, componentsFilter, coreFilter, lchColorsFilter, semanticFilter } from './sd-filters.js'

const format = 'css/variables'

// ✨ Building core tokens
export const generateCoreFiles = () => [
  {
    destination: STYLE_FILE_PATH.CORE,
    format,
    filter: coreFilter,
    options: {
      outputReferences: true
    }
  },
  {
    destination: STYLE_FILE_PATH.COLORS,
    format,
    filter: lchColorsFilter,
    options: {
      outputReferences: true
    }
  },
  {
    destination: STYLE_FILE_PATH.BREAKPOINT,
    format,
    filter: breakpointFilter,
    options: {
      outputReferences: true
    }
  },
  {
    destination: STYLE_FILE_PATH.COMPONENTS,
    format,
    filter: componentsFilter,
    options: {
      outputReferences: true
    }
  }
]

// ✨ Building theme-specific tokens
export const generateThemeFiles = theme => {
  const filesArr = []
  // theme-specific outputs
  filesArr.push({
    format,
    filter: semanticFilter(true),
    destination: `${STYLE_FILE_PATH.DESIGN_SYSTEM}/${theme.toLowerCase()}.css`,
    options: {
      outputReferences: token => {
        // ADD REFERENCE ONLY TO NON-ALPHA TOKENS, ALPHA TOKENS ARE TRANSFORMED AND REFERENCED MANUALLY
        return token?.$extensions?.['studio.tokens']?.modify?.type !== 'alpha'
      },
      selector: `.${theme.toLowerCase()}`
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
