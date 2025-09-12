import { useMemo, useRef, useState } from 'react'

import {
  Button,
  DropdownMenu,
  IconV2,
  Link,
  LinkProps,
  SearchInput,
  Text,
  useSearchableDropdownKeyboardNavigation
} from '@/components'
import { useTranslation } from '@/context'
import {
  HandleAddLabelType,
  ILabelType,
  LabelAssignmentType,
  LabelTag,
  LabelType,
  LabelValuesType,
  TypesLabelAssignment,
  TypesScopesLabels
} from '@/views'
import { debounce, isEmpty } from 'lodash-es'

import { LabelValueSelector } from './label-value-selector'

const getSelectedValueId = (label?: LabelAssignmentType) => {
  if (!!label && 'assigned_value' in label) {
    return label.assigned_value?.id ?? undefined
  }
}

export interface LabelsWithValueType extends TypesLabelAssignment {
  isCustom?: boolean
  isSelected: boolean
  selectedValueId?: number
}

interface LabelsHeaderProps {
  assignableLabels: TypesScopesLabels
  labelsList: ILabelType[]
  labelsValues: LabelValuesType
  selectedLabels: LabelAssignmentType[]
  addLabel?: (data: HandleAddLabelType) => void
  editLabelsProps: LinkProps
  removeLabel?: (id: number) => void
  searchQuery?: string
  setSearchQuery?: (query: string) => void
  isLabelsLoading?: boolean
}

export const LabelsHeader = ({
  assignableLabels,
  selectedLabels,
  addLabel,
  editLabelsProps,
  removeLabel,
  searchQuery,
  setSearchQuery,
  isLabelsLoading
}: LabelsHeaderProps) => {
  const { t } = useTranslation()
  const [labelWithValuesToShow, setLabelWithValuesToShow] = useState<LabelsWithValueType | null>(null)

  const handleSearchQuery = (query: string) => {
    setSearchQuery?.(query)
  }

  const labelsListWithValues = useMemo(() => {
    return assignableLabels?.label_data?.map(label => {
      const isCustom = label.type === LabelType.DYNAMIC
      const selectedLabel = selectedLabels.find(it => it.id === label.id)

      let res: LabelsWithValueType = {
        ...label,
        isSelected: Boolean(selectedLabel),
        selectedValueId: getSelectedValueId(selectedLabel)
      }

      if (isCustom) {
        res = { ...res, isCustom: true }
      }

      return res
    })
  }, [assignableLabels, selectedLabels])

  const handleOnSelect = (label: LabelsWithValueType) => (e: Event) => {
    e.preventDefault()

    if (label.isCustom || !isEmpty(label?.values)) {
      setLabelWithValuesToShow(label)
      return
    }
    if (label.id) {
      handleAddOrRemoveLabel({ label_id: label.id }, label.isSelected)
    }
  }

  const handleAddOrRemoveLabel = (data: HandleAddLabelType, isSelected: boolean) => {
    if (isSelected) {
      removeLabel?.(data.label_id)
    } else {
      addLabel?.(data)
    }

    handleCloseValuesView()
  }

  const handleCloseValuesView = useRef(
    debounce(() => {
      setLabelWithValuesToShow(null)
      handleSearchQuery('')
    }, 300)
  ).current

  const { searchInputRef, handleSearchKeyDown, getItemProps } = useSearchableDropdownKeyboardNavigation({
    itemsLength: labelsListWithValues?.length ?? 0
  })

  return (
    <article className="flex items-center justify-between">
      <Text as="h5" variant="body-strong" color="foreground-1">
        {t('views:pullRequests.labels')}
      </Text>

      <DropdownMenu.Root onOpenChange={isOpen => !isOpen && handleCloseValuesView()}>
        <DropdownMenu.Trigger asChild>
          <Button iconOnly variant="ghost" size="sm" tooltipProps={{ content: 'Manage labels' }}>
            <IconV2 name="more-vert" size="2xs" />
          </Button>
        </DropdownMenu.Trigger>

        {labelWithValuesToShow && (
          <LabelValueSelector
            label={labelWithValuesToShow}
            handleAddOrRemoveLabel={handleAddOrRemoveLabel}
            onSearchClean={handleCloseValuesView}
          />
        )}

        {!labelWithValuesToShow && (
          <DropdownMenu.Content className="w-80" align="end" sideOffset={2}>
            <DropdownMenu.Header>
              <SearchInput
                ref={searchInputRef}
                size="sm"
                autoFocus
                id="search"
                defaultValue={searchQuery}
                placeholder={t('views:pullRequests.searchLabels', 'Search labels')}
                onChange={handleSearchQuery}
                onKeyDown={handleSearchKeyDown}
              />
            </DropdownMenu.Header>

            {!!isLabelsLoading && <DropdownMenu.Spinner />}

            {!isLabelsLoading &&
              labelsListWithValues?.map((label, idx) => {
                const { ref, onKeyDown } = getItemProps(idx)

                return (
                  <DropdownMenu.Item
                    key={`${label.id}-${idx}`}
                    ref={ref}
                    onSelect={handleOnSelect(label)}
                    title={
                      <LabelTag
                        scope={label.scope ?? 0}
                        theme={label.color}
                        label={label.key ?? ''}
                        value={(label.values?.length || '').toString()}
                        withIndicator={label.type === LabelType.DYNAMIC}
                      />
                    }
                    // TODO: add description when it is available from PR Labels call
                    // description={<Text truncate>{label.description}</Text>}
                    checkmark={label.isSelected}
                    onKeyDown={onKeyDown}
                  />
                )
              })}

            {isEmpty(labelsListWithValues) && !isLabelsLoading && (
              <DropdownMenu.NoOptions>{t('views:pullRequests.noLabels', 'No labels found')}</DropdownMenu.NoOptions>
            )}

            <DropdownMenu.Footer>
              <Link className="font-body-single-line-strong" variant="secondary" {...editLabelsProps}>
                {t('views:pullRequests.editLabels', 'Edit labels')}
              </Link>
            </DropdownMenu.Footer>
          </DropdownMenu.Content>
        )}
      </DropdownMenu.Root>
    </article>
  )
}
