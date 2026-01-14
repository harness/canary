import { useState } from 'react'

import { Button, DropdownMenu, IconV2, SortOption } from '@/components'

interface SimpleSortProps {
  sortOptions: SortOption[]
  defaultSort?: string
  onSortChange?: (sortSelections: string) => void
}

export default function SimpleSort(props: SimpleSortProps) {
  const { sortOptions, defaultSort, onSortChange } = props
  const [sortSelections, updateSortSelections] = useState(defaultSort)
  const selectedOptionLabel = sortOptions.find(option => option.value === sortSelections)?.label

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button size="md" variant="outline">
          <IconV2 name="arrows-updown" size="2xs" />
          {selectedOptionLabel || 'Sort'}
          <IconV2 name="solid-arrow-down" size="2xs" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="min-w-56">
        {sortOptions.map(option => (
          <DropdownMenu.Item
            key={option.value}
            title={option.label}
            checkmark={option.value === sortSelections}
            onSelect={() => {
              updateSortSelections(option.value)
              onSortChange?.(option.value)
            }}
          >
            {option.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
