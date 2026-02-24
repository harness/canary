import { Outlet, useMatches, useParams } from 'react-router-dom'

import { createFavorite, deleteFavorite, EnumResourceType } from '@harnessio/code-service-client'
import { RepoSubheader } from '@harnessio/ui/components'
import { RepoHeader, SubHeaderWrapper } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { CustomHandle } from '../../framework/routing/types'
import { useGitRef } from '../../hooks/useGitRef'
import { useRepoCommits } from '../../hooks/useRepoCommits'
import { useUpstreamRepoUrl } from '../../hooks/useUpstreamRepoUrl'
import { PathParams } from '../../RouteDefinitions'

const RepoLayout = () => {
  const isMFE = useIsMFE()
  const routes = useRoutes()
  const { spaceId, repoId } = useParams<PathParams>()
  const { toRepoCommits } = useRepoCommits()
  const { isLoading, gitRefName, gitRefPath, repoData, fullGitRef, refetchRepo, defaultBranch } = useGitRef()
  const toUpstreamRepo = useUpstreamRepoUrl()

  const onFavoriteToggle = async (isFavorite: boolean) => {
    try {
      const body: { resource_id: number; resource_type: EnumResourceType } = {
        resource_id: Number(repoData?.id),
        resource_type: 'REPOSITORY'
      }
      if (isFavorite) {
        await createFavorite({ body })
      } else {
        await deleteFavorite({ queryParams: { resource_type: 'REPOSITORY' }, resource_id: Number(repoData?.id) })
      }
      refetchRepo()
    } catch {
      // TODO: Add error handling
    }
  }

  // Removing gitRef from summary, files and commits path when navigating from compare page
  const matches = useMatches()
  const isComparePage = matches.some(match => match.pathname.includes('/pulls/compare/'))
  const shouldHideLayout = matches.some(match => (match.handle as CustomHandle)?.hideLayout ?? false)

  const summaryPathRef = isComparePage ? defaultBranch : gitRefPath
  const filesPathRef = isComparePage ? defaultBranch : gitRefPath
  const commitsPathRef = isComparePage ? defaultBranch : gitRefName

  return (
    <>
      {!shouldHideLayout && (
        <>
          <RepoHeader
            name={repoData?.identifier ?? ''}
            isPublic={!!repoData?.is_public}
            isArchived={repoData?.archived}
            isLoading={isLoading}
            isFavorite={repoData?.is_favorite}
            onFavoriteToggle={onFavoriteToggle}
            archivedDate={repoData?.updated}
            upstream={repoData?.upstream}
            toUpstreamRepo={toUpstreamRepo}
          />

          <SubHeaderWrapper>
            <RepoSubheader
              showPipelinesTab={!isMFE}
              showSearchTab={isMFE}
              summaryPath={routes.toRepoSummary({ spaceId, repoId, '*': summaryPathRef })}
              filesPath={routes.toRepoFiles({ spaceId, repoId, '*': filesPathRef })}
              commitsPath={toRepoCommits({ spaceId, repoId, fullGitRef, gitRefName: commitsPathRef })}
              isRepoEmpty={!!repoData?.is_empty}
            />
          </SubHeaderWrapper>
        </>
      )}

      <Outlet />
    </>
  )
}

export default RepoLayout
