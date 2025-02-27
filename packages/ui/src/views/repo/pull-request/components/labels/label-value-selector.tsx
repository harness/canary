import { FC, useMemo, useState } from 'react'

import { Button, DropdownMenu, Icon, LabelMarker, ScrollArea, SearchBox } from '@/components'
import { useDebounceSearch } from '@/hooks'
import { HandleAddLabelType, LabelValueType, TranslationStore } from '@/views'
import { wrapConditionalObjectElement } from '@utils/utils'

import { LabelsWithValueType } from './pull-request-labels-header'

export interface LabelValueSelectorProps {
  useTranslationStore: () => TranslationStore
  label: LabelsWithValueType
  handleAddOrRemoveLabel: (data: HandleAddLabelType, isSelected: boolean) => void
  onSearchClean: () => void
}

export const LabelValueSelector: FC<LabelValueSelectorProps> = ({
  useTranslationStore,
  label,
  handleAddOrRemoveLabel,
  onSearchClean
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
    <>
      <div className="relative px-2 py-1.5">
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
          <LabelMarker color={label.color} label={label.key} className="max-w-20 pr-2" />
        </SearchBox.Root>

        <Button
          className="absolute right-2 top-1.5 z-20 text-icons-1 hover:text-icons-2"
          size="icon"
          variant="custom"
          onClick={onSearchClean}
        >
          <Icon name="cross" size={12} />
        </Button>
      </div>

      {(isAllowAddNewValue || !!values.length) && <DropdownMenu.Separator />}

      <ScrollArea viewportClassName="max-h-[224px]">
        {values.map(value => (
          <DropdownMenu.Item key={value.id} onSelect={handleOnSelect(value)}>
            <div className="relative w-full pr-7">
              <LabelMarker color={value.color} label={label.key} value={value.value} />

              {label.selectedValueId === value.id && (
                <Icon className="absolute right-0 top-1 text-icons-2" name="tick" size={12} />
              )}
            </div>
          </DropdownMenu.Item>
        ))}

        {isAllowAddNewValue && !!label?.isCustom && !!values.length && <DropdownMenu.Separator />}

        {isAllowAddNewValue && !!label?.isCustom && (
          <>
            <span className="px-2 pb-1.5 pt-1 leading-[1.125rem] text-foreground-2">
              {t('views:pullRequests.addValue', 'Add new value')}
            </span>

            <DropdownMenu.Item onSelect={handleAddNewValue}>
              <LabelMarker color={label.color} label={label.key} value={searchState} />
            </DropdownMenu.Item>
          </>
        )}

        {!values.length && !label?.isCustom && (
          <span className="block flex-none gap-x-5 px-2 py-[7px] text-foreground-4">
            {t('views:pullRequests.labelNotFound', 'Label not found')}
          </span>
        )}
      </ScrollArea>
    </>
  )
}
