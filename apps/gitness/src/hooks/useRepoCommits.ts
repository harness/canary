import { useRoutes } from '../framework/context/NavigationContext'
import { isRefABranch, isRefACommitSHA, isRefATag } from '../utils/git-utils'

export function useRepoCommits() {
  const routes = useRoutes()

  const toRepoCommits = ({
    spaceId,
    repoId,
    fullGitRef,
    gitRefName
  }: {
    spaceId?: string
    repoId?: string
    fullGitRef: string
    gitRefName: string
  }) => {
    if (isRefATag(fullGitRef)) {
      return routes.toRepoTagCommits({ spaceId, repoId, tagId: encodeURIComponent(gitRefName) })
    } else if (isRefABranch(fullGitRef)) {
      return routes.toRepoBranchCommits({ spaceId, repoId, branchId: encodeURIComponent(gitRefName) })
    } else if (isRefACommitSHA(fullGitRef)) {
      return routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: fullGitRef })
    } else {
      return routes.toRepoCommits({ spaceId, repoId })
    }
  }

  return { toRepoCommits }
}
