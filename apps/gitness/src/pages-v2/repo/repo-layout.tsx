import { Outlet } from 'react-router-dom'

import { RepoSubheader } from '@harnessio/ui/components'
import { SubHeaderWrapper } from '@harnessio/ui/views'

import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

const RepoLayout = () => {
  const isMFE = useIsMFE()

  return (
    <>
      <SubHeaderWrapper>
        <RepoSubheader showPipelinesTab={!isMFE} useTranslationStore={useTranslationStore} />
      </SubHeaderWrapper>
      <Outlet />
    </>
  )
}

export default RepoLayout
