import { Outlet, useNavigate, useParams } from 'react-router-dom'

import { useFindRepositoryQuery } from '@harnessio/code-service-client'
import { RepoSubheader } from '@harnessio/ui/components'
import { RepoHeader, SubHeaderWrapper } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useIsMFE } from '../../framework/hooks/useIsMFE'
import useCodePathDetails from '../../hooks/useCodePathDetails'
import { PathParams } from '../../RouteDefinitions'
import { isRefATag } from '../../utils/git-utils'

const RepoLayout = () => {
  const isMFE = useIsMFE()
  const navigate = useNavigate()
  const routes = useRoutes()
  const { fullGitRef, gitRefName } = useCodePathDetails()
  const { spaceId, repoId } = useParams<PathParams>()
  const repoRef = useGetRepoRef()

  const { data: { body: repoData } = {}, isLoading: isLoadingRepoData } = useFindRepositoryQuery({ repo_ref: repoRef })

  const effectiveGitRef = fullGitRef || repoData?.default_branch || ''
  const effectiveGitRefName = gitRefName || repoData?.default_branch || ''

  return (
    <>
      <RepoHeader name={repoData?.identifier ?? ''} isPublic={!!repoData?.is_public} isLoading={isLoadingRepoData} />
      <SubHeaderWrapper>
        <RepoSubheader
          showPipelinesTab={!isMFE}
          onTabClick={(tab: 'summary' | 'code' | 'commits') => {
            if (tab === 'code') {
              navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${effectiveGitRef}`)
            } else if (tab === 'summary') {
              navigate(`${routes.toRepoSummary({ spaceId, repoId })}/${effectiveGitRef}`)
            } else if (tab === 'commits') {
              isRefATag(effectiveGitRef)
                ? navigate(routes.toRepoTagCommits({ spaceId, repoId, tagId: effectiveGitRefName }))
                : navigate(routes.toRepoBranchCommits({ spaceId, repoId, branchId: effectiveGitRefName }))
            }
          }}
        />
      </SubHeaderWrapper>
      <Outlet />
    </>
  )
}

export default RepoLayout
