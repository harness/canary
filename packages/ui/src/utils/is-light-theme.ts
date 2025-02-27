import { defaultTheme, FullTheme, ModeType } from '@/context'

export const isLightTheme = (theme?: FullTheme) => {
  return (theme ?? defaultTheme).includes(ModeType.Light)
}
