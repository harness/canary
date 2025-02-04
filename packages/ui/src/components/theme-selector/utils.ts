import { ColorType, ContrastType, FullTheme, ModeType } from '@/context'

export function getModeColorContrastFromFullTheme(theme?: FullTheme) {
  if (theme) {
    const modeColorContrast = theme.split('-')

    if (modeColorContrast.length === 3) {
      return {
        mode: modeColorContrast[0] as ModeType,
        color: modeColorContrast[1] as ColorType,
        contrast: modeColorContrast[2] as ContrastType
      }
    }
  }

  return { mode: ModeType.Dark, color: ColorType.Standard, contrast: ContrastType.Standard }
}
