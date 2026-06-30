import { useMemo, useState } from 'react'

import { DropdownMenu, SearchInput } from '@/components'

interface SearchableDropdownOption {
  label: string
  value: string
  group?: string
}

interface SearchableDropdownProps<T extends SearchableDropdownOption> {
  options: T[]
  displayLabel?: React.ReactNode | string
  dropdownAlign?: 'start' | 'end'
  inputPlaceholder?: string
  onChange: (option: T) => void
  onReset?: () => void
  buttonLabel?: string
  isSearchable?: boolean
}

const groupBySection = <T extends SearchableDropdownOption>(options: T[]) =>
  options.reduce<{ label?: string; options: T[] }[]>((sections, option) => {
    const last = sections[sections.length - 1]
    if (option.group) {
      if (last?.label === option.group) last.options.push(option)
      else sections.push({ label: option.group, options: [option] })
    } else if (last && !last.label) last.options.push(option)
    else sections.push({ options: [option] })
    return sections
  }, [])

const SearchableDropdown = <T extends SearchableDropdownOption>({
  displayLabel,
  dropdownAlign = 'end',
  onChange,
  onReset,
  isSearchable = false,
  options,
  inputPlaceholder,
  buttonLabel
}: SearchableDropdownProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOptions = useMemo(
    () => options.filter(option => !searchQuery || option.label.toLowerCase().includes(searchQuery.toLowerCase())),
    [options, searchQuery]
  )

  const sections = useMemo(() => groupBySection(filteredOptions), [filteredOptions])

  const renderItem = (option: T, grouped = false) => (
    <DropdownMenu.Item
      key={option.value}
      className={grouped ? 'pl-cn-md' : undefined}
      onSelect={() => onChange(option)}
      title={option.label}
    />
  )

  return (
    <DropdownMenu.Root onOpenChange={open => open && isSearchable && setSearchQuery('')}>
      <DropdownMenu.Trigger asChild>{displayLabel}</DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-[224px]" align={dropdownAlign} onCloseAutoFocus={e => e.preventDefault()}>
        {isSearchable && (
          <DropdownMenu.Header>
            <SearchInput
              placeholder={inputPlaceholder}
              searchValue={searchQuery}
              onChange={setSearchQuery}
              debounce={false}
            />
          </DropdownMenu.Header>
        )}

        {sections.map((section, i) =>
          section.label ? (
            <DropdownMenu.Group key={`${section.label}-${i}`} label={section.label}>
              {section.options.map(option => renderItem(option, true))}
            </DropdownMenu.Group>
          ) : (
            section.options.map(option => renderItem(option))
          )
        )}

        {filteredOptions.length === 0 && <DropdownMenu.NoOptions>No results</DropdownMenu.NoOptions>}

        {onReset && (
          <>
            <DropdownMenu.Separator />
            <DropdownMenu.Item title={buttonLabel} onClick={onReset} />
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default SearchableDropdown
