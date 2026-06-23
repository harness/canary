import { getMonacoThemes } from '../monaco-theme-utils'

/**
 * When a `--cn-comp-monaco-*` CSS variable fails to resolve to a parseable color,
 * the converter returns `undefined`. Feeding that `undefined` into a monaco theme
 * crashes monaco's contrast logic:
 *   "Cannot read properties of undefined (reading 'getRelativeLuminance')".
 * The generated theme must therefore never expose `undefined` color values.
 */
describe('getMonacoThemes', () => {
  const findTheme = (name: string) => getMonacoThemes(name).find(theme => theme.themeName === name)

  it('never emits undefined color values in the colors map', () => {
    const theme = findTheme('dark-undefined-colors-std')

    expect(theme).toBeDefined()
    Object.values(theme!.themeData.colors).forEach(value => {
      expect(value).not.toBeUndefined()
    })
  })

  it('never emits undefined foreground/background on token rules', () => {
    const theme = findTheme('light-undefined-rules-std')

    expect(theme).toBeDefined()
    theme!.themeData.rules.forEach(rule => {
      expect(rule).not.toHaveProperty('foreground', undefined)
      expect(rule).not.toHaveProperty('background', undefined)
    })
  })

  it('sets the base derived from the theme name', () => {
    expect(findTheme('light-base-std')?.themeData.base).toBe('vs')
    expect(findTheme('dark-base-std')?.themeData.base).toBe('vs-dark')
  })
})
