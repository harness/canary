import { FC, useMemo, useState } from 'react'

import {
  Button,
  DropdownMenu,
  getScopeType,
  IconV2,
  scopeTypeToIconMap,
  SearchInput,
  useSearchableDropdownKeyboardNavigation
} from '@/components'
import { useTranslation } from '@/context'
import { wrapConditionalObjectElement } from '@/utils'
import { EnumLabelColor, HandleAddLabelType, LabelTag, TypesLabelValueInfo } from '@/views'

import { LabelsWithValueType } from './pull-request-labels-header'

export interface LabelValueSelectorProps {
  label: LabelsWithValueType
  handleAddOrRemoveLabel: (data: HandleAddLabelType, isSelected: boolean) => void
  onSearchClean: () => void
}

export const LabelValueSelector: FC<LabelValueSelectorProps> = ({ label, handleAddOrRemoveLabel, onSearchClean }) => {
  const { t } = useTranslation()
  const [searchState, setSearchState] = useState('')

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

  const { searchInputRef, handleSearchKeyDown, getItemProps } = useSearchableDropdownKeyboardNavigation({
    itemsLength: values.length + (isAllowAddNewValue && !!label?.isCustom ? 1 : 0)
  })

  const { ref: refForNewValue, onKeyDown: onKeyDownForNewValue } = useMemo(() => getItemProps(values.length), [values])

  return (
    <DropdownMenu.Content className="w-80" align="end" sideOffset={2}>
      <DropdownMenu.Header>
        <SearchInput
          ref={searchInputRef}
          size="sm"
          autoFocus
          id="search"
          defaultValue={searchState}
          onChange={setSearchState}
          placeholder={getSearchBoxPlaceholder()}
          onKeyDown={handleSearchKeyDown}
          suffix={
            <Button iconOnly size="xs" variant="transparent" onClick={onSearchClean} ignoreIconOnlyTooltip>
              <IconV2 name="xmark" size="2xs" />
            </Button>
          }
          prefix={
            // to avoid styles from .cn-input-prefix
            <div className="contents">
              <LabelTag
                wrapperClassName="ml-cn-xs"
                scope={label.scope ?? 0}
                theme={label.color}
                value={label.key ?? ''}
                className="max-w-20"
              />
            </div>
          }
          {...wrapConditionalObjectElement({ maxLength: 50 }, !!label?.isCustom)}
        />
      </DropdownMenu.Header>

      {values.map((value, idx) => {
        const { ref, onKeyDown } = getItemProps(idx)

        return (
          <DropdownMenu.Item
            key={value.id}
            ref={ref}
            onSelect={handleOnSelect(value)}
            tag={{
              variant: 'secondary',
              size: 'sm',
              theme: value.color as EnumLabelColor,
              value: value.value ?? ''
            }}
            checkmark={label.selectedValueId === value.id}
            onKeyDown={onKeyDown}
          />
        )
      })}

      {isAllowAddNewValue && !!label?.isCustom && !!values.length && <DropdownMenu.Separator />}

      {isAllowAddNewValue && !!label?.isCustom && (
        <DropdownMenu.Group label={t('views:pullRequests.addValue', 'Add new value')}>
          <DropdownMenu.Item
            ref={refForNewValue}
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
            onKeyDown={onKeyDownForNewValue}
          />
        </DropdownMenu.Group>
      )}

      {!values.length && (!label?.isCustom || (!!label?.isCustom && !isAllowAddNewValue)) && (
        <DropdownMenu.NoOptions>{t('views:pullRequests.labelNotFound', 'Label not found')}</DropdownMenu.NoOptions>
      )}
    </DropdownMenu.Content>
  )
}
