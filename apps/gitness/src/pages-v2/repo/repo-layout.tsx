import { useEffect, useState } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'

import { RepoSubheader } from '@harnessio/ui/components'
import { RepoHeader, SubHeaderWrapper } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { useGitRef } from '../../hooks/useGitRef'
import { useTabPath } from '../../hooks/useTabPath'
import { PathParams } from '../../RouteDefinitions'
import { isRefATag } from '../../utils/git-utils'

const RepoLayout = () => {
  const isMFE = useIsMFE()
  const routes = useRoutes()
  const { spaceId, repoId } = useParams<PathParams>()
  const location = useLocation()
  const [currentPath, setCurrentPath] = useState(location.pathname)
  const setPath = (path: string, setTabPath: (path: string) => void) => {
    setCurrentPath(path)
    setTabPath(path)
  }
  const { isLoading, fullGitRef, gitRefName, gitRefPath, isCommitSHA, repository } = useGitRef()

  // Base paths
  const baseSummaryPath = routes.toRepoSummary({ spaceId, repoId })
  const baseFilesPath = routes.toRepoFiles({ spaceId, repoId })
  const baseCommitsPath = routes.toRepoCommits({ spaceId, repoId })
  const basePipelinesPath = routes.toRepoPipelines({ spaceId, repoId })
  const baseTagsPath = routes.toRepoTags({ spaceId, repoId })
  const basePullsPath = routes.toPullRequests({ spaceId, repoId })
  const baseBranchesPath = routes.toRepoBranches({ spaceId, repoId })
  const baseSettingsPath = routes.toRepoGeneralSettings({ spaceId, repoId })

  // GitRef paths
  const getSummaryGitPath = () => `${baseSummaryPath}${gitRefPath}`
  const getFilesGitPath = () => `${baseFilesPath}${gitRefPath}`
  const getCommitsGitPath = () => {
    if (isCommitSHA) {
      return routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: gitRefName })
    } else if (isRefATag(fullGitRef)) {
      return routes.toRepoTagCommits({ spaceId, repoId, tagId: encodeURIComponent(gitRefName) })
    } else {
      return routes.toRepoBranchCommits({ spaceId, repoId, branchId: encodeURIComponent(gitRefName) })
    }
  }

  // Tab path states
  const [summaryPath, setSummaryPath, matchSummary, summaryGitPath] = useTabPath(baseSummaryPath, getSummaryGitPath)
  const [filesPath, setFilesPath, matchFiles, filesGitPath] = useTabPath(baseFilesPath, getFilesGitPath)
  const [commitsPath, setCommitsPath, matchCommits, commitsGitPath] = useTabPath(baseCommitsPath, getCommitsGitPath)
  const [pipelinesPath, setPipelinesPath, matchPipelines] = useTabPath(basePipelinesPath)
  const [tagsPath, setTagsPath, matchTags] = useTabPath(baseTagsPath)
  const [pullsPath, setPullsPath, matchPulls] = useTabPath(basePullsPath)
  const [branchesPath, setBranchesPath, matchBranches] = useTabPath(baseBranchesPath)
  const [settingsPath, setSettingsPath, matchSettings] = useTabPath(baseSettingsPath)

  const resetTabPathsWithoutGitRef = () => {
    !matchPipelines ? setPipelinesPath(basePipelinesPath) : null
    !matchTags ? setTagsPath(baseTagsPath) : null
    !matchPulls ? setPullsPath(basePullsPath) : null
    !matchBranches ? setBranchesPath(baseBranchesPath) : null
    !matchSettings ? setSettingsPath(baseSettingsPath) : null
  }

  // Update tab paths and controlled tab value when location changes
  useEffect(() => {
    // Paths with GitRef
    // Set all available paths with gitRef inside the match condition
    // This ensures proper gitRef context is maintained even when switching from tabs without gitRef
    if (matchSummary) {
      setPath(matchSummary.pathname, setSummaryPath)
      setFilesPath(filesGitPath)
      setCommitsPath(commitsGitPath)
    }
    if (matchFiles) {
      setPath(matchFiles.pathname, setFilesPath)
      setSummaryPath(summaryGitPath)
      setCommitsPath(commitsGitPath)
    }
    if (matchCommits) {
      setPath(matchCommits.pathname, setCommitsPath)
      setSummaryPath(summaryGitPath)
      setFilesPath(filesGitPath)
    }

    // Paths without GitRef
    if (matchPipelines) setPath(matchPipelines.pathname, setPipelinesPath)
    if (matchTags) setPath(matchTags.pathname, setTagsPath)
    if (matchPulls) setPath(matchPulls.pathname, setPullsPath)
    if (matchBranches) setPath(matchBranches.pathname, setBranchesPath)
    if (matchSettings) setPath(matchSettings.pathname, setSettingsPath)
    resetTabPathsWithoutGitRef() // If not reset, the last visited subPath of tabs will be used
  }, [location.pathname])

  return (
    <>
      <RepoHeader name={repository?.identifier ?? ''} isPublic={!!repository?.is_public} isLoading={isLoading} />
      <SubHeaderWrapper>
        <RepoSubheader
          showPipelinesTab={!isMFE}
          summaryPath={summaryPath}
          filesPath={filesPath}
          pipelinesPath={pipelinesPath}
          commitsPath={commitsPath}
          tagsPath={tagsPath}
          pullsPath={pullsPath}
          branchesPath={branchesPath}
          settingsPath={settingsPath}
          currentPath={currentPath}
        />
      </SubHeaderWrapper>
      <Outlet />
    </>
  )
}

export default RepoLayout
