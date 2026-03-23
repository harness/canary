import { FC } from 'react'

import { Button, IconV2 } from '@harnessio/ui/components'
import { useTheme, type FullTheme } from '@harnessio/ui/context'

const LIGHT_THEME = 'light-std-std' as FullTheme
const DARK_THEME = 'dark-std-std' as FullTheme

export const Header: FC = () => {
  const { theme, setTheme } = useTheme()
  const isLight = theme === LIGHT_THEME

  return (
    <header className="border-cn-2 bg-cn-0 shrink-0 border-b">
      <div className="p-cn-sm flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          ignoreIconOnlyTooltip
          type="button"
          onClick={() => setTheme(isLight ? DARK_THEME : LIGHT_THEME)}
        >
          <IconV2 name={isLight ? 'half-moon' : 'sun-light'} size="sm" />
        </Button>
      </div>
    </header>
  )
}
