import { forwardRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { MultiSelect, type MultiSelectOption, type MultiSelectRef } from '@/components/multi-select-v2'

interface FormMultiSelectV2PropsType
  extends Omit<React.ComponentPropsWithoutRef<typeof MultiSelect>, 'value' | 'onChange'> {
  name: string
}

const FormMultiSelectV2 = forwardRef<MultiSelectRef, FormMultiSelectV2PropsType>((props, ref) => {
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
  )
})

FormMultiSelectV2.displayName = 'FormInput.MultiSelectV2'

export { FormMultiSelectV2 }
export type { FormMultiSelectV2PropsType }
