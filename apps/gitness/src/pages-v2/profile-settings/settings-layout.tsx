import { Outlet } from 'react-router-dom'

import { SettingsAccountPage } from '@harnessio/ui/views'

import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs'

export const SettingsLayout = () => {
  return (
    <>
      <div className="bg-background-1 sticky top-0 z-40">
        <Breadcrumbs />
        <SettingsAccountPage />
      </div>
      <Outlet />
    </>
  )
}
