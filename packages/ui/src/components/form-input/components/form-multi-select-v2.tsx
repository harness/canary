import { forwardRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { MultiSelect, MultiSelectOption, MultiSelectProps, MultiSelectRef } from '@/components'

interface FormMultiSelectPropsType extends Omit<MultiSelectProps, 'value' | 'onChange'> {
  name: string
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
    <Controller
      name={props.name}
      control={formContext.control}
      render={({ field, fieldState }) => {
        const setFieldRef = (element: MultiSelectRef | null) => {
          setRefs(element)
          field.ref = setRefs
        }

        return (
          <MultiSelect
            {...props}
            error={props?.error || fieldState?.error?.message}
            ref={setFieldRef}
            value={field.value}
            onChange={(options: MultiSelectOption[]) => {
              field.onChange(options)
            }}
          />
        )
      }}
    />
  )
})

FormMultiSelect.displayName = 'FormInput.MultiSelect'

export { FormMultiSelect }
export type { FormMultiSelectPropsType }
