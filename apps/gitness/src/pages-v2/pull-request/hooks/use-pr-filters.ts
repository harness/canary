import { useMemo } from 'react'

import { useLocalStorage, UserPreference } from '@harnessio/ui/hooks'

import { orderSortDate, PRCommentFilterType } from './types'

interface FilterOption {
  label: string
  value: string
}

const dateFilters: FilterOption[] = [
  {
    label: 'First added',
    value: orderSortDate.ASC
  },
  {
    label: 'Last added',
    value: orderSortDate.DESC
  }
]

const activityFilters: FilterOption[] = [
  {
    label: 'Show everything',
    value: PRCommentFilterType.SHOW_EVERYTHING
  },
  {
    label: 'All comments',
    value: PRCommentFilterType.ALL_COMMENTS
  },
  {
    label: 'My comments/replies',
    value: PRCommentFilterType.MY_COMMENTS
  },
  {
    label: 'Unresolved comments',
    value: PRCommentFilterType.UNRESOLVED_COMMENTS
  },
  {
    label: 'Resolved comments',
    value: PRCommentFilterType.RESOLVED_COMMENTS
  }
]

export const usePrFilters = () => {
  const [dateOrderSort, setDateOrderSort] = useLocalStorage<FilterOption>(
    UserPreference.PULL_REQUEST_ACTIVITY_ORDER,
    dateFilters[0]
  )
  const [activityFilter, setActivityFilter] = useLocalStorage<FilterOption>(
    UserPreference.PULL_REQUEST_ACTIVITY_FILTER,
    activityFilters[0]
  )

  return useMemo(
    () => ({
      activityFilters,
      dateFilters,
      dateOrderSort,
      setDateOrderSort,
      activityFilter,
      setActivityFilter
    }),
    [dateOrderSort, activityFilter]
  )
}
