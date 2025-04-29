import { useEffect, useState } from 'react'

import { TranslationStore } from '@views/repo'

import { Alert, MultiSelect, SkeletonList } from '@harnessio/ui/components'

export interface GcpRegionsMultiSelectProps {
  value?: string | string[]
  onChange: (value: string[]) => void
  placeholder?: string
  regionsOptions: Array<{ id: string; label: string }>
  isLoading?: boolean
  error?: string
  useTranslationStore: () => TranslationStore
}

const SELECT_REGIONS = 'Select regions'
const FAILED_TO_FETCH = 'Failed to fetch regions'

export function GcpRegionsMultiSelect(props: GcpRegionsMultiSelectProps): React.ReactElement {
  const { value, onChange, placeholder = SELECT_REGIONS, regionsOptions, isLoading, error, useTranslationStore } = props
  const [selectedItems, setSelectedItems] = useState<Array<{ id: string; label: string }>>([])
  const { t } = useTranslationStore()

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
        <Alert.Container variant="destructive" className="my-2">
          <Alert.Description>{error?.toString() || FAILED_TO_FETCH}</Alert.Description>
        </Alert.Container>
      ) : (
        <MultiSelect
          selectedItems={selectedItems}
          options={regionsOptions}
          handleChange={handleChange}
          placeholder={placeholder}
          t={t}
        />
      )}
    </>
  )
}
