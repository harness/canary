import { Outlet } from 'react-router-dom'

import { ProjectSettingsPage } from '@harnessio/ui/views'

import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs'

export const SettingsLayout = () => {
  return (
    <>
      <div className="sticky top-0 z-40 bg-background-1">
        <Breadcrumbs />
        <ProjectSettingsPage />
      </div>
      <Outlet />
    </>
  )
}
