import { useCallback, useState } from 'react'

import { Button, DropdownMenu, IconV2, Text } from '@/components'

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
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">
          <Text truncate color="foreground-1">
            {filterTypes[selectedType]}
          </Text>
          <IconV2 name="nav-arrow-down" size="2xs" className="chevron-down" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        {Object.entries(filterTypes).map(([type, label]) => (
          <DropdownMenu.Item key={type} onClick={() => handleValueChange(type)} title={label} />
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
