import { SearchResultItem } from '@harnessio/views'

export function deriveRepoOptionsFromResults(
  results: SearchResultItem[],
  selectedRepoId?: string | null
): { label: string; value: string }[] {
  const uniqueRepoPaths = Array.from(new Set(results.map(result => result.repo_path).filter(Boolean)))

  if (selectedRepoId && !uniqueRepoPaths.includes(selectedRepoId)) {
    uniqueRepoPaths.unshift(selectedRepoId)
  }

  return uniqueRepoPaths.map(repoPath => ({ label: repoPath, value: repoPath }))
}
