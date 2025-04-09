import { useCallback, useState } from 'react'

import { DropdownMenu, Icon } from '@/components'

export type SecretType = 'all' | 'file' | 'text'

export interface SecretTypeFilterProps {
  onFilterChange: (type: string) => void
  defaultValue?: SecretType
}

export const SecretTypeFilter: React.FC<SecretTypeFilterProps> = ({ onFilterChange, defaultValue = 'all' }) => {
  const [selectedType, setSelectedType] = useState<string>(defaultValue)

  const handleValueChange = useCallback(
    (value: string) => {
      setSelectedType(value)
      onFilterChange(value)
    },
    [onFilterChange]
  )

  // Map of types to display names
  const typeLabels: Record<SecretType, string> = {
    all: 'Show all secrets',
    file: 'Show file secrets',
    text: 'Show text secrets'
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="bg-cn-background-3 hover:bg-cn-background-hover flex h-9 w-40 items-center justify-between rounded-md px-3 py-2 text-sm">
        <span className="text-cn-foreground-1 truncate">{typeLabels[selectedType]}</span>
        <Icon name="chevron-down" size={8} className="chevron-down" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-40">
        {Object.entries(typeLabels).map(([type, label]) => (
          <DropdownMenu.Item key={type} onClick={() => handleValueChange(type)}>
            {label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default SecretTypeFilter
