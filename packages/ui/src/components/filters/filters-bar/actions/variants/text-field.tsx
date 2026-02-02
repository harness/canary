import { Button, IconV2, SearchInput } from '@/components'

import { FilterFieldConfig } from '../../../types'

interface TextFilterProps {
  filter: FilterFieldConfig<string>
  onUpdateFilter: (filterValue: string) => void
  handleEnter?: (text: string, reverse?: boolean) => void
}

const Text = ({ filter, onUpdateFilter, handleEnter }: TextFilterProps) => {
  const handleInputChange = (value: string) => {
    onUpdateFilter(value)
  }

  const handleClear = () => {
    onUpdateFilter('')
  }

  return (
    <SearchInput
      className="pl-cn-sm"
      searchValue={filter.value ?? ''}
      inputContainerClassName="mx-cn-xs my-cn-2xs w-auto"
      placeholder="Type a value..."
      autoFocus
      onChange={handleInputChange}
      onEnter={handleEnter}
      prefix={false}
      suffix={
        <Button iconOnly size="sm" variant="transparent" onClick={handleClear} ignoreIconOnlyTooltip>
          <IconV2 name="xmark" size="2xs" />
        </Button>
      }
    />
  )
}

export default Text
