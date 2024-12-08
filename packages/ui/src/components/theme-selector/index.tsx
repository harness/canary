// ToDo: Need to be reviewed by the XD team

import { useMemo } from 'react'

import { ColorSelect } from './color-select'
import { ContrastSelect } from './contrast-select'
import { ModeSelect } from './mode-select'
import { IThemeStore } from './types'
import { getModeColorContrastFromFullTheme } from './utils'

interface ThemeSelectorProps {
  useThemeStore: () => IThemeStore
}
function ThemeSelector({ useThemeStore }: ThemeSelectorProps) {
  // theme will be structured like dark-std-std which represents mode-color-contrast
  const { theme, setTheme } = useThemeStore()
  const { mode, color, contrast } = useMemo(() => getModeColorContrastFromFullTheme(theme), [theme])

  return (
    <div className="flex w-full items-center space-x-5">
      <ModeSelect setTheme={setTheme} mode={mode} color={color} contrast={contrast} />
      <ColorSelect setTheme={setTheme} mode={mode} color={color} contrast={contrast} />
      <ContrastSelect setTheme={setTheme} mode={mode} color={color} contrast={contrast} />
    </div>
  )
}

export { ThemeSelector }
