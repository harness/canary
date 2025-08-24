import { useRoutes } from '../framework/context/NavigationContext'
import { isRefACommitSHA, isRefATag, REFS_TAGS_PREFIX } from '../utils/git-utils'

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
    const spaceSegment = spaceId ? `/${spaceId}` : ''

    if (isRefATag(fullGitRef)) {
      return `${spaceSegment}/repos/${repoId}/commits/${REFS_TAGS_PREFIX}${gitRefName}`
    } else if (isRefACommitSHA(fullGitRef)) {
      return routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: fullGitRef })
    }

    return `${spaceSegment}/repos/${repoId}/commits/${gitRefName}`
  }

  return { toRepoCommits }
}
