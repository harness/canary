import { FC, useMemo, useState } from 'react'

import { Button, DropdownMenu, Icon, LabelMarker, ScrollArea, SearchBox } from '@/components'
import { useDebounceSearch } from '@/hooks'
import { HandleAddLabelType, LabelValueType, TranslationStore } from '@/views'

import { LabelsWithValueType } from './pull-request-labels-header'

export interface LabelValueSelectorProps {
  useTranslationStore: () => TranslationStore
  label: LabelsWithValueType
  handleAddOrRemoveLabel: (data: HandleAddLabelType, isSelected: boolean) => void
  onClose: () => void
}

export const LabelValueSelector: FC<LabelValueSelectorProps> = ({
  useTranslationStore,
  label,
  handleAddOrRemoveLabel,
  onClose
}) => {
  const { t } = useTranslationStore()
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
      {
        values: [],
        isAllowAddNewValue: true
      }
    )
  }, [label?.values, searchState])

  const handleOnSelect = (value: LabelValueType) => (e: Event) => {
    e.preventDefault()

    handleAddOrRemoveLabel(
      {
        label_id: label.id,
        value_id: value.id
      },
      label.selectedValueId === value.id
    )
  }

  const handleAddNewValue = () => {
    if (!searchState.length) return

    handleAddOrRemoveLabel(
      {
        label_id: label.id,
        value: searchState
      },
      false
    )
  }

  return (
    <>
      <div className="relative px-2 py-1.5">
        <SearchBox.Root
          className="w-full"
          inputClassName="pl-1.5 pr-8"
          placeholder={
            label?.isCustom
              ? t('views:pullRequests.findOrAddNewValue', 'Find or add a new value')
              : t('views:pullRequests.searchValue', 'Search value')
          }
          value={search}
          handleChange={handleSearchChange}
          showOnFocus
          hasSearchIcon={false}
        >
          <div className="max-w-20 pr-2 leading-none">
            <LabelMarker color={label.color} label={label.key} />
          </div>
        </SearchBox.Root>
        <Button
          className="absolute right-2 top-1.5 z-20 text-icons-1 hover:text-icons-2"
          size="icon"
          variant="custom"
          onClick={onClose}
        >
          <Icon name="cross" size={12} />
        </Button>
      </div>
      <DropdownMenu.Separator />

      <ScrollArea viewportClassName="max-h-[224px]">
        {values.map(value => (
          <DropdownMenu.Item key={value.id} onSelect={handleOnSelect(value)}>
            <div className="relative w-full pr-9 leading-none">
              <LabelMarker color={value.color} label={label.key} value={value.value} />
              {label.selectedValueId === value.id && (
                <Icon className="absolute right-0 top-1 text-icons-2" name="tick" size={12} />
              )}
            </div>
          </DropdownMenu.Item>
        ))}

        {isAllowAddNewValue && !!label?.isCustom && (
          <div className="flex items-center justify-between gap-x-5 px-2 py-[7px]">
            <LabelMarker color={label.color} label={label.key} value={searchState} />
            <Button
              className="h-auto flex-none gap-x-1 p-0"
              variant="link_accent"
              size="md_split"
              onClick={handleAddNewValue}
            >
              <Icon name="bold-plus" size={10} />
              {t('views:pullRequests.addValue', 'Add new value')}
            </Button>
          </div>
        )}

        {!values.length && !label?.isCustom && (
          <div className="flex w-full items-center justify-between gap-x-5">
            <LabelMarker color={label.color} label={label.key} value={searchState} />
            <span className="flex-none text-foreground-4">{t('views:pullRequests.noLabels', 'No labels found')}</span>
          </div>
        )}

        {!values.length && !!label?.isCustom && !isAllowAddNewValue && (
          <div className="px-5 py-4 text-center">
            <span className="leading-tight text-foreground-2">{t('views:pullRequests.addValue', 'Add new value')}</span>
          </div>
        )}
      </ScrollArea>
    </>
  )
}
