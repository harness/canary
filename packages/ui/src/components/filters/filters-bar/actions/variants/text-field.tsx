import { Button, Icon, Input } from '@/components'

import { FilterField } from '../../../types'

interface TextFilterProps {
  filter: FilterField<string>
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
    <div className="px-3 pb-3">
      <Input
        value={filter.value || ''}
        placeholder="Type a value..."
        onChange={handleInputChange}
        rightElement={
          <Button iconOnly size="sm" variant="ghost" onClick={handleClear}>
            <Icon className="rotate-45" name="plus" size={12} />
          </Button>
        }
      />
    </div>
  )
}

export default Text
