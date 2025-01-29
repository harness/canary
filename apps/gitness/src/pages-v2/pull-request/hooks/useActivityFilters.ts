import { useMemo } from 'react'

import { PRCommentFilterType } from './types'

export function useActivityFilters() {
  return useMemo(
    () => [
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
    ],
    []
  )
}
