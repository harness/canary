import { FC, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { clsx } from 'clsx'

import { Button, Icon, Select, SelectContent, SelectItem, Spacer } from '@harnessio/ui/components'

import css from './view-settings.module.css'

export interface ViewSettingsProps {
  routes: string[]
}

enum Themes {
  DARK_STANDARD_LOW = 'dark-std-low',
  DARK = 'dark-std-std',
  DARK_PROT_STD = 'dark-prot-std',
  DARK_STANDARD_HIGH = 'dark-std-high',
  LIGHT = 'light-std-std',
  LIGHT_PROTO_STD = 'light-prot-std'
}

const ViewSettings: FC<ViewSettingsProps> = ({ routes }) => {
  const [showSettings, setShowSettings] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Themes>(() => {
    const storedTheme = sessionStorage.getItem('view-preview-theme') as Themes

    if (storedTheme && Object.values(Themes).includes(storedTheme)) {
      return storedTheme
    }

    return Themes.DARK
  })

  useEffect(() => {
    const bodyClass = document.body.classList

    for (const theme of Object.values(Themes)) {
      bodyClass.remove(theme)
    }

    bodyClass.add(currentTheme)
    sessionStorage.setItem('view-preview-theme', currentTheme)
  }, [currentTheme])

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const currentView = useMemo<string>(
    () => pathname.match(/view-preview\/([^/]+)/)?.[1] || routes[0],
    [pathname, routes]
  )

  return (
    <aside className={clsx(css.viewSettings, 'shadow-1')} data-show={showSettings ? 'show' : 'hide'}>
      <Button
        variant="link_accent"
        size="icon"
        onClick={() => setShowSettings(current => !current)}
        className={css.showHideButton}
        title={showSettings ? 'Hide view settings' : 'Show view settings'}
      >
        <Icon name={showSettings ? 'close' : 'settings-1'} />
      </Button>

      {showSettings && (
        <>
          <Select placeholder="Select view" label="View" value={currentView} onValueChange={navigate}>
            <SelectContent>
              {routes.map(route => (
                <SelectItem key={route} value={route}>
                  {route}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Spacer size={5} />
          <Select
            placeholder="Select theme"
            label="Theme"
            value={currentTheme}
            onValueChange={(newTheme: Themes) => setCurrentTheme(newTheme)}
          >
            <SelectContent>
              {Object.values(Themes).map(theme => (
                <SelectItem key={theme} value={theme}>
                  {theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
    </aside>
  )
}

export default ViewSettings
