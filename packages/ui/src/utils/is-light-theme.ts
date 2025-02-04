import { FullTheme, ModeType } from '@/components'
import { defaultTheme } from '@/providers/theme'

export const isLightTheme = (theme?: FullTheme) => {
  return (theme ?? defaultTheme).includes(ModeType.Light)
}
