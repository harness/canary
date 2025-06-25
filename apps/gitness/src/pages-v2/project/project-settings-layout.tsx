import { Outlet } from 'react-router-dom'

import { ProjectSettingsTabNav, SubHeaderWrapper } from '@harnessio/ui/views'

import { useIsMFE } from '../../framework/hooks/useIsMFE'

export const ProjectSettingsLayout = () => {
  const isMFE = useIsMFE()

  return (
    <>
      <SubHeaderWrapper>
        <ProjectSettingsTabNav isMFE={isMFE} />
      </SubHeaderWrapper>
      <Outlet />
    </>
  )
}
