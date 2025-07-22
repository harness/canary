import { Outlet, useParams } from 'react-router-dom'

import { RepoSubheader } from '@harnessio/ui/components'
import { RepoHeader, SubHeaderWrapper } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { useGitRef } from '../../hooks/useGitRef'
import { useRepoCommits } from '../../hooks/useRepoCommits'
import { PathParams } from '../../RouteDefinitions'
import { useFavoriteRepository } from './hooks/useRepoMutation'

const RepoLayout = () => {
  const isMFE = useIsMFE()
  const routes = useRoutes()
  const { spaceId, repoId } = useParams<PathParams>()
  const { toRepoCommits } = useRepoCommits()
  const { isLoading, gitRefName, gitRefPath, repoData, fullGitRef } = useGitRef()

  const { createFavorite, deleteFavorite } = useFavoriteRepository({
    onSuccess: () => {
      if (repoData) {
        repoData.is_favorite = true
      }
    },
    onMutate: () => {
      if (repoData) {
        repoData.is_favorite = false
      }
    }
  })

  const onFavoriteToggle = (isFavorite: boolean) => {
    const mutation = isFavorite ? createFavorite : deleteFavorite
    if (!repoData?.id) return
    mutation({ resource_id: repoData.id })
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
        />
      </SubHeaderWrapper>
      <Outlet />
    </>
  )
}

export default RepoLayout
