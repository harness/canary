// filters only tokens originating from core folder
export const coreFilter = token => token.filePath.startsWith('design-tokens/core/')

// filters only tokens originating from breakpoint folder
export const breakpointFilter = token => token.filePath.startsWith('design-tokens/breakpoint/')

// filters only tokens originating from components folder
export const componentsFilter = token => token.filePath.startsWith('design-tokens/components/')

// filters only tokens originating from semantic sets (not core, not components) and also check themeable or not
export const semanticFilter =
  (themeable = false) =>
  token => {
    console.log('token', token)

    const themeDimensions = ['mode', 'brand']
    const tokenThemable = Boolean(token.attributes.themeable)
    // return true;
    return (
      themeable === tokenThemable &&
      [...themeDimensions].some(cat => token.filePath.startsWith(`design-tokens/${cat}/`))
    )
  }

// filters tokens by themable and from which tokenset they originate
// must match per component name, in this repository we currently only have "button"
export const componentFilter = cat => token => token.filePath === `tokens/component/${cat}.json`
