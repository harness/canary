import { Outlet } from 'react-router-dom'

import { ProjectSettingsPage } from '@harnessio/ui/views'

export const SettingsLayout = () => {
  return (
    <>
      <div className="bg-background-1 sticky top-[55px] z-40">
        <ProjectSettingsPage />
      </div>
      <Outlet />
    </>
  )
}
