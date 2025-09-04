import { Button, IconV2, Input } from '@/components'

import { FilterFieldConfig } from '../../../types'

interface TextFilterProps {
  filter: FilterFieldConfig<string>
  onUpdateFilter: (filterValue: string) => void
}

const Text = ({ filter, onUpdateFilter }: TextFilterProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateFilter(event.target.value)
  }

  const handleClear = () => {
    onUpdateFilter('')
  }

  return (
    <div className="p-3">
      <Input
        value={filter.value || ''}
        placeholder="Type a value..."
        onChange={handleInputChange}
        rightElement={
          <Button iconOnly size="sm" variant="transparent" onClick={handleClear} ignoreIconOnlyTooltip>
            <IconV2 name="xmark" size="2xs" />
          </Button>
        }
      />
    </div>
  )
}

export default Text
