import { useEffect, useState } from 'react'

import { useFiltersContext } from '@harnessio/filters'
import { Button, DropdownMenu, IconV2 } from '@harnessio/ui/components'
import { useRouterContext } from '@harnessio/ui/context'

export default function SavedFilters({
  options,
  savedFilterKey
}: {
  options: { value: string; label: string }[]
  savedFilterKey?: string
}) {
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
        <Button size="sm" variant="transparent">
          <IconV2 name="filter" size="2xs" />
          {selectedOption?.label || 'Saved Filters'}
          <IconV2 name="nav-solid-arrow-down" size="2xs" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="min-w-56">
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
