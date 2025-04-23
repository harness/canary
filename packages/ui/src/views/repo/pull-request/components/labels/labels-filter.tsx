import { useEffect } from 'react'

import { Checkbox } from '@components/checkbox'
import { DropdownMenu } from '@components/dropdown-menu'
import { Input } from '@components/input'
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
      <Input wrapperClassName="mx-3 mb-3" placeholder="Search..." onChange={e => onInputChange(e.target.value)} />
      {!isLabelsLoading &&
        labelOptions.map(option =>
          option.type === LabelType.DYNAMIC ? (
            <DropdownMenu.Sub key={option.id}>
              <DropdownMenu.SubTrigger
                className="cursor-pointer gap-x-2.5 py-2 pl-3 pr-2"
                onClick={() => {
                  const { [option.id]: selectedIdValue, ...rest } = value
                  const newValue = selectedIdValue ? rest : { ...value, [option.id]: true }
                  onChange(newValue)
                }}
              >
                <Checkbox checked={value[option.id] ? value[option.id] === true || 'indeterminate' : false} />
                <LabelMarker color={option.color} label={option.key} value={String(option.value_count)} />
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.RadioGroup
                  value={(() => {
                    const labelValue = value[option.id]
                    return labelValue === true ? ANY_LABEL_VALUE : labelValue
                  })()}
                  onValueChange={selectedValue => {
                    onChange({
                      ...value,
                      [option.id]: selectedValue === ANY_LABEL_VALUE || selectedValue
                    })
                  }}
                >
                  <DropdownMenu.RadioItem value={ANY_LABEL_VALUE} onSelect={e => e.preventDefault()}>
                    <LabelMarker color={option.color} label={option.key} value={ANY_LABEL_VALUE} />
                  </DropdownMenu.RadioItem>
                  {valueOptions[option.key]?.map(value => (
                    <DropdownMenu.RadioItem key={value.id} value={String(value.id)} onSelect={e => e.preventDefault()}>
                      <LabelMarker color={option.color} label={option.key} value={value.value} />
                    </DropdownMenu.RadioItem>
                  ))}
                </DropdownMenu.RadioGroup>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          ) : (
            <DropdownMenu.CheckboxItem
              className="pl-3"
              onSelect={e => e.preventDefault()}
              checked={value[option.id] === true}
              key={option.id}
              onCheckedChange={selectedValue => {
                onChange({
                  ...value,
                  [option.id]: selectedValue
                })
              }}
            >
              <LabelMarker color={option.color} label={option.key} />
            </DropdownMenu.CheckboxItem>
          )
        )}

      {description && <div className="text-cn-foreground-3 mx-2 my-4 text-sm">{description}</div>}
    </>
  )
}
