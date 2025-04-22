import { FC, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { getTheme, Themes } from '@utils/theme-utils'
import { clsx } from 'clsx'

import { Button, Icon, Select, Spacer } from '@harnessio/ui/components'

import { viewPreviews } from './view-preview'
import css from './view-settings.module.css'

export interface ViewSettingsProps {
  routes: string[]
}

const ViewSettings: FC<ViewSettingsProps> = ({ routes }) => {
  const [showSettings, setShowSettings] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Themes>(getTheme())

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

  const onValueChange = (newTheme: Themes) => {
    setCurrentTheme(newTheme)
  }

  return (
    <aside className={clsx(css.viewSettings, 'shadow-4')} data-show={showSettings ? 'show' : 'hide'}>
      <Button
        variant="link"
        size="sm"
        iconOnly
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
                  <div className="text-cn-foreground-3 px-2 py-1.5 text-sm font-medium">{group.label}</div>
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
          <Select.Root placeholder="Select theme" label="Theme" value={currentTheme} onValueChange={onValueChange}>
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
