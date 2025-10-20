import { useCallback, useState } from 'react'

import { Button, Checkbox, DropdownMenu, IconV2, Text } from '@/components'

export interface EntityReferenceSortProps {
  onSortChange?: (type: string) => void
  onFavoriteChange?: (favorite: boolean) => void
  enableFavorite?: boolean
}

export const EntityReferenceSort: React.FC<EntityReferenceSortProps> = ({
  onSortChange,
  onFavoriteChange,
  enableFavorite = false
}) => {
  const DEFAULT_SORT = 'Last modified'
  const [selectedSort, setSelectedSort] = useState(DEFAULT_SORT)
  const [favoriteSelected, setFavoriteSelected] = useState(false)

  const handleValueChange = useCallback(
    (value: string) => {
      setSelectedSort(value)
      // Map the sort options to the correct API sort format
      const sortMapping: Record<string, string> = {
        'Last modified': 'lastModifiedAt,DESC',
        Newest: 'createdAt,DESC',
        Oldest: 'createdAt,ASC',
        'Name (A→Z, 0→9)': 'name,ASC',
        'Name (Z→A, 9→0)': 'name,DESC'
      }

      const sortValue = sortMapping[value] || 'lastModifiedAt,DESC'
      onSortChange?.(sortValue)
    },
    [onSortChange]
  )

  const handleFavoriteChange = useCallback(
    (checked: boolean) => {
      setFavoriteSelected(checked)
      onFavoriteChange?.(checked)
    },
    [onFavoriteChange]
  )

  const sortOptions = ['Last modified', 'Newest', 'Oldest', 'Name (A→Z, 0→9)', 'Name (Z→A, 9→0)']

  return (
    <div className="flex items-center gap-cn-sm">
      {enableFavorite && (
        <Button
          variant="outline"
          size="md"
          onClick={() => handleFavoriteChange(!favoriteSelected)}
          className="flex items-center gap-cn-xs px-cn-xs"
        >
          <Checkbox
            checked={favoriteSelected}
            onCheckedChange={checked => {
              const isChecked = checked === true
              handleFavoriteChange(isChecked)
            }}
          />
          <IconV2 name="pin-solid" size="md" />
        </Button>
      )}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline" className="gap-x-cn-2xs">
            <Text truncate color="foreground-1">
              {selectedSort}
            </Text>
            <IconV2 name="nav-arrow-down" size="2xs" className="chevron-down" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          {sortOptions.map(option => (
            <DropdownMenu.Item
              checkmark={selectedSort === option}
              onClick={() => handleValueChange(option)}
              key={option}
              title={option}
            />
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

export type EntityReferenceFilterProps = EntityReferenceSortProps
