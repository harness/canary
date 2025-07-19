import { useState } from 'react'

import { Button, IconV2, Select, SortOption } from '@/components'

interface SimpleSortProps {
  sortOptions: SortOption[]
  defaultSort?: string
  onSortChange?: (sortSelections: string) => void
}

export default function SimpleSort(props: SimpleSortProps) {
  const { sortOptions, defaultSort, onSortChange } = props
  const [sortSelections, updateSortSelections] = useState(defaultSort)

  return (
    <Select
      value={sortSelections}
      triggerRenderer={selectedLabel => (
        <Button size="sm" variant="transparent">
          <IconV2 name="arrows-updown" size="2xs" />
          {selectedLabel || 'Sort'}
          <IconV2 className="chevron-down text-icons-4" name="nav-solid-arrow-down" size="2xs" />
        </Button>
      )}
      contentClassName="min-w-[224px]"
      dropdownAlign="end"
      options={sortOptions}
      onChange={value => {
        updateSortSelections(value)
        onSortChange?.(value)
      }}
    />
  )
}
