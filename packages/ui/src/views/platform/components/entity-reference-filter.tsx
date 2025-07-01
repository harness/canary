import { useCallback, useState } from 'react'

import { Select } from '@/components'

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
    <Select
      size="sm"
      value={selectedType}
      onChange={handleValueChange}
      options={Object.entries(filterTypes).map(([type, label]) => ({ value: type, label }))}
    />
  )
}
