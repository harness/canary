import { ColorType, ContrastType, ModeType } from './types'

export function getModeColorContrastFromFullTheme(theme: string) {
  const modeColorContrast = theme.split('-')

  if (modeColorContrast.length === 3) {
    return {
      mode: modeColorContrast[0] as ModeType,
      color: modeColorContrast[1] as ColorType,
      contrast: modeColorContrast[2] as ContrastType
    }
  } else {
    return { mode: ModeType.Dark, color: ColorType.Standard, contrast: ContrastType.Standard }
  }
}
