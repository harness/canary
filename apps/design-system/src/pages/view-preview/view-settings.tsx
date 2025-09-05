import { FC, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { getTheme, Themes } from '@utils/theme-utils'
import { clsx } from 'clsx'

import { Button, IconV2, Select, SelectGroupOption, SelectValueOption, Spacer } from '@harnessio/ui/components'

import { viewPreviews } from './view-preview'
import css from './view-settings.module.css'

const themeOptions: SelectValueOption<Themes>[] = Object.values(Themes).map(theme => ({ label: theme, value: theme }))

export interface ViewSettingsProps {
  routes: string[]
}

const ViewSettings: FC<ViewSettingsProps> = ({ routes }) => {
  const [showSettings, setShowSettings] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Themes>(getTheme())

  const viewOptions: SelectGroupOption[] = Object.entries(viewPreviews).map(([_, group]) => ({
    label: group.label,
    options: Object.entries(group.items).map(([path, { label }]) => ({ label, value: path }))
  }))

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
        tooltipProps={{
          content: showSettings ? 'Hide view settings' : 'Show view settings'
        }}
      >
        <IconV2 name={showSettings ? 'xmark' : 'settings'} />
      </Button>

      {showSettings && (
        <>
          <Select<string>
            allowSearch
            options={viewOptions}
            label="View"
            placeholder="Select view"
            value={currentView}
            onChange={navigate}
          />

          <Spacer size={5} />

          <Select<Themes>
            options={themeOptions}
            placeholder="Select theme"
            label="Theme"
            value={currentTheme}
            onChange={onValueChange}
          />
        </>
      )}
    </aside>
  )
}

export default ViewSettings
