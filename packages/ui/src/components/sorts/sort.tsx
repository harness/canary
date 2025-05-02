import { ReactNode, useState } from 'react'

import { SortProvider } from './sort-context'
import { SortDirection, SortOption, SortValue } from './type'

export function Sort({
  sortOptions,
  sortDirections,
  onSortChange,
  children
}: {
  children: ReactNode
  sortOptions: SortOption[]
  sortDirections: SortDirection[]
  onSortChange?: (sortSelections: SortValue[]) => void
}) {
  const [sortSelections, updateSortSelections] = useState<SortValue[]>([])
  return (
    <SortProvider
      sortOptions={sortOptions}
      sortDirections={sortDirections}
      sortSelections={sortSelections}
      updateSortSelections={(newSortSelections: SortValue[]) => {
        onSortChange?.(newSortSelections)
        updateSortSelections(newSortSelections)
      }}
    >
      {children}
    </SortProvider>
  )
}
