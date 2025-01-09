import { Outlet, useLocation } from 'react-router-dom'

import { ProfileSettingsTabNav } from '@harnessio/ui/views'

import { useTranslationStore } from '../../i18n/stores/i18n-store'

export const SettingsLayout = () => {
  const location = useLocation()
  const activeTab = location.pathname.split('/').pop() || 'general'

  return (
    <>
      <div className="top-[55px] sticky z-40 bg-background-1">
        <ProfileSettingsTabNav activeTab={activeTab} useTranslationStore={useTranslationStore} />
      </div>
      <Outlet />
    </>
  )
}
