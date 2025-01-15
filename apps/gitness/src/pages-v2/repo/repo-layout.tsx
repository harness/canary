import { Outlet } from 'react-router-dom'

import { RepoSubheader } from '@harnessio/ui/components'

import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

const RepoLayout = () => {
  const isMFE = useIsMFE()

  return (
    <>
      <div className="top-[55px] layer-high bg-background-1 sticky">
        <RepoSubheader showPipelinesTab={!isMFE} useTranslationStore={useTranslationStore} />
      </div>
      <Outlet />
    </>
  )
}

export default RepoLayout
