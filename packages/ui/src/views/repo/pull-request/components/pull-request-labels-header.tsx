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

interface LabelsWithValueType extends ILabelType {
  value?: LabelValueType['value']
  isCustom?: boolean
  valueId?: LabelValueType['id']
  isSelected: boolean
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
  const [showCustomValueForm, setShowCustomValueForm] = useState(false)

  const { search, handleSearchChange } = useDebounceSearch({
    handleChangeSearchValue: setSearchQuery,
    searchValue: searchQuery
  })

  const labelsListWithValues = useMemo(() => {
    return labelsList.flatMap(label => {
      const res: LabelsWithValueType[] = []

      const isCustom = label.type === LabelType.DYNAMIC
      const labelValues = labelsValues[label.key]
      const selectedLabel = selectedLabels.find(it => it.id === label.id)

      if (isCustom) {
        res.push({
          ...label,
          value: t('views:labelData.form.previewDynamicValue', '*can be added by users*'),
          isCustom: true,
          isSelected: false
        })
      }

      if (labelValues) {
        res.push(
          ...labelValues.map(value => ({
            ...label,
            value: value.value,
            color: value.color,
            valueId: value.id,
            isSelected: selectedLabel ? selectedLabel?.assigned_value?.id === value.id : false
          }))
        )
      }

      if (!isCustom && !labelValues) {
        res.push({
          ...label,
          isSelected: !!selectedLabel
        })
      }

      return res
    })
  }, [labelsList, labelsValues, selectedLabels])

  const handleOnSelect = (label: LabelsWithValueType) => (e: Event) => {
    e.preventDefault()

    if (label.isCustom) {
      setShowCustomValueForm(true)
      return
    }

    if (label.isSelected) {
      removeLabel?.(label.id)
    } else {
      addLabel?.({
        label_id: label.id,
        value_id: label?.valueId
      })
    }
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
          {showCustomValueForm ? (
            <Button onClick={() => setShowCustomValueForm(false)}>Cancel</Button>
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
                    <DropdownMenu.CheckboxItem
                      key={`${label.id}-${label?.valueId || idx}`}
                      checked={label.isSelected}
                      onSelect={handleOnSelect(label)}
                    >
                      <div className="flex flex-col gap-y-1.5">
                        <LabelMarker color={label.color} label={label.key} value={label?.value} />
                        {!!label?.description && <span className="text-foreground-4">{label.description}</span>}
                      </div>
                    </DropdownMenu.CheckboxItem>
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
