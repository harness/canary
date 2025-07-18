import { Outlet, useParams } from 'react-router-dom'

import { RepoHeader, RepoSubheader, SubHeaderWrapper } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { useGitRef } from '../../hooks/useGitRef'
import { useRepoCommits } from '../../hooks/useRepoCommits'
import { PathParams } from '../../RouteDefinitions'

const RepoLayout = () => {
  const isMFE = useIsMFE()
  const routes = useRoutes()
  const { spaceId, repoId } = useParams<PathParams>()
  const { toRepoCommits } = useRepoCommits()
  const { isLoading, gitRefName, gitRefPath, repoData, fullGitRef } = useGitRef()

  return (
    <>
      <RepoHeader name={repoData?.identifier ?? ''} isPublic={!!repoData?.is_public} isLoading={isLoading} />
      <SubHeaderWrapper>
        <RepoSubheader
          showPipelinesTab={!isMFE}
          showSearchTab={isMFE}
          summaryPath={routes.toRepoSummary({ spaceId, repoId, '*': gitRefPath })}
          filesPath={routes.toRepoFiles({ spaceId, repoId, '*': gitRefPath })}
          commitsPath={toRepoCommits({ spaceId, repoId, fullGitRef, gitRefName })}
        />
      </SubHeaderWrapper>
      <Outlet />
    </>
  )
}

export default RepoLayout
