import { useMemo, useRef, useState } from 'react'

import { Button, DropdownMenu, IconV2, Link, LinkProps, SearchInput, Tag } from '@/components'
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
      <h5 className="text-2 text-cn-foreground-1 font-medium">{t('views:pullRequests.labels')}</h5>

      <DropdownMenu.Root onOpenChange={isOpen => !isOpen && handleCloseValuesView()}>
        <DropdownMenu.Trigger asChild>
          <Button iconOnly variant="ghost" size="sm">
            <IconV2 name="more-vert" size={12} />
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
          <DropdownMenu.Content>
            <DropdownMenu.Header>
              <SearchInput
                size="sm"
                autoFocus
                id="search"
                defaultValue={searchQuery}
                placeholder={t('views:pullRequests.searchLabels', 'Search labels')}
                onChange={handleSearchQuery}
              />
            </DropdownMenu.Header>

            {!!labelsListWithValues.length && (
              <>
                {labelsListWithValues?.map((label, idx) => (
                  <DropdownMenu.Item
                    key={`${label.id}-${idx}`}
                    onSelect={handleOnSelect(label)}
                    title={
                      <Tag
                        variant="secondary"
                        size="sm"
                        theme={label.color}
                        label={label.key}
                        value={(label.values?.length || '').toString()}
                      />
                    }
                    description={label.description}
                    checkmark={label.isSelected}
                  />
                ))}
              </>
            )}

            {!labelsListWithValues.length && (
              <span className="text-cn-foreground-2 block px-5 py-4 text-center leading-tight">
                {t('views:pullRequests.noLabels', 'No labels found')}
              </span>
            )}

            <DropdownMenu.Footer>
              <Link variant="secondary" {...editLabelsProps}>
                {t('views:pullRequests.editLabels', 'Edit labels')}
              </Link>
            </DropdownMenu.Footer>
          </DropdownMenu.Content>
        )}
      </DropdownMenu.Root>
    </article>
  )
}
