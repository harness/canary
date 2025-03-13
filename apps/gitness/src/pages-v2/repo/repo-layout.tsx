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
            toSummary: ({ spaceId, repoId }) => routes.toRepoSummary({ spaceId, repoId }),
            toBranches: ({ spaceId, repoId }) => routes.toRepoBranches({ spaceId, repoId }),
            toCode: ({ spaceId, repoId }) => routes.toRepoFiles({ spaceId, repoId }),
            toCommits: ({ spaceId, repoId }) => routes.toRepoCommits({ spaceId, repoId }),
            toPullRequests: ({ spaceId, repoId }) => routes.toPullRequests({ spaceId, repoId }),
            toPipelines: ({ spaceId, repoId }) => routes.toRepoPipelines({ spaceId, repoId }),
            toSettings: ({ spaceId, repoId }) => routes.toRepoGeneralSettings({ spaceId, repoId }),
            toTags: ({ spaceId, repoId }) => routes.toRepoTags({ spaceId, repoId })
          }}
        />
      </div>
      {/* Render Outlet for v6, or children for v5 */}
      {children ? children : <Outlet />}
    </>
  )
}

export default RepoLayout
