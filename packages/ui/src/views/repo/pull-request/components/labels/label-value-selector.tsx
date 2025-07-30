import { FC, useMemo, useState } from 'react'

import { Button, DropdownMenu, IconV2, SearchBox, Tag } from '@/components'
import { useTranslation } from '@/context'
import { useDebounceSearch } from '@/hooks'
import { wrapConditionalObjectElement } from '@/utils'
import { HandleAddLabelType, LabelValueType } from '@/views'

import { LabelsWithValueType } from './pull-request-labels-header'

export interface LabelValueSelectorProps {
  label: LabelsWithValueType
  handleAddOrRemoveLabel: (data: HandleAddLabelType, isSelected: boolean) => void
  onSearchClean: () => void
}

export const LabelValueSelector: FC<LabelValueSelectorProps> = ({ label, handleAddOrRemoveLabel, onSearchClean }) => {
  const { t } = useTranslation()
  const [searchState, setSearchState] = useState('')

  const { search, handleSearchChange } = useDebounceSearch({
    handleChangeSearchValue: setSearchState,
    searchValue: searchState
  })

  const { values, isAllowAddNewValue } = useMemo(() => {
    if (!label?.values)
      return {
        values: [] as LabelValueType[],
        isAllowAddNewValue: !!searchState.length
      }

    if (!searchState.length)
      return {
        values: label.values,
        isAllowAddNewValue: false
      }

    return label.values.reduce<{
      values: LabelValueType[]
      isAllowAddNewValue: boolean
    }>(
      (acc, item) => {
        const lowerCaseSearchState = searchState.toLowerCase()
        const lowerCaseValue = item.value.toLowerCase()

        if (lowerCaseValue.includes(lowerCaseSearchState)) {
          acc.values.push(item)
        }

        if (lowerCaseSearchState === lowerCaseValue) {
          acc.isAllowAddNewValue = false
        }

        return acc
      },
      { values: [], isAllowAddNewValue: true }
    )
  }, [label?.values, searchState])

  const handleOnSelect = (value: LabelValueType) => (e: Event) => {
    e.preventDefault()

    handleAddOrRemoveLabel({ label_id: label.id, value_id: value.id }, label.selectedValueId === value.id)
  }

  const handleAddNewValue = () => {
    if (!searchState.length) return

    handleAddOrRemoveLabel({ label_id: label.id, value: searchState }, false)
  }

  const getSearchBoxPlaceholder = () => {
    if (label?.isCustom && values.length > 0) {
      return t('views:pullRequests.findOrAddNewValue', 'Find or add a new value')
    }

    if (label?.isCustom && values.length === 0) {
      return t('views:pullRequests.addNewValue', 'Add a new value')
    }

    if (!label?.isCustom) {
      return t('views:pullRequests.searchValue', 'Search value')
    }

    return ''
  }

  return (
    <DropdownMenu.Content className="w-80" align="end" sideOffset={-6} alignOffset={10}>
      <DropdownMenu.Header className="relative">
        <SearchBox.Root
          className="w-full"
          inputClassName="pl-1.5 pr-8"
          placeholder={getSearchBoxPlaceholder()}
          value={search}
          handleChange={handleSearchChange}
          showOnFocus
          hasSearchIcon={false}
          {...wrapConditionalObjectElement({ maxLength: 50 }, !!label?.isCustom)}
        >
          <div className="max-w-20 pr-2">
            <Tag variant="secondary" size="sm" theme={label.color} value={label.key} />
          </div>
        </SearchBox.Root>

        <Button
          iconOnly
          size="xs"
          className="absolute right-2 top-2 z-20"
          variant="transparent"
          onClick={onSearchClean}
        >
          <IconV2 name="xmark" size="2xs" />
        </Button>
      </DropdownMenu.Header>

      {values.map(value => (
        <DropdownMenu.Item
          key={value.id}
          onSelect={handleOnSelect(value)}
          tag={{ variant: 'secondary', size: 'sm', theme: label.color, value: value.value }}
          checkmark={label.selectedValueId === value.id}
        />
      ))}

      {isAllowAddNewValue && !!label?.isCustom && !!values.length && <DropdownMenu.Separator />}

      {isAllowAddNewValue && !!label?.isCustom && (
        <DropdownMenu.Group label={t('views:pullRequests.addValue', 'Add new value')}>
          <DropdownMenu.Item
            onSelect={handleAddNewValue}
            tag={{ variant: 'secondary', size: 'sm', theme: label.color, value: searchState, label: label.key }}
          />
        </DropdownMenu.Group>
      )}

      {!values.length && !label?.isCustom && (
        <DropdownMenu.NoOptions>{t('views:pullRequests.labelNotFound', 'Label not found')}</DropdownMenu.NoOptions>
      )}
    </DropdownMenu.Content>
  )
}
