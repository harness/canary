import { useEffect, useState } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'

import { useFindRepositoryQuery } from '@harnessio/code-service-client'
import { RepoSubheader } from '@harnessio/ui/components'
import { RepoHeader, SubHeaderWrapper } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useIsMFE } from '../../framework/hooks/useIsMFE'
import useCodePathDetails from '../../hooks/useCodePathDetails'
import { PathParams } from '../../RouteDefinitions'
import { isRefATag, REFS_BRANCH_PREFIX } from '../../utils/git-utils'

const RepoLayout = () => {
  const isMFE = useIsMFE()
  const routes = useRoutes()
  const { fullGitRef, gitRefName, isCommitSHA } = useCodePathDetails()
  const { spaceId, repoId } = useParams<PathParams>()
  const repoRef = useGetRepoRef()
  const location = useLocation()

  const { data: { body: repoData } = {}, isLoading: isLoadingRepoData } = useFindRepositoryQuery({ repo_ref: repoRef })

  const defaultPrefixedBranch = repoData?.default_branch ? `${REFS_BRANCH_PREFIX}${repoData?.default_branch}` : ''
  const effectiveGitRef = fullGitRef || defaultPrefixedBranch || ''
  const effectiveGitRefName = gitRefName || repoData?.default_branch || ''

  const getCommitsPath = () => {
    if (isCommitSHA) {
      return routes
        .toRepoCommitDetails({
          spaceId,
          repoId,
          commitSHA: effectiveGitRefName
        })
        .toLowerCase()
    } else if (isRefATag(effectiveGitRef)) {
      return routes
        .toRepoTagCommits({
          spaceId,
          repoId,
          tagId: encodeURIComponent(effectiveGitRefName)
        })
        .toLowerCase()
    } else {
      return routes
        .toRepoBranchCommits({
          spaceId,
          repoId,
          branchId: encodeURIComponent(effectiveGitRefName)
        })
        .toLowerCase()
    }
  }

  const getSummaryPath = () => {
    return `${routes.toRepoSummary({ spaceId, repoId })}${effectiveGitRef && effectiveGitRefName ? `/${isCommitSHA ? effectiveGitRefName : effectiveGitRef}` : ''}`.toLowerCase()
  }

  const getFilesPath = () => {
    return `${routes.toRepoFiles({ spaceId, repoId })}${effectiveGitRef && effectiveGitRefName ? `/${isCommitSHA ? effectiveGitRefName : effectiveGitRef}` : ''}`.toLowerCase()
  }

  const [summaryPath, setSummaryPath] = useState(getSummaryPath())
  const [filesPath, setFilesPath] = useState(getFilesPath())
  const [commitsPath, setCommitsPath] = useState(getCommitsPath())

  useEffect(() => {
    setSummaryPath(getSummaryPath())
    setFilesPath(getFilesPath())
    setCommitsPath(getCommitsPath())
  }, [location])

  return (
    <>
      <RepoHeader name={repoData?.identifier ?? ''} isPublic={!!repoData?.is_public} isLoading={isLoadingRepoData} />
      <SubHeaderWrapper>
        <RepoSubheader
          showPipelinesTab={!isMFE}
          summaryPath={summaryPath}
          filesPath={filesPath}
          commitsPath={commitsPath}
        />
      </SubHeaderWrapper>
      <Outlet />
    </>
  )
}

export default RepoLayout
