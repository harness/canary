import { forwardRef, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { MultiSelect, type MultiSelectOption, type MultiSelectRef } from '@/components/multi-select-v2'
import { Field } from '@components/stacked-list'

interface FormMultiSelectV2PropsType
  extends Omit<React.ComponentPropsWithoutRef<typeof MultiSelect>, 'value' | 'onChange'> {
  name: string
}

const FormMultiSelectV2 = forwardRef<MultiSelectRef, FormMultiSelectV2PropsType>((props, ref) => {
  const formContext = useFormContext()

  const selectRef = useRef<MultiSelectRef | null>(null)

  const setRefs = (element: MultiSelectRef | null) => {
    // Save to local ref
    selectRef.current = element

    // Forward to external ref
    if (typeof ref === 'function') {
      ref(element)
    } else if (ref) {
      ref.current = element
    }
  }

  // Only access the component if it is inside FormProvider component tree
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
          field.ref(element?.input || null)
        }
        console.log('field.value', field.value)

        return (
          <MultiSelect
            {...props}
            ref={setFieldRef}
            value={field.value}
            onChange={(options: MultiSelectOption[]) => {
              console.log('options', options)
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
