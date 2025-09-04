import { Button, IconV2, SearchInput } from '@/components'

import { FilterFieldConfig } from '../../../types'

interface TextFilterProps {
  filter: FilterFieldConfig<string>
  onUpdateFilter: (filterValue: string) => void
}

const Text = ({ filter, onUpdateFilter }: TextFilterProps) => {
  const handleInputChange = (value: string) => {
    onUpdateFilter(value)
  }

  const handleClear = () => {
    onUpdateFilter('')
  }

  return (
    <SearchInput
      className="pl-cn-sm"
      inputContainerClassName="mx-cn-xs my-cn-2xs w-auto"
      defaultValue={filter.value || ''}
      placeholder="Type a value..."
      autoFocus
      onChange={handleInputChange}
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
