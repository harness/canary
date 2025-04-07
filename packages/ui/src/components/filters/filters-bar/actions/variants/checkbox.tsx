import { DropdownMenu } from '@/components'
import { CheckboxOptions } from '@components/filters/types'

interface CheckboxFilterProps {
  filter: Array<CheckboxOptions>
  filterOption: Array<CheckboxOptions>
  onUpdateFilter: (values: Array<CheckboxOptions>) => void
}

const Checkbox = ({ filter, filterOption, onUpdateFilter }: CheckboxFilterProps) => {
  const filteredOptions = filterOption
  const filterValue = filter

  return (
    <>
      {!!filteredOptions.length && (
        <div className="px-2 py-1">
          {filteredOptions.map(option => (
            <DropdownMenu.CheckboxItem
              className="pl-[34px]"
              checked={filterValue.map(v => v.value).includes(option.value)}
              onSelect={event => {
                event?.preventDefault()
                event?.stopPropagation()
                const newValues = filterValue.map(v => v.value).includes(option.value)
                  ? filterValue.filter(v => v.value !== option.value)
                  : [...filterValue, { label: option.label, value: option.value }]
                onUpdateFilter(newValues)
              }}
              key={option.value}
            >
              {option.label}
            </DropdownMenu.CheckboxItem>
          ))}
        </div>
      )}
    </>
  )
}

export default Checkbox
