import { Outlet, useNavigate, useParams } from 'react-router-dom'

import { useFindRepositoryQuery } from '@harnessio/code-service-client'
import { RepoSubheader, RepoTabsKeys } from '@harnessio/ui/components'
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

  const prefixedGitRef = fullGitRef || repoData?.default_branch || ''
  const effectiveGitRefName = gitRefName || repoData?.default_branch || ''

  return (
    <>
      <RepoHeader name={repoData?.identifier ?? ''} isPublic={!!repoData?.is_public} isLoading={isLoadingRepoData} />
      <SubHeaderWrapper>
        <RepoSubheader
          showPipelinesTab={!isMFE}
          onTabClick={(tab: RepoTabsKeys) => {
            if (tab === RepoTabsKeys.CODE) {
              navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${prefixedGitRef}`)
            } else if (tab === RepoTabsKeys.SUMMARY) {
              navigate(`${routes.toRepoSummary({ spaceId, repoId })}/${prefixedGitRef}`)
            } else if (tab === RepoTabsKeys.COMMITS) {
              isRefATag(prefixedGitRef)
                ? navigate(routes.toRepoTagCommits({ spaceId, repoId, tagId: encodeURIComponent(effectiveGitRefName) }))
                : navigate(
                    routes.toRepoBranchCommits({ spaceId, repoId, branchId: encodeURIComponent(effectiveGitRefName) })
                  )
            }
          }}
        />
      </SubHeaderWrapper>
      <Outlet />
    </>
  )
}

export default RepoLayout
