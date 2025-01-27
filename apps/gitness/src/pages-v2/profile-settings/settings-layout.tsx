import { Outlet, useLocation } from 'react-router-dom'

import { ProfileSettingsTabNav } from '@harnessio/ui/views'

import { useTranslationStore } from '../../i18n/stores/i18n-store'

export const ProfileSettingsLayout = () => {
  const location = useLocation()
  const activeTab = location.pathname.split('/').pop() || 'general'

  return (
    <>
      <div className="bg-background-1 sticky top-[55px] z-40">
        <ProfileSettingsTabNav activeTab={activeTab} useTranslationStore={useTranslationStore} />
      </div>
      <Outlet />
    </>
  )
}
