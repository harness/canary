import { Outlet, useParams } from 'react-router-dom'

import { createFavorite, deleteFavorite, EnumResourceType } from '@harnessio/code-service-client'
import { RepoSubheader } from '@harnessio/ui/components'
import { RepoHeader, SubHeaderWrapper } from '@harnessio/ui/views'

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
  const { isLoading, gitRefName, gitRefPath, repoData, fullGitRef, refetchRepo } = useGitRef()

  const onFavoriteToggle = async (isFavorite: boolean) => {
    try {
      const body: { resource_id: number | undefined; resource_type: EnumResourceType } = {
        resource_id: repoData?.id,
        resource_type: 'REPOSITORY'
      }
      if (isFavorite) {
        await createFavorite({ body })
      } else {
        await deleteFavorite({ body })
      }
      refetchRepo()
    } catch {
      // TODO: Add error handling
    }
  }

  return (
    <>
      <RepoHeader
        name={repoData?.identifier ?? ''}
        isPublic={!!repoData?.is_public}
        isLoading={isLoading}
        isFavorite={repoData?.is_favorite}
        onFavoriteToggle={onFavoriteToggle}
      />
      <SubHeaderWrapper>
        <RepoSubheader
          showPipelinesTab={!isMFE}
          showSearchTab={isMFE}
          summaryPath={routes.toRepoSummary({ spaceId, repoId, '*': gitRefPath })}
          filesPath={routes.toRepoFiles({ spaceId, repoId, '*': gitRefPath })}
          commitsPath={toRepoCommits({ spaceId, repoId, fullGitRef, gitRefName })}
          isRepoEmpty={!!repoData?.is_empty}
        />
      </SubHeaderWrapper>
      <Outlet />
    </>
  )
}

export default RepoLayout
