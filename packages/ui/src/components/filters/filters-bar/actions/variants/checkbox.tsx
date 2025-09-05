import { ReactNode, useCallback, useEffect, useState } from 'react'

import { DropdownMenu, ScrollArea, SearchInput, useSearchableDropdownKeyboardNavigation } from '@/components'
import { CheckboxOptions } from '@components/filters/types'

interface CheckboxFilterProps {
  filter: Array<CheckboxOptions>
  filterOption: Array<CheckboxOptions>
  onUpdateFilter: (values: Array<CheckboxOptions>) => void
  onSearch?: (searchQuery: string) => void
  isLoading?: boolean
  placeholder?: string
  noResultsMessage?: ReactNode
  allowSearch?: boolean
}

const MultiSelectFilter = ({
  filter,
  filterOption,
  onUpdateFilter,
  onSearch,
  isLoading,
  placeholder,
  noResultsMessage,
  allowSearch = true
}: CheckboxFilterProps) => {
  const [filteredOptions, setFilteredOptions] = useState(filterOption)
  const filterValue = filter

  const { searchInputRef, handleSearchKeyDown, getItemProps } = useSearchableDropdownKeyboardNavigation({
    itemsLength: filteredOptions.length
  })

  const filterBySearch = useCallback(
    (value: string) => {
      setFilteredOptions(filterOption.filter(option => option.label.toLowerCase().includes(value.toLowerCase())))
    },
    [filterOption]
  )

  const handleSearch = (value: string) => {
    if (onSearch) {
      onSearch(value)
    } else {
      filterBySearch(value)
    }
  }

  useEffect(() => {
    filterBySearch(searchInputRef?.current?.value || '')
  }, [filterBySearch, filterOption, searchInputRef])

  const renderContent = () => {
    if (isLoading) {
      return <DropdownMenu.Spinner />
    }

    if (filteredOptions.length === 0) {
      return <DropdownMenu.NoOptions>{noResultsMessage}</DropdownMenu.NoOptions>
    }

    return (
      <ScrollArea className="max-h-64">
        {filteredOptions.map((option, index) => {
          const { ref, onKeyDown } = getItemProps(index)

          return (
            <DropdownMenu.CheckboxItem
              ref={ref}
              onKeyDown={onKeyDown}
              title={option.label}
              checked={filterValue.map(v => v.value).includes(option.value)}
              onCheckedChange={isChecked => {
                const newValues = !isChecked
                  ? filterValue.filter(v => v.value !== option.value)
                  : [...filterValue, { label: option.label, value: option.value }]
                onUpdateFilter(newValues)
              }}
              key={option.value}
            />
          )
        })}
      </ScrollArea>
    )
  }

  return (
    <>
      {allowSearch && (
        <DropdownMenu.Header>
          <SearchInput
            ref={searchInputRef}
            inputContainerClassName="mb-0.5"
            placeholder={placeholder}
            autoFocus
            onKeyDown={e => {
              e.stopPropagation()
              handleSearchKeyDown(e)
            }}
            onChange={value => handleSearch(value)}
          />
        </DropdownMenu.Header>
      )}
      {renderContent()}
    </>
  )
}

export { MultiSelectFilter }
