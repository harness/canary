import { DropdownMenu } from '@/components'
import { CheckboxOptions } from '@components/filters/types'

interface CheckboxFilterProps {
  filter: Array<CheckboxOptions>
  filterOption: Array<CheckboxOptions>
  onUpdateFilter: (values: Array<CheckboxOptions>) => void
}

const MultiSelectFilter = ({ filter, filterOption, onUpdateFilter }: CheckboxFilterProps) => {
  const filteredOptions = filterOption
  const filterValue = filter

  return (
    <>
      {filteredOptions.map(option => (
        <DropdownMenu.CheckboxItem
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
      ))}
    </>
  )
}

export { MultiSelectFilter }
