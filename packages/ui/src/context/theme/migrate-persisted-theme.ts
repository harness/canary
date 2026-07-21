import { FullTheme } from './types'

/** Rewrite deprecated dimmer/low contrast themes to standard contrast. */
export function migrateLowContrastTheme(theme?: FullTheme): FullTheme | undefined {
  if (theme?.endsWith('-low')) {
    return theme.replace(/-low$/, '-std') as FullTheme
  }

  return theme
}
