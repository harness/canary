export enum ModeType {
  Dark = 'dark',
  Light = 'light',
  System = 'system'
}

export enum ColorType {
  Standard = 'std',
  Tritanopia = 'tri',
  Protanopia = 'pro',
  Deuteranopia = 'deu'
}

export enum ContrastType {
  Standard = 'std',
  Low = 'low',
  High = 'high'
}

export type FullTheme = `${ModeType}-${ColorType}-${ContrastType}`

export interface IThemeStore {
  theme?: FullTheme
  setTheme: (theme: FullTheme) => void
  isLightTheme: boolean
}

export const defaultTheme = `${ModeType.Dark}-${ColorType.Standard}-${ContrastType.Standard}` as FullTheme

const COLOR_TO_SUFFIX: Record<ColorType, string | null> = {
  [ColorType.Standard]: null,
  [ColorType.Protanopia]: 'protanopia',
  [ColorType.Deuteranopia]: 'deuteranopia',
  [ColorType.Tritanopia]: 'tritanopia'
}

const CONTRAST_TO_SEGMENT: Record<ContrastType, string | null> = {
  [ContrastType.Standard]: null,
  [ContrastType.Low]: 'dimmer',
  [ContrastType.High]: 'high-contrast'
}

/**
 * Maps a FullTheme (e.g. "dark-pro-high") to the corresponding CSS theme
 * filename key (e.g. "dark-high-contrast-protanopia"). Returns null for
 * base themes (dark-std-std, light-std-std) that are already bundled.
 */
export function getThemeCSSName(theme: FullTheme): string | null {
  const [mode, color, contrast] = theme.split('-') as [ModeType, ColorType, ContrastType]

  /**
   * dark-std-std, light-std-std themes are already bundled
   */
  if (color === ColorType.Standard && contrast === ContrastType.Standard) return null

  const parts: string[] = [mode]
  const contrastSegment = CONTRAST_TO_SEGMENT[contrast]
  if (contrastSegment) parts.push(contrastSegment)
  const colorSuffix = COLOR_TO_SUFFIX[color]
  if (colorSuffix) parts.push(colorSuffix)

  return parts.join('-')
}
