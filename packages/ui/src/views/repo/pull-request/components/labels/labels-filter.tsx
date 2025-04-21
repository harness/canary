import { useEffect } from 'react'

import { DropdownMenu } from '@components/dropdown-menu'
import { Input } from '@components/input'
import { ILabelType, LabelType, LabelValueType } from '@views/labels'
import { LabelMarker } from '@views/labels/components/label-marker'

export type LabelsValue = Record<
  string,
  | {
      isSelected: boolean
      value?: string
    }
  | undefined
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
  useEffect(() => {
    // Resetting the search query so that on re-open of the filter,
    // all options will be shown in-spite of older search query
    return () => {
      onInputChange('')
    }
  }, [onInputChange])

  return (
    <>
      <Input wrapperClassName="mx-3" placeholder="Search..." onChange={e => onInputChange(e.target.value)} />
      <DropdownMenu.Separator />
      {!isLabelsLoading &&
        labelOptions.map(option =>
          option.type === LabelType.DYNAMIC ? (
            <DropdownMenu.Sub key={option.id}>
              <DropdownMenu.SubTrigger className="py-2 pl-8 pr-2">
                <LabelMarker color={option.color} label={option.key} value={String(option.value_count)} />
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.RadioGroup
                  value={value[option.id]?.isSelected ? ANY_LABEL_VALUE : (value[option.id]?.value ?? '')}
                  onValueChange={selectedValue => {
                    if (selectedValue === ANY_LABEL_VALUE) {
                      onChange({
                        ...value,
                        [option.id]: {
                          isSelected: true
                        }
                      })
                    } else {
                      onChange({
                        ...value,
                        [option.id]: {
                          isSelected: false,
                          value: selectedValue
                        }
                      })
                    }
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
              onSelect={e => e.preventDefault()}
              checked={value[option.id]?.isSelected}
              key={option.id}
              onCheckedChange={selectedValue => {
                onChange({ ...value, [option.id]: { isSelected: selectedValue, value: value[option.id]?.value ?? '' } })
              }}
            >
              <LabelMarker color={option.color} label={option.key} />
            </DropdownMenu.CheckboxItem>
          )
        )}

      {!isLabelsLoading && labelOptions.length === 0 && (
        <div className="text-cn-foreground-3 mx-2 my-4 text-sm">No labels found</div>
      )}

      {isLabelsLoading && <div className="text-cn-foreground-3 mx-2 my-4 text-sm">Loading....</div>}
    </>
  )
}
