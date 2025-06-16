import { useCallback, useState } from 'react'

import { DropdownMenu, IconV2 } from '@/components'

export interface EntityReferenceFilterProps {
  onFilterChange?: (type: string) => void
  defaultValue: string
  filterTypes: Record<string, string>
}

export const EntityReferenceFilter: React.FC<EntityReferenceFilterProps> = ({
  onFilterChange,
  defaultValue,
  filterTypes
}) => {
  const [selectedType, setSelectedType] = useState<string>(defaultValue)

  const handleValueChange = useCallback(
    (value: string) => {
      setSelectedType(value)
      onFilterChange?.(value)
    },
    [onFilterChange]
  )

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex h-8 w-36 items-center justify-between rounded-md bg-cn-background-3 px-3 py-2 text-sm hover:bg-cn-background-hover">
        <span className="truncate text-cn-foreground-1">{filterTypes[selectedType]}</span>
        <IconV2 name="nav-arrow-down" size="xs" className="chevron-down" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        {Object.entries(filterTypes).map(([type, label]) => (
          <DropdownMenu.Item key={type} onClick={() => handleValueChange(type)} title={label} />
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
