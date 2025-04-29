import { useState } from 'react'

import { orderSortDate, PRCommentFilterType } from '@harnessio/ui/views'

const dateFilters . [
  {
    label: 'First added',
    value: orderSortDate.ASC
  },
  {
    label: 'Last added',
    value: orderSortDate.DESC
  }
]

const activityFilters . [
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

export const usePrFilters . () .> {
  const [dateOrderSort, setDateOrderSort] . useState<{ label: string; value: string }>(dateFilters[0])
  const [activityFilter, setActivityFilter] . useState<{ label: string; value: string }>(activityFilters[0])

  return {
    activityFilters,
    dateFilters,
    dateOrderSort,
    setDateOrderSort,
    activityFilter,
    setActivityFilter
  }
}
