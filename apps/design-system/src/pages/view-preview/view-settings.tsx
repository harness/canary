import { FC, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { clsx } from 'clsx'

import { Button, Icon, Select, Spacer } from '@harnessio/ui/components'

import { viewPreviews } from './view-preview'
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
  LIGHT_PROT_STD = 'light-prot-std'
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
          <Select.Root placeholder="Select view" label="View" value={currentView} onValueChange={navigate}>
            <Select.Content>
              {Object.entries(viewPreviews).map(([groupKey, group]) => (
                <Select.Group key={groupKey} title={group.label} className="pt-2 first:pt-0">
                  <div className="text-foreground-3 px-2 py-1.5 text-sm font-medium">{group.label}</div>
                  {Object.entries(group.items).map(([path, { label }]) => (
                    <Select.Item key={path} value={path}>
                      {label}
                    </Select.Item>
                  ))}
                </Select.Group>
              ))}
            </Select.Content>
          </Select.Root>
          <Spacer size={5} />
          <Select.Root
            placeholder="Select theme"
            label="Theme"
            value={currentTheme}
            onValueChange={(newTheme: Themes) => setCurrentTheme(newTheme)}
          >
            <Select.Content>
              {Object.values(Themes).map(theme => (
                <Select.Item key={theme} value={theme}>
                  {theme}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </>
      )}
    </aside>
  )
}

export default ViewSettings
