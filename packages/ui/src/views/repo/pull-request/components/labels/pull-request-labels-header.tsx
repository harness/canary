import { useMemo, useState } from 'react'

import { Button, DropdownMenu, Icon, LabelMarker, ScrollArea, SearchBox } from '@/components'
import { useDebounceSearch } from '@/hooks'
import {
  HandleAddLabelType,
  ILabelType,
  LabelAssignmentType,
  LabelType,
  LabelValuesType,
  LabelValueType,
  TranslationStore
} from '@/views'

import { LabelValueSelector } from './label-value-selector'

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
  removeLabel?: (id: number) => void
  searchQuery?: string
  setSearchQuery?: (query: string) => void
  useTranslationStore: () => TranslationStore
}

const LabelsHeader = ({
  labelsList,
  labelsValues,
  selectedLabels,
  addLabel,
  removeLabel,
  searchQuery,
  setSearchQuery,
  useTranslationStore
}: LabelsHeaderProps) => {
  const { t } = useTranslationStore()
  const [labelWithValuesToShow, setLabelWithValuesToShow] = useState<LabelsWithValueType | null>(null)

  const { search, handleSearchChange } = useDebounceSearch({
    handleChangeSearchValue: setSearchQuery,
    searchValue: searchQuery
  })

  const labelsListWithValues = useMemo(() => {
    return labelsList.map(label => {
      const isCustom = label.type === LabelType.DYNAMIC
      const selectedLabel = selectedLabels.find(it => it.id === label.id)
      const labelValues = labelsValues[label.key]

      let res: LabelsWithValueType = {
        ...label,
        isSelected: !!selectedLabel,
        selectedValueId:
          !!selectedLabel && selectedLabel?.assigned_value ? selectedLabel?.assigned_value?.id || undefined : undefined
      }

      if (isCustom) {
        res = {
          ...res,
          isCustom: true
        }
      }

      if (labelValues) {
        res = {
          ...res,
          values: labelValues
        }
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

  const handleCloseValuesView = () => {
    setLabelWithValuesToShow(null)
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-14 font-medium text-foreground-1">{t('views:pullRequests.labels')}</span>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button
            className="text-icons-1 hover:text-icons-2 data-[state=open]:text-icons-2"
            size="icon"
            variant="custom"
          >
            <Icon name="vertical-ellipsis" size={12} />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          className="w-80"
          align="end"
          sideOffset={-6}
          alignOffset={10}
          onCloseAutoFocus={event => event.preventDefault()} // Prevent focus on hidden content
        >
          {labelWithValuesToShow ? (
            <LabelValueSelector
              useTranslationStore={useTranslationStore}
              label={labelWithValuesToShow}
              handleAddOrRemoveLabel={handleAddOrRemoveLabel}
              onClose={handleCloseValuesView}
            />
          ) : (
            <>
              {!!setSearchQuery && (
                <>
                  <div className="px-2 py-1.5">
                    <SearchBox.Root
                      className="w-full"
                      placeholder={t('views:pullRequests.searchLabels', 'Search labels')}
                      value={search}
                      handleChange={handleSearchChange}
                      showOnFocus
                    />
                  </div>
                  <DropdownMenu.Separator />
                </>
              )}

              {labelsListWithValues.length ? (
                <ScrollArea viewportClassName="max-h-[224px]">
                  {labelsListWithValues?.map((label, idx) => (
                    <DropdownMenu.Item key={`${label.id}-${idx}`} onSelect={handleOnSelect(label)}>
                      <div className="relative flex w-full flex-col items-start justify-start gap-y-1.5 pr-9">
                        <div className="flex items-center gap-x-2">
                          <LabelMarker
                            color={label.color}
                            label={label.key}
                            value={label?.values?.length.toString() || (label.isCustom ? '+' : undefined)}
                          />
                          {!!label.isCustom && <Icon className="flex-none text-icons-4" name="circle-plus" size={11} />}
                        </div>
                        {!!label?.description && (
                          <span className="w-full truncate text-foreground-4">{label.description}</span>
                        )}
                        {label.isSelected && (
                          <Icon className="absolute right-0 top-1 text-icons-2" name="tick" size={12} />
                        )}
                      </div>
                    </DropdownMenu.Item>
                  ))}
                </ScrollArea>
              ) : (
                <div className="px-5 py-4 text-center">
                  <span className="leading-tight text-foreground-2">
                    {t('views:pullRequests.noLabels', 'No labels found')}
                  </span>
                </div>
              )}
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

export { LabelsHeader }
