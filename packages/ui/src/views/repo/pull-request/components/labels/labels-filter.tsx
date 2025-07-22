import { useEffect } from 'react'

import { CounterBadge } from '@components/counter-badge'
import { DropdownMenu } from '@components/dropdown-menu'
import { SearchInput } from '@components/inputs'
import { ILabelType, LabelType, LabelValueType } from '@views/labels'
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
      />
      {!isLabelsLoading &&
        labelOptions.map(option =>
          option.type === LabelType.DYNAMIC ? (
            <DropdownMenu.CheckboxItem
              key={option.id}
              title={<LabelMarker color={option.color} label={option.key} value={String(option.value_count)} />}
              checked={value[option.id] ? value[option.id] === true || 'indeterminate' : false}
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
  const labelValuesArr = Object.entries(selectedValue ?? {})
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
