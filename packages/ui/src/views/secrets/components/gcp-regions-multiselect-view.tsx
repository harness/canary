import { useEffect, useState } from 'react'

import { Alert, MultiSelect, SkeletonList } from '@/components'

import { MultiSelectOption } from '@harnessio/ui/components'

export interface GcpRegionsMultiSelectProps {
  value?: string | string[]
  onChange: (value: string[]) => void
  placeholder?: string
  regionsOptions: Array<{ id: string; key: string; label: string }>
  isLoading?: boolean
  error?: string
}

export function GcpRegionsMultiSelect(props: GcpRegionsMultiSelectProps): React.ReactElement {
  const { value, onChange, placeholder = 'Select regions', regionsOptions, isLoading, error } = props
  const [selectedItems, setSelectedItems] = useState<MultiSelectOption[]>([])

  useEffect(() => {
    if (value) {
      const regions = Array.isArray(value) ? value : [value]
      const items = regions.map(region => ({
        id: region,
        key: region,
        label: region
      }))
      setSelectedItems(items)
    } else {
      setSelectedItems([])
    }
  }, [value])

  const handleChange = (items: MultiSelectOption[]) => {
    setSelectedItems(items)
    const regionIds = items.map(selected => selected.id.toString())
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
        <MultiSelect value={selectedItems} options={regionsOptions} onChange={handleChange} placeholder={placeholder} />
      )}
    </>
  )
}
