import { Outlet } from 'react-router-dom'

import { ProjectSettingsTabNav } from '@harnessio/ui/views'

import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

export const ProjectSettingsLayout = () => {
  const isMFE = useIsMFE()

  return (
    <>
      <div className="sticky top-[55px] z-40 bg-background-1">
        <ProjectSettingsTabNav useTranslationStore={useTranslationStore} isMFE={isMFE} />
      </div>
      <Outlet />
    </>
  )
}
