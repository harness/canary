import { Outlet } from 'react-router-dom'

import { ProjectSettingsTabNav, SubHeaderWrapper } from '@harnessio/ui/views'

import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

export const ProjectSettingsLayout = () => {
  const isMFE = useIsMFE()

  return (
    <>
      <SubHeaderWrapper>
        <ProjectSettingsTabNav useTranslationStore={useTranslationStore} isMFE={isMFE} />
      </SubHeaderWrapper>
      <Outlet />
    </>
  )
}
