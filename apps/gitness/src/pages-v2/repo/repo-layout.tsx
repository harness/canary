import { Outlet } from 'react-router-dom'

import { RepoSubheader } from '@harnessio/ui/components'

import { useIsMFE } from '../../framework/hooks/useIsMFE'
// import { useRepoImportEvents } from '../../framework/hooks/useRepoImportEvent'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

const RepoLayout = () => {
  const isMFE = useIsMFE()

  // useRepoImportEvents()

  return (
    <>
      <div className="layer-high sticky top-[55px] bg-background-1">
        <RepoSubheader showPipelinesTab={!isMFE} useTranslationStore={useTranslationStore} />
      </div>
      {/* <Toaster /> */}
      <Outlet />
    </>
  )
}

export default RepoLayout
