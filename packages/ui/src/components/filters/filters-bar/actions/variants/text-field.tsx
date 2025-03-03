import { Icon, Input } from '@/components'

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
    <div className="flex items-center px-2 pb-2.5">
      <Input className="w-full" value={filter.value || ''} placeholder="Type a value..." onChange={handleInputChange} />

      {filter.value && (
        <button
          className="absolute right-3 text-icons-1 transition-colors duration-200 hover:text-foreground-1"
          onClick={() => {
            handleClear()
          }}
          aria-label="Clear filter"
        >
          <Icon className="rotate-45" name="plus" size={10} />
        </button>
      )}
    </div>
  )
}

export default Text
