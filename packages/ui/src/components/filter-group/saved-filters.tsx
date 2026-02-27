import { useEffect, useState } from 'react'

import { useFiltersContext } from '@harnessio/filters'

import { Button } from '../button'
import { DropdownMenu } from '../dropdown-menu'
import { IconV2 } from '../icon-v2'
import { Text } from '../text'
import { useRouterContext } from '../../context/router-context'

export interface SavedFiltersProps {
  options: { value: string; label: string }[]
  savedFilterKey?: string
}

export function SavedFilters({ options, savedFilterKey }: SavedFiltersProps) {
  const { applySavedFilter } = useFiltersContext()
  const { location } = useRouterContext()

  const searchParams = new URLSearchParams(location.search)
  const savedFilterValue = (savedFilterKey && searchParams.get(savedFilterKey)) ?? ''
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string }>()

  useEffect(() => {
    if (options.length > 0) {
      const savedFilterOption = options.find(option => option.value === savedFilterValue) ?? {
        value: savedFilterValue,
        label: savedFilterValue
      }
      setSelectedOption(savedFilterOption)
    }
  }, [options, savedFilterValue])

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button size="md" variant="ghost" className="min-w-0 max-w-fit flex-1">
          <IconV2 name="filter" />
          <Text truncate>{selectedOption?.label || 'Saved Filters'}</Text>
          <IconV2 name="nav-arrow-down" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start" className="min-w-56">
        {options.map(option => (
          <DropdownMenu.Item
            key={option.value}
            title={option.label}
            checkmark={option.value === selectedOption?.value}
            onSelect={() => {
              applySavedFilter(option.value)
              setSelectedOption(option)
            }}
          >
            {option.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default SavedFilters
