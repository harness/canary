import { SortValue } from '@components/filters/types'
import { RepositoryType } from '@views/repo/repo.types'

/**
 * Sorts repositories based on active sorts
 * Applies multiple sorts in priority order
 */
export const sortRepositories = (repositories: RepositoryType[] | null, activeSorts: SortValue[]): RepositoryType[] => {
  if (!repositories) return []

  return [...repositories].sort((a, b) => {
    for (const sort of activeSorts) {
      const direction = sort.direction === 'asc' ? 1 : -1
      const comparison = compareRepositories(a, b, sort.type) * direction

      if (comparison !== 0) {
        return comparison
      }
    }
    return 0
  })
}

const compareRepositories = (a: RepositoryType, b: RepositoryType, sortType: string): number => {
  switch (sortType) {
    case 'updated':
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    case 'stars':
      return b.stars - a.stars
    case 'forks':
      return b.forks - a.forks
    case 'pulls':
      return b.pulls - a.pulls
    case 'title':
      return a.name.localeCompare(b.name)
    default:
      return 0
  }
}
