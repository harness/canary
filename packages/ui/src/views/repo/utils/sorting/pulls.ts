import { SortValue } from '@components/filters/types'

import { PullRequestType } from '../../pull-request/pull-request.types'

export const sortPullRequests = (
  pullRequests: PullRequestType[] | null,
  activeSorts: SortValue[]
): PullRequestType[] => {
  if (!pullRequests) return []

  return [...pullRequests].sort((a, b) => {
    for (const sort of activeSorts) {
      const direction = sort.direction === 'asc' ? 1 : -1
      const comparison = comparePullRequests(a, b, sort.type) * direction

      if (comparison !== 0) {
        return comparison
      }
    }
    return 0
  })
}

const comparePullRequests = (a: PullRequestType, b: PullRequestType, sortType: string): number => {
  switch (sortType) {
    case 'updated':
      return new Date(b.updated).getTime() - new Date(a.updated).getTime()
    case 'title':
      return (a.name || '').localeCompare(b.name || '')
    default:
      return 0
  }
}
