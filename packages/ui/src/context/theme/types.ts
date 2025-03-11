export enum ModeType {
  Dark = 'dark',
  Light = 'light',
  System = 'system'
}

export enum ColorType {
  Standard = 'std',
  Tritanopia = 'tri',
  ProtanopiaAndDeuteranopia = 'pnd'
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
}

// export const defaultTheme = `${ModeType.Dark}-${ColorType.Standard}-${ContrastType.Standard}` as FullTheme
export const defaultTheme = `source-dark-desktop-gitness` as FullTheme
