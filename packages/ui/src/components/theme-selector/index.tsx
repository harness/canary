// ToDo: Need to be reviewed by the XD team

import { useMemo } from 'react'

import { ColorSelect } from './color-select'
import { ContrastSelect } from './contrast-select'
import { ModeSelect } from './mode-select'
import { FullTheme } from './types'
import { getModeColorContrastFromFullTheme } from './utils'

function ThemeSelector({
  useTheme
}: {
  useTheme: () => {
    theme: FullTheme
    setTheme: (theme: FullTheme) => void
  }
}) {
  // theme will be structured like light-std-std which represents mode-color-contrast
  const { theme, setTheme } = useTheme()
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
