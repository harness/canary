import { Outlet } from 'react-router-dom'

import { ProjectSettingsTabNav } from '@harnessio/ui/views'

import { useTranslationStore } from '../../i18n/stores/i18n-store'

export const ProjectSettingsLayout = () => {
  return (
    <>
      <div className="bg-background-1 sticky top-[55px] z-40">
        <ProjectSettingsTabNav useTranslationStore={useTranslationStore} />
      </div>
      <Outlet />
    </>
  )
}
