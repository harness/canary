import { FilterValue } from '@components/filters/types'

import { PullRequestType } from '../../pull-request/types'

export const filterPullRequests = (
  pullRequests: PullRequestType[] | null,
  activeFilters: FilterValue[]
): PullRequestType[] => {
  if (!pullRequests) return []
  if (activeFilters.length === 0) return pullRequests

  return pullRequests.filter(pr => activeFilters.every(filter => applyFilter(pr, filter)))
}

const applyFilter = (pr: PullRequestType, filter: FilterValue): boolean => {
  switch (filter.type) {
    case 'type':
      return applyTypeFilter(pr, filter)
    case 'created_time':
      return applyDateFilter(pr, filter)
    case 'name':
      return applyNameFilter(pr, filter)
    default:
      return true
  }
}

const applyTypeFilter = (pr: PullRequestType, filter: FilterValue): boolean => {
  if (filter.condition === 'is_empty' || filter.condition === 'is_not_empty') {
    return true
  }

  if (filter.selectedValues.length === 0) {
    return true
  }

  const isOpen = pr.state === 'open'
  const isClosed = pr.state === 'closed'

  const matchesType = filter.selectedValues.some(value => {
    switch (value) {
      case 'enabled':
        return isOpen
      case 'disabled':
        return isClosed
      default:
        return false
    }
  })

  return filter.condition === 'is' ? matchesType : !matchesType
}

const applyDateFilter = (pr: PullRequestType, filter: FilterValue): boolean => {
  if (filter.selectedValues.length === 0) {
    return true
  }

  if (filter.condition === 'is_empty') {
    return !pr.updated
  }
  if (filter.condition === 'is_not_empty') {
    return !!pr.updated
  }

  const createdDate = new Date(pr.updated)
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

const applyNameFilter = (pr: PullRequestType, filter: FilterValue): boolean => {
  if (filter.condition === 'is_empty') {
    return !pr.name
  }
  if (filter.condition === 'is_not_empty') {
    return !!pr.name
  }

  if (filter.selectedValues.length === 0) {
    return true
  }

  const value = filter.selectedValues[0].toLowerCase()
  const name = pr.name?.toLowerCase() ?? ''

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
