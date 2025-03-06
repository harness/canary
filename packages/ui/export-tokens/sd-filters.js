/**
 * filters only tokens originating from core folder, except colors.json
 * All the colors will be updated manually.
 * 🚨 TODO: UPDATE THE COLORS FILE NAME HERE 🚨
 *  */
export const coreFilter = token =>
  token.filePath.startsWith('design-tokens/core/') && !token.filePath.startsWith('design-tokens/core/colors.json')

// filters only tokens originating from breakpoint folder
export const breakpointFilter = token => token.filePath.startsWith('design-tokens/breakpoint/')

// filters only tokens originating from components folder
export const componentsFilter = token => token.filePath.startsWith('design-tokens/components/')

// filters only tokens originating from semantic sets (not core, not components) and also check themeable or not
export const semanticFilter =
  (themeable = false) =>
  token => {
    const themeDimensions = ['mode', 'brand']
    const tokenThemable = Boolean(token.attributes.themeable)
    // return true;
    return (
      themeable === tokenThemable &&
      [...themeDimensions].some(cat => token.filePath.startsWith(`design-tokens/${cat}/`))
    )
  }
