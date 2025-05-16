import { forwardRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Caption, Label } from '@/components'
import { MultiSelect, type MultiSelectOption, type MultiSelectRef } from '@/components/multi-select-v2'

interface FormMultiSelectPropsType
  extends Omit<React.ComponentPropsWithoutRef<typeof MultiSelect>, 'value' | 'onChange'> {
  name: string
  label?: string
  caption?: string
}

const FormMultiSelect = forwardRef<MultiSelectRef, FormMultiSelectPropsType>((props, ref) => {
  const formContext = useFormContext()

  const setRefs = (element: MultiSelectRef | null) => {
    if (typeof ref === 'function') {
      ref(element)
    } else if (ref) {
      ref.current = element
    }
  }

  if (!formContext) {
    throw new Error(
      'FormMultiSelectV2 must be used within a FormProvider context through FormWrapper. Use the standalone MultiSelectV2 component if form integration is not required.'
    )
  }
  return (
    <>
      {props.label ? <Label className="mb-2">{props.label}</Label> : null}
      <Controller
        name={props.name}
        control={formContext.control}
        render={({ field }) => {
          const setFieldRef = (element: MultiSelectRef | null) => {
            setRefs(element)
            field.ref = setRefs
          }

          return (
            <MultiSelect
              {...props}
              ref={setFieldRef}
              value={field.value}
              onChange={(options: MultiSelectOption[]) => {
                field.onChange(options)
              }}
            />
          )
        }}
      />
      {props.caption ? (
        <Caption className={props.caption ? 'text-cn-foreground-disabled' : ''}>{props.caption}</Caption>
      ) : null}
    </>
  )
})

FormMultiSelect.displayName = 'FormInput.MultiSelect'

export { FormMultiSelect }
export type { FormMultiSelectPropsType }
