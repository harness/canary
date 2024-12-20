import { Outlet, useLocation } from 'react-router-dom'

import { ProfileSettingsTabNav } from '@harnessio/ui/views'

import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

export const SettingsLayout = () => {
  const location = useLocation()
  const activeTab = location.pathname.split('/').pop() || 'general'

  return (
    <>
      <div className="sticky top-0 z-40 bg-background-1">
        <Breadcrumbs />
        <ProfileSettingsTabNav activeTab={activeTab} useTranslationStore={useTranslationStore} />
      </div>
      <Outlet />
    </>
  )
}
