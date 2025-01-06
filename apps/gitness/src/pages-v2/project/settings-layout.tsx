import { Outlet } from 'react-router-dom'

import { ProjectSettingsPage } from '@harnessio/ui/views'

export const SettingsLayout = () => {
  return (
    <>
      <div className="sticky top-breadcrumbs z-40 bg-background-1">
        <ProjectSettingsPage />
      </div>
      <Outlet />
    </>
  )
}
