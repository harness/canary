import { useState } from 'react'

import { useTranslationStore } from '@utils/viewUtils'

import { MultiSelectOptionTypeV2, MultiSelectV2 } from '@harnessio/ui/components'

export const MultiSelectDemo = () => {
  const { t } = useTranslationStore()
  const [selectedItems1, setSelectedItems1] = useState<MultiSelectOptionTypeV2[]>([])
  const [selectedItems2, setSelectedItems2] = useState<MultiSelectOptionTypeV2[]>([])
  const [searchValue, setSearchValue] = useState('')

  // Sample options for dropdown mode
  const options: MultiSelectOptionTypeV2[] = [
    { key: 'option1', value: 'Option 1' },
    { key: 'option2', value: 'Option 2' },
    { key: 'option3', value: 'Option 3' },
    { key: 'option4', value: 'Option 4' },
    { key: 'option5', value: 'Option 5' }
  ]

  const handleChange = (
    option: MultiSelectOptionTypeV2,
    setItems: React.Dispatch<React.SetStateAction<MultiSelectOptionTypeV2[]>>,
    items: MultiSelectOptionTypeV2[]
  ) => {
    const isSelected = items.some(item => item.key === option.key)
    if (isSelected) {
      setItems(items.filter(item => item.key !== option.key))
    } else {
      setItems([...items, option])
    }
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">MultiSelectV2 Demo</h1>

      <div className="p-6 rounded border border-cn-borders-2">
        <h3 className="text-lg font-medium mb-4">Dropdown Mode (with options)</h3>
        <div className="max-w-md">
          <MultiSelectV2
            selectedItems={selectedItems1}
            t={t}
            placeholder="Select options"
            handleChange={option => handleChange(option, setSelectedItems1, selectedItems1)}
            options={options}
            label="Dropdown Select"
            searchValue={searchValue}
            handleChangeSearchValue={setSearchValue}
            customOptionElem={data => <span className="font-medium">{data.value}</span>}
            error={selectedItems1.length === 0 ? 'Please select at least one option' : ''}
          />
        </div>
      </div>

      {/* <div className="p-6 rounded border border-cn-borders-2">
        <h3 className="text-lg font-medium mb-4">Input-only Mode (no options)</h3>
        <div className="max-w-md">
          <MultiSelectV2
            selectedItems={selectedItems2}
            t={t}
            placeholder="Type something and press Enter..."
            handleChange={option => handleChange(option, setSelectedItems2, selectedItems2)}
            label="Input Only"
          />
        </div>
      </div> */}
    </div>
  )
}
