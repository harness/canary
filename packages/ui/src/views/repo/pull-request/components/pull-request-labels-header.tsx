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
  values?: LabelValueType[]
  isCustom?: boolean
  isSelected?: boolean
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
    return labelsList.map(label => {
      const isCustom = label.type === LabelType.DYNAMIC
      const labelValues = labelsValues[label.key]
      const selectedLabel = selectedLabels.find(it => it.id === label.id)

      let res: LabelsWithValueType = { ...label, isSelected: !!selectedLabel }

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

  const handleOnSelect = (label: LabelsWithValueType, valueId?: number) => (e: Event) => {
    e.preventDefault()

    if (label.isCustom) {
      setShowCustomValueForm(true)
      return
    }

    addLabel?.({
      label_id: label.id,
      value_id: valueId
    })
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-14 text-foreground-1 font-medium">{t('views:pullRequests.labels')}</span>
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
                    <DropdownMenu.Item key={`${label.id}-${idx}`} onSelect={handleOnSelect(label)}>
                      <div className="relative flex w-full flex-col items-start justify-start gap-y-1.5">
                        <LabelMarker
                          color={label.color}
                          label={label.key}
                          value={label?.values?.length.toString() || (label.isCustom ? '+' : undefined)}
                        />
                        {!!label?.description && <span className="text-foreground-4">{label.description}</span>}
                        {label.isSelected && <Icon className="absolute right-0 top-1" name="checkbox" size={12} />}
                      </div>
                    </DropdownMenu.Item>
                  ))}
                </ScrollArea>
              ) : (
                <div className="px-5 py-4 text-center">
                  <span className="text-foreground-2 leading-tight">
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
