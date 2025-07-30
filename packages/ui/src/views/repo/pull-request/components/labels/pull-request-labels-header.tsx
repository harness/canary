import { useMemo, useRef, useState } from 'react'

import { Button, DropdownMenu, IconV2, Link, LinkProps, SearchInput, Text } from '@/components'
import { useTranslation } from '@/context'
import {
  HandleAddLabelType,
  ILabelType,
  LabelAssignmentType,
  LabelType,
  LabelValuesType,
  LabelValueType
} from '@/views'
import { debounce } from 'lodash-es'

import { LabelValueSelector } from './label-value-selector'

const getSelectedValueId = (label?: LabelAssignmentType) => {
  if (!!label && 'assigned_value' in label) {
    return label.assigned_value?.id ?? undefined
  }
}

export interface LabelsWithValueType extends ILabelType {
  values?: LabelValueType[]
  isCustom?: boolean
  isSelected: boolean
  selectedValueId?: number
}

interface LabelsHeaderProps {
  labelsList: ILabelType[]
  labelsValues: LabelValuesType
  selectedLabels: LabelAssignmentType[]
  addLabel?: (data: HandleAddLabelType) => void
  editLabelsProps: LinkProps
  removeLabel?: (id: number) => void
  searchQuery?: string
  setSearchQuery?: (query: string) => void
}

export const LabelsHeader = ({
  labelsList,
  labelsValues,
  selectedLabels,
  addLabel,
  editLabelsProps,
  removeLabel,
  searchQuery,
  setSearchQuery
}: LabelsHeaderProps) => {
  const { t } = useTranslation()
  const [labelWithValuesToShow, setLabelWithValuesToShow] = useState<LabelsWithValueType | null>(null)

  const handleSearchQuery = (query: string) => {
    setSearchQuery?.(query)
  }

  const labelsListWithValues = useMemo(() => {
    return labelsList.map(label => {
      const isCustom = label.type === LabelType.DYNAMIC
      const selectedLabel = selectedLabels.find(it => it.id === label.id)
      const labelValues = labelsValues[label.key]

      let res: LabelsWithValueType = {
        ...label,
        isSelected: !!selectedLabel,
        selectedValueId: getSelectedValueId(selectedLabel)
      }

      if (isCustom) {
        res = { ...res, isCustom: true }
      }

      if (labelValues) {
        res = { ...res, values: labelValues }
      }

      return res
    })
  }, [labelsList, labelsValues, selectedLabels])

  const handleOnSelect = (label: LabelsWithValueType) => (e: Event) => {
    e.preventDefault()

    if (label.isCustom || !!label?.values?.length) {
      setLabelWithValuesToShow(label)
      return
    }

    handleAddOrRemoveLabel({ label_id: label.id }, label.isSelected)
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

  return (
    <article className="flex items-center justify-between">
      <Text as="h5" variant="body-strong" color="foreground-1">
        {t('views:pullRequests.labels')}
      </Text>

      <DropdownMenu.Root onOpenChange={isOpen => !isOpen && handleCloseValuesView()}>
        <DropdownMenu.Trigger asChild>
          <Button iconOnly variant="ghost" size="sm">
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
          <DropdownMenu.Content className="w-80" align="end" sideOffset={-6} alignOffset={10}>
            <DropdownMenu.Header>
              <SearchInput
                size="sm"
                autoFocus
                id="search"
                defaultValue={searchQuery}
                placeholder={t('views:search.searchPlaceholder', 'Search')}
                onChange={handleSearchQuery}
              />
            </DropdownMenu.Header>

            {labelsListWithValues?.map((label, idx) => (
              <DropdownMenu.Item
                key={`${label.id}-${idx}`}
                onSelect={handleOnSelect(label)}
                tag={{
                  variant: 'secondary',
                  size: 'sm',
                  theme: label.color,
                  label: label.key,
                  value: (label.values?.length || '').toString()
                }}
                description={<Text truncate>{label.description}</Text>}
                checkmark={label.isSelected}
              />
            ))}

            {!labelsListWithValues.length && (
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
