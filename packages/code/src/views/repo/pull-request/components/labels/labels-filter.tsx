import { useEffect, useRef, useState } from 'react'

import { ColorsEnum, ILabelType, LabelTag, LabelValueType } from '@views/labels'

import { CounterBadge, DropdownMenu, SearchInput, Text } from '@harnessio/ui/components'

export type LabelsValue = Record<
  string,
  {
    labelText: string
    valueId?: string
    valueText?: string
    color?: ColorsEnum
  }
>

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
        inputContainerClassName="w-auto mx-cn-2xs my-cn-xs"
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
              title={<LabelTag theme={option.color} label={option.key} value={String(option.value_count)} />}
              checked={value[option.id]?.valueId ? 'indeterminate' : !!value[option.id]}
              subMenuProps={{
                open: open[option.id] as boolean,
                onOpenChange: open => setOpen(prev => ({ ...prev, [option.id]: open }))
              }}
              subContentProps={{
                onFocus: () => updateFocusState(option.id, 'subcontent', true),
                onBlur: () => updateFocusState(option.id, 'subcontent', false)
              }}
              onCheckedChange={() => {
                const { [option.id]: selectedValue, ...rest } = value
                const newValue =
                  selectedValue?.valueId || selectedValue
                    ? rest
                    : {
                        ...value,
                        [option.id]: {
                          labelText: option.key,
                          color: option.color
                        }
                      }
                onChange(newValue)
              }}
            >
              <DropdownMenu.RadioGroup
                value={value[option.id]?.valueId || (value[option.id] ? ANY_LABEL_VALUE : undefined)}
                onValueChange={selectedValue => {
                  let newValue: LabelsValue[keyof LabelsValue] = {
                    labelText: option.key,
                    color: option.color
                  }

                  if (selectedValue !== ANY_LABEL_VALUE) {
                    newValue = {
                      ...newValue,
                      valueId: String(selectedValue),
                      valueText: selectedValue
                    }
                  }

                  onChange({ ...value, [option.id]: newValue })
                }}
              >
                <DropdownMenu.RadioItem
                  value={ANY_LABEL_VALUE}
                  title={<LabelTag theme={option.color} label={option.key} value={ANY_LABEL_VALUE} />}
                />
                {valueOptions[option.key]?.map(value => (
                  <DropdownMenu.RadioItem
                    key={value.id}
                    value={String(value.id)}
                    title={<LabelTag theme={value.color} label={option.key} value={value.value} />}
                  />
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.CheckboxItem>
          ) : (
            <DropdownMenu.CheckboxItem
              title={<LabelTag theme={option.color} value={option.key} />}
              checked={!!value[option.id]}
              key={option.id}
              onCheckedChange={selectedValue => {
                if (selectedValue) {
                  onChange({
                    ...value,
                    [option.id]: {
                      labelText: option.key,
                      color: option.color
                    }
                  })
                } else {
                  const { [option.id]: _, ...rest } = value
                  onChange(rest)
                }
              }}
            />
          )
        )}

      {description && (
        <Text color="foreground-3" className="mx-cn-xs my-cn-md">
          {description}
        </Text>
      )}
    </>
  )
}

export function getParserConfig(labelOptions: ILabelType[], valueOptions: Record<string, LabelValueType[]>) {
  return {
    parse: (value: string): LabelsValue => {
      const result: LabelsValue = {}

      if (!value) return result

      value.split(';').forEach(entry => {
        const [key, valueStr = ''] = entry.split(':')
        const labelDetails = labelOptions.find(label => String(label.id) === key) || { key: '', color: undefined }
        const valueDetails = valueOptions[labelDetails.key]?.find(value => String(value.id) === valueStr) || {
          value: ''
        }
        if (!key) return
        result[key] = valueStr
          ? { labelText: labelDetails.key, color: labelDetails.color, valueId: valueStr, valueText: valueDetails.value }
          : { labelText: labelDetails.key, color: labelDetails.color }
      })

      return result
    },
    serialize: (value?: LabelsValue): string => {
      const parts = Object.entries(value ?? {})
        .map(([key, val]) => {
          if (!val) return ''
          return !val.valueId ? `${key}` : `${key}:${val.valueId}`
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
  const selectedLabels = Object.entries(selectedValue ?? {}).filter(([_, value]) => value)
  if (!selectedLabels.length) return ''

  const [labelId, labelValue] = selectedLabels[0]

  const label = labelOptions.find(l => String(l.id) === labelId) || {
    key: labelValue.labelText,
    color: labelValue.color
  }

  const value = valueOptions[label?.key || '']?.find(v => String(v.id) === labelValue.valueId) || {
    value: labelValue.valueText
  }

  // If label text is not available, show the label marker
  const CNT_BAGDE_THRESHOLD = label.key ? 1 : 0

  return (
    <div className="flex w-max items-center gap-cn-3xs">
      {label.key && label.color && (
        <LabelTag key={labelId} theme={label.color} label={label.key} value={value?.value || ''} />
      )}

      {selectedLabels.length > CNT_BAGDE_THRESHOLD && (
        <CounterBadge>{`+ ${selectedLabels.length - CNT_BAGDE_THRESHOLD}`}</CounterBadge>
      )}
    </div>
  )
}
LabelsFilter.displayName = 'LabelsFilter'
