import { Outlet } from 'react-router-dom'

import { RepoSubheader } from '@harnessio/ui/components'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

const RepoLayout = ({ children }: { children?: React.ReactNode }) => {
  const isMFE = useIsMFE()
  const routes = useRoutes()

  return (
    <>
      <div className="layer-high sticky top-[55px] bg-background-1">
        <RepoSubheader
          showPipelinesTab={!isMFE}
          useTranslationStore={useTranslationStore}
          tabRoutes={{
            toSummary: routes.toRepoSummary,
            toBranches: routes.toRepoBranches,
            toCode: routes.toRepoFiles,
            toCommits: routes.toRepoCommits,
            toPullRequests: routes.toPullRequests,
            toPipelines: routes.toRepoPipelines,
            toSettings: routes.toRepoGeneralSettings,
            toTags: routes.toRepoTags
          }}
        />
      </div>
      {/* Render Outlet for v6, or children for v5 */}
      {children ? children : <Outlet />}
    </>
  )
}

export default RepoLayout
