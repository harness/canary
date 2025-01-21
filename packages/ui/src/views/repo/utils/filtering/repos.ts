import { FilterValue } from '@components/filters/types'
import { RepositoryType } from '@views/repo/repo.types'

/**
 * Filters repositories based on active filters
 * @param repositories - Array of repositories to filter
 * @param activeFilters - Array of active filter conditions
 * @returns Filtered array of repositories
 */
export const filterRepositories = (
  repositories: RepositoryType[] | null,
  activeFilters: FilterValue[]
): RepositoryType[] => {
  if (!repositories) return []
  if (activeFilters.length === 0) return repositories

  return repositories.filter(repo => activeFilters.every(filter => applyFilter(repo, filter)))
}

/**
 * Applies a single filter to a repository
 */
const applyFilter = (repo: RepositoryType, filter: FilterValue): boolean => {
  switch (filter.type) {
    case 'type':
      return applyTypeFilter(repo, filter)
    case 'created_time':
      return applyDateFilter(repo, filter)
    case 'name':
      return applyNameFilter(repo, filter)
    case 'stars':
      return applyStarsFilter(repo, filter)
    default:
      return true
  }
}

/**
 * Applies type-based filtering (private/public/fork)
 */
const applyTypeFilter = (repo: RepositoryType, filter: FilterValue): boolean => {
  if (filter.selectedValues.length === 0) {
    return true
  }

  const isPrivate = repo.private
  const isPublic = !repo.private
  const isFork = repo.forks > 0

  const matchesType = filter.selectedValues.some((value: string) => {
    switch (value) {
      case 'private':
        return isPrivate
      case 'public':
        return isPublic
      case 'fork':
        return isFork
      default:
        return false
    }
  })

  return matchesType
}

/**
 * Applies date-based filtering
 */
const applyDateFilter = (repo: RepositoryType, filter: FilterValue): boolean => {
  if (filter.selectedValues.length === 0) {
    return true
  }

  const createdDate = new Date(repo.createdAt)
  const selectedDate = new Date(filter.selectedValues[0])

  createdDate.setHours(0, 0, 0, 0)
  selectedDate.setHours(0, 0, 0, 0)

  return createdDate.getTime() === selectedDate.getTime()
}

/**
 * Applies name-based filtering
 */
const applyNameFilter = (repo: RepositoryType, filter: FilterValue): boolean => {
  if (!filter.selectedValues) {
    return true
  }

  const value = filter.selectedValues.toLowerCase()
  const name = repo.name.toLowerCase()

  return name.includes(value)
}

/**
 * Applies stars-based filtering
 */
const applyStarsFilter = (repo: RepositoryType, filter: FilterValue): boolean => {
  if (!filter.selectedValues) {
    return true
  }

  const filterValue = Number(filter.selectedValues)
  const repoValue = repo.stars || 0

  return repoValue === filterValue
}
