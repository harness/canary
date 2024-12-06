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
  if (filter.condition === 'is_empty' || filter.condition === 'is_not_empty') {
    return true
  }

  if (filter.selectedValues.length === 0) {
    return true
  }

  const isPrivate = repo.private
  const isPublic = !repo.private
  const isFork = repo.forks > 0

  const matchesType = filter.selectedValues.some(value => {
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

  return filter.condition === 'is' ? matchesType : !matchesType
}

/**
 * Applies date-based filtering
 */
const applyDateFilter = (repo: RepositoryType, filter: FilterValue): boolean => {
  if (filter.selectedValues.length === 0) {
    return true
  }

  if (filter.condition === 'is_empty') {
    return !repo.createdAt
  }
  if (filter.condition === 'is_not_empty') {
    return !!repo.createdAt
  }

  const createdDate = new Date(repo.createdAt)
  const selectedDate = new Date(filter.selectedValues[0])

  createdDate.setHours(0, 0, 0, 0)
  selectedDate.setHours(0, 0, 0, 0)

  switch (filter.condition) {
    case 'is':
      return createdDate.getTime() === selectedDate.getTime()
    case 'is_before':
      return createdDate.getTime() < selectedDate.getTime()
    case 'is_after':
      return createdDate.getTime() > selectedDate.getTime()
    case 'is_between': {
      if (filter.selectedValues.length !== 2) return true
      const endDate = new Date(filter.selectedValues[1])
      endDate.setHours(0, 0, 0, 0)
      return createdDate.getTime() >= selectedDate.getTime() && createdDate.getTime() <= endDate.getTime()
    }
    default:
      return true
  }
}

/**
 * Applies name-based filtering
 */
const applyNameFilter = (repo: RepositoryType, filter: FilterValue): boolean => {
  if (filter.condition === 'is_empty') {
    return !repo.name
  }
  if (filter.condition === 'is_not_empty') {
    return !!repo.name
  }

  if (filter.selectedValues.length === 0) {
    return true
  }

  const value = filter.selectedValues[0].toLowerCase()
  const name = repo.name.toLowerCase()

  switch (filter.condition) {
    case 'is':
      return name === value
    case 'is_not':
      return name !== value
    case 'contains':
      return name.includes(value)
    case 'does_not_contain':
      return !name.includes(value)
    case 'starts_with':
      return name.startsWith(value)
    case 'ends_with':
      return name.endsWith(value)
    default:
      return true
  }
}

/**
 * Applies stars-based filtering
 */
const applyStarsFilter = (repo: RepositoryType, filter: FilterValue): boolean => {
  if (filter.condition === 'is_empty') {
    return !repo.stars
  }
  if (filter.condition === 'is_not_empty') {
    return !!repo.stars
  }

  if (filter.selectedValues.length === 0) {
    return true
  }

  const filterValue = Number(filter.selectedValues[0])
  const repoValue = repo.stars || 0

  switch (filter.condition) {
    case 'equals':
      return repoValue === filterValue
    case 'not_equals':
      return repoValue !== filterValue
    case 'greater':
      return repoValue > filterValue
    case 'less':
      return repoValue < filterValue
    case 'greater_equals':
      return repoValue >= filterValue
    case 'less_equals':
      return repoValue <= filterValue
    default:
      return true
  }
}
