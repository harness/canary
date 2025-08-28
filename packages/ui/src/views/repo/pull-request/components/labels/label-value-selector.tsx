import { FC, useMemo, useState } from 'react'

import { Button, DropdownMenu, getScopeType, IconV2, scopeTypeToIconMap, SearchBox } from '@/components'
import { useTranslation } from '@/context'
import { useDebounceSearch } from '@/hooks'
import { wrapConditionalObjectElement } from '@/utils'
import { ColorsEnum, EnumLabelColor, HandleAddLabelType, LabelTag, TypesLabelValueInfo } from '@/views'

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
        values: [] as TypesLabelValueInfo[],
        isAllowAddNewValue: !!searchState.length
      }

    if (!searchState.length)
      return {
        values: label.values,
        isAllowAddNewValue: false
      }

    return label.values.reduce<{
      values: TypesLabelValueInfo[]
      isAllowAddNewValue: boolean
    }>(
      (acc, item) => {
        const lowerCaseSearchState = searchState.toLowerCase()
        const lowerCaseValue = item.value?.toLowerCase()

        if (lowerCaseValue?.includes(lowerCaseSearchState)) {
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

  const handleOnSelect = (value: TypesLabelValueInfo) => (e: Event) => {
    e.preventDefault()

    handleAddOrRemoveLabel({ label_id: label.id ?? -1, value_id: value?.id ?? -1 }, label.selectedValueId === value.id)
  }

  const handleAddNewValue = () => {
    if (!searchState.length) return

    handleAddOrRemoveLabel({ label_id: label.id ?? -1, value: searchState }, false)
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
    <DropdownMenu.Content className="w-80" align="end" sideOffset={2} alignOffset={0}>
      <DropdownMenu.Header className="relative">
        <SearchBox.Root
          autoFocus
          className="w-full"
          inputClassName="pl-1.5 pr-8"
          placeholder={getSearchBoxPlaceholder()}
          value={search}
          handleChange={handleSearchChange}
          showOnFocus
          hasSearchIcon={false}
          {...wrapConditionalObjectElement({ maxLength: 50 }, !!label?.isCustom)}
        >
          <div className="pr-2">
            <LabelTag
              scope={label.scope ?? 0}
              color={label.color as ColorsEnum}
              labelKey={label.key ?? ''}
              tagProps={{
                className: 'max-w-20',
                size: 'sm'
              }}
            />
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
          tag={{
            variant: 'secondary',
            size: 'sm',
            theme: value.color as EnumLabelColor,
            value: value.value ?? ''
          }}
          checkmark={label.selectedValueId === value.id}
        />
      ))}

      {isAllowAddNewValue && !!label?.isCustom && !!values.length && <DropdownMenu.Separator />}

      {isAllowAddNewValue && !!label?.isCustom && (
        <DropdownMenu.Group label={t('views:pullRequests.addValue', 'Add new value')}>
          <DropdownMenu.Item
            className="[&>.cn-dropdown-menu-base-item]:gap-0"
            onSelect={handleAddNewValue}
            tag={{
              variant: 'secondary',
              size: 'sm',
              theme: label.color,
              value: searchState,
              label: label.key,
              icon: scopeTypeToIconMap[getScopeType(label.scope ?? 0)],
              className: 'grid grid-flow-col',
              labelClassName: 'grid grid-flow-col',
              valueClassName: 'grid grid-flow-col content-center'
            }}
          />
        </DropdownMenu.Group>
      )}

      {!values.length && !label?.isCustom && (
        <DropdownMenu.NoOptions>{t('views:pullRequests.labelNotFound', 'Label not found')}</DropdownMenu.NoOptions>
      )}
    </DropdownMenu.Content>
  )
}
