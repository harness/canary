import { useCallback, useState } from 'react'

import { DropdownMenu, Icon } from '@/components'

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
      <DropdownMenu.Trigger className="bg-cn-background-3 hover:bg-cn-background-hover flex h-8 w-36 items-center justify-between rounded-md px-3 py-2 text-sm">
        <span className="text-cn-foreground-1 truncate">{filterTypes[selectedType]}</span>
        <Icon name="chevron-down" size={8} className="chevron-down" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-40">
        {Object.entries(filterTypes).map(([type, label]) => (
          <DropdownMenu.Item key={type} onClick={() => handleValueChange(type)}>
            {label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
