import { outputReferencesTransformed } from 'style-dictionary/utils'

import { breakpointFilter, componentFilter, componentsFilter, coreFilter, semanticFilter } from './sd-filters.js'

const format = 'css/variables'

// ✨ Building core tokens
export const generateCoreFiles = () => [
  {
    destination: 'src/styles2/core.css',
    format,
    filter: coreFilter,
    options: {
      outputReferences: true
    }
  },
  {
    destination: 'src/styles2/breakpoint.css',
    format,
    filter: breakpointFilter,
    options: {
      outputReferences: true
    }
  },
  {
    destination: 'src/styles2/components.css',
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
    destination: `src/styles2/${theme.toLowerCase()}.css`,
    options: {
      outputReferences: true,
      selector: `.${theme.toLowerCase()}`
    }
  })

  // // not theme-specific outputs
  // filesArr.push({
  //   format,
  //   filter: semanticFilter(false),
  //   options: {
  //     selector: `.${theme.toLowerCase()}`
  //   },
  //   destination: `styles2/semantic.css`
  // })

  return filesArr
}

// for each component (currently only button), filter those specific component tokens and output them
// to the component folder where the component source code will live
export const generateComponentFiles = components => {
  const filesArr = []

  for (const comp of components) {
    filesArr.push({
      format,
      filter: componentFilter(comp, true),
      options: {
        // since these will be used in ShadowDOM
        selector: ':host',
        outputReferences: outputReferencesTransformed
      },
      destination: `components/${comp}/${comp}.css`
    })
  }
  return filesArr
}
