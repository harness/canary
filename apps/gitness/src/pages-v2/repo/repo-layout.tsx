import { Outlet } from 'react-router-dom'

import { RepoSubheader } from '@harnessio/ui/components'

import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

const RepoLayout = ({ children }: { children?: React.ReactNode }) => {
  const isMFE = useIsMFE()

  return (
    <>
      <div className="layer-high sticky top-[55px] bg-background-1">
        <RepoSubheader showPipelinesTab={!isMFE} useTranslationStore={useTranslationStore} />
      </div>
      {/* Render Outlet for v6, or children for v5 */}
      {children ? children : <Outlet />}
    </>
  )
}

export default RepoLayout
