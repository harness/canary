import { ForwardedRef, ReactElement } from 'react'

import { Checkbox, MultiSelect, NumberInput, Radio, Select, SelectProps, Textarea, TextInput } from '@/components'

import { withForm, WithFormProps } from './components/form-hoc'

const FormInput = {
  Text: withForm(TextInput),
  Textarea: withForm(Textarea),
  Number: withForm(NumberInput),
  Radio: withForm(Radio.Root, ({ field }) => ({
    onValueChange: field.onChange
  })),
  Checkbox: withForm(Checkbox, ({ field }) => ({
    checked: field.value,
    onCheckedChange: field.onChange
  })),
  /**
   * Unlike other inputs, Select component's internal state is a generic type T,
   * which is defined by the consumer of the component. Therefore, we need to
   * explicitly define the type of the returned component here to ensure type safety.
   *
   * The `as` casting is necessary because `withForm` returns a generic component
   * that doesn't inherently carry the specific type information of Select.
   * By casting it, we inform TypeScript about the expected props and ref types.
   *
   * This ensures that when consumers use `FormInput.Select`, they get proper
   * type checking and IntelliSense support for the Select component's props,
   * including the generic type T.
   */
  Select: withForm(Select) as <T = string>(
    props: FormSelectProps<T> & { ref?: ForwardedRef<HTMLButtonElement> }
  ) => ReactElement,
  MultiSelect: withForm(MultiSelect)
}

type FormSelectProps<T = string> = Omit<SelectProps<T>, 'onChange'> & WithFormProps

export { FormInput, FormSelectProps }
