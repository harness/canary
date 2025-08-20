import { useEffect, useRef, useState } from 'react'

import { CounterBadge } from '@components/counter-badge'
import { DropdownMenu } from '@components/dropdown-menu'
import { SearchInput } from '@components/inputs'
import { ILabelType, LabelValueType } from '@views/labels'
import { LabelMarker } from '@views/labels/components/label-marker'

export type LabelsValue = Record<string, true | string>

const ANY_LABEL_VALUE = 'any'

export interface LabelsFilterProps {
  isLabelsLoading: boolean
  labelOptions: ILabelType[]
  valueOptions: Record<string, LabelValueType[]>
  onChange: (value: LabelsValue) => void
  value?: LabelsValue
  onInputChange: (value: string) => void
}

export function LabelsFilter({
  isLabelsLoading,
  labelOptions,
  valueOptions,
  onChange,
  value = {},
  onInputChange
}: LabelsFilterProps) {
  const description =
    !isLabelsLoading && labelOptions.length === 0 ? 'No labels found' : isLabelsLoading ? 'Loading...' : ''

  const [open, setOpen] = useState<Record<number, boolean>>({})
  // Use refs to track focus state to ensure we always have the latest values
  const focusStateRef = useRef<Record<number, { parent: boolean; subcontent: boolean }>>({})

  // Common function to update focus state
  const updateFocusState = (id: number, type: 'parent' | 'subcontent', isFocused: boolean) => {
    focusStateRef.current = {
      ...focusStateRef.current,
      [id]: {
        ...focusStateRef.current[id],
        [type]: isFocused
      }
    }

    // If focus is lost, check after a short delay if we should close the dropdown
    if (!isFocused) {
      setTimeout(() => {
        const currentFocusState = focusStateRef.current[id] || { parent: false, subcontent: false }

        if (!currentFocusState.parent && !currentFocusState.subcontent) {
          setOpen(prev => ({ ...prev, [id]: false }))
        }
      }, 100) // Small timeout to ensure focus state is updated correctly
    }
  }

  useEffect(() => {
    // Resetting the search query so that on re-open of the filter,
    // all options will be shown in-spite of older search query
    return () => {
      onInputChange('')
    }
  }, [onInputChange])

  return (
    <>
      <SearchInput
        inputContainerClassName="w-auto mx-1.5 mt-2 mb-2.5"
        onChange={value => onInputChange(value)}
        placeholder="Search..."
        onKeyDown={e => e.stopPropagation()}
      />
      {!isLabelsLoading &&
        labelOptions.map(option =>
          option.value_count > 0 ? (
            <DropdownMenu.CheckboxItem
              key={option.id}
              onBlur={() => updateFocusState(option.id, 'parent', false)}
              onFocus={() => updateFocusState(option.id, 'parent', true)}
              title={<LabelMarker color={option.color} label={option.key} value={String(option.value_count)} />}
              checked={value[option.id] ? value[option.id] === true || 'indeterminate' : false}
              subMenuProps={{
                open: open[option.id] as boolean,
                onOpenChange: open => setOpen(prev => ({ ...prev, [option.id]: open }))
              }}
              subContentProps={{
                onFocus: () => updateFocusState(option.id, 'subcontent', true),
                onBlur: () => updateFocusState(option.id, 'subcontent', false)
              }}
              onCheckedChange={() => {
                const { [option.id]: selectedIdValue, ...rest } = value
                const newValue = selectedIdValue ? rest : { ...value, [option.id]: true }
                onChange(newValue)
              }}
            >
              <DropdownMenu.RadioGroup
                value={(() => {
                  const labelValue = value[option.id]
                  return labelValue === true ? ANY_LABEL_VALUE : labelValue
                })()}
                onValueChange={selectedValue => {
                  onChange({ ...value, [option.id]: selectedValue === ANY_LABEL_VALUE || selectedValue })
                }}
              >
                <DropdownMenu.RadioItem
                  value={ANY_LABEL_VALUE}
                  title={<LabelMarker color={option.color} label={option.key} value={ANY_LABEL_VALUE} />}
                />
                {valueOptions[option.key]?.map(value => (
                  <DropdownMenu.RadioItem
                    key={value.id}
                    value={String(value.id)}
                    title={<LabelMarker color={option.color} label={option.key} value={value.value} />}
                  />
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.CheckboxItem>
          ) : (
            <DropdownMenu.CheckboxItem
              title={<LabelMarker color={option.color} label={option.key} />}
              checked={value[option.id] === true}
              key={option.id}
              onCheckedChange={selectedValue => {
                onChange({ ...value, [option.id]: selectedValue })
              }}
            />
          )
        )}

      {description && <div className="mx-2 my-4 text-sm text-cn-foreground-3">{description}</div>}
    </>
  )
}

export function getParserConfig() {
  return {
    parse: (value: string): LabelsValue => {
      const result: LabelsValue = {}

      value.split(';').forEach(entry => {
        const [key, valueStr = ''] = entry.split(':')
        if (!key) return
        result[key] = valueStr === 'true' ? true : valueStr
      })

      return result
    },
    serialize: (value: LabelsValue): string => {
      const parts = Object.entries(value)
        .map(([key, val]) => {
          if (!val) return ''
          return `${key}:${val}`
        })
        .filter(Boolean)

      return `${parts.join(';')}`
    }
  }
}

export interface FilterLabelRendererProps {
  selectedValue?: LabelsValue
  labelOptions: ILabelType[]
  valueOptions: Record<string, LabelValueType[]>
}

export function filterLabelRenderer({ selectedValue, labelOptions, valueOptions }: FilterLabelRendererProps) {
  const labelValuesArr = Object.entries(selectedValue ?? {}).filter(([_, value]) => value)
  const [firstKey, firstValue] = labelValuesArr[0] || []
  if (!firstValue) return ''

  const labelDetails = labelOptions.find(label => String(label.id) === firstKey)
  const valueDetails = valueOptions[labelDetails?.key ?? '']?.find(value => String(value.id) === firstValue)

  const remainingLabelValues = labelValuesArr.length - 1
  return (
    <div className="flex w-max items-center gap-1">
      {labelDetails && (
        <LabelMarker
          key={firstKey}
          color={labelDetails.color}
          label={labelDetails.key}
          value={valueDetails?.value || ''}
        />
      )}

      {remainingLabelValues > 0 && <CounterBadge>{`+ ${remainingLabelValues}`}</CounterBadge>}
    </div>
  )
}
