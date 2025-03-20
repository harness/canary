import { formats } from 'style-dictionary/enums'

export const DESIGN_SYSTEM_ROOT = 'src/styles'
export const DESIGN_SYSTEM_ROOT_ESM = 'src/styles-esm'

export const DESIGN_SYSTEM_PREFIX = 'cn'

export const STYLE_BUILD_FORMATS = {
  CSS_VARIABLES: formats.cssVariables,
  JS_ESM: formats.javascriptEsm
}

/**
 * Shared common config for css and ts style generation
 */
export const COMMON_CONFIG = {
  transformGroup: 'tokens-studio',
  prefix: DESIGN_SYSTEM_PREFIX,
  options: {
    fileHeader: () => {
      return ['Harness Design System', 'Generated style tokens - DO NOT EDIT DIRECTLY', 'Copyright (c) Harness.']
    }
  },
  transforms: ['name/kebab', 'attribute/themeable', 'ts/transform/alpha']
  // transformGroup: 'tokens-studio'
}

export const getExportFileHeader = () => `/**
    * Harness Design System
    * Main stylesheet importing all token files
    * DO NOT UPDATE IT MANUALLY
    */`

export const THEME_MODE_FILENAME_PREFIX = {
  DARK: 'dark-',
  LIGHT: 'light-'
}

export const OSS_STYLES_SOURCE_NAME = 'gitness'
