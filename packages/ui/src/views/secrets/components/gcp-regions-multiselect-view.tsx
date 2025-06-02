import { useEffect, useState } from 'react'

import { Alert, MultiSelect, SkeletonList } from '@/components'

export interface GcpRegionsMultiSelectProps {
  value?: string | string[]
  onChange: (value: string[]) => void
  placeholder?: string
  regionsOptions: Array<{ id: string; label: string }>
  isLoading?: boolean
  error?: string
}

export function GcpRegionsMultiSelect(props: GcpRegionsMultiSelectProps): React.ReactElement {
  const { value, onChange, placeholder = 'Select regions', regionsOptions, isLoading, error } = props
  const [selectedItems, setSelectedItems] = useState<Array<{ id: string; label: string }>>([])

  useEffect(() => {
    if (value) {
      const regions = Array.isArray(value) ? value : [value]
      const items = regions.map(region => ({
        id: region,
        label: region
      }))
      setSelectedItems(items)
    } else {
      setSelectedItems([])
    }
  }, [value])

  const handleChange = (item: { id: string; label: string }) => {
    let newSelectedItems: Array<{ id: string; label: string }>
    const isSelected = selectedItems.some(selected => selected.id === item.id)

    if (isSelected) {
      newSelectedItems = selectedItems.filter(selected => selected.id !== item.id)
    } else {
      newSelectedItems = [...selectedItems, item]
    }

    setSelectedItems(newSelectedItems)
    const regionIds = newSelectedItems.map(selected => selected.id)
    onChange(regionIds)
  }

  return (
    <>
      {isLoading ? (
        <SkeletonList />
      ) : error ? (
        <Alert.Root theme="danger" className="my-2">
          <Alert.Description>{error?.toString() || 'Failed to fetch regions'}</Alert.Description>
        </Alert.Root>
      ) : (
        <MultiSelect
          selectedItems={selectedItems}
          options={regionsOptions}
          handleChange={handleChange}
          placeholder={placeholder}
        />
      )}
    </>
  )
}
