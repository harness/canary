import { useMemo } from 'react'

import { orderSortDate } from '../types/types'

export function useDateFilters() {
  return useMemo(
    () => [
      {
        label: 'First added',
        value: orderSortDate.ASC
      },
      {
        label: 'Last added',
        value: orderSortDate.DESC
      }
    ],
    []
  )
}
