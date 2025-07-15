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
  Select: withForm(Select) as <T = string>(
    props: FormSelectProps<T> & { ref?: ForwardedRef<HTMLButtonElement> }
  ) => ReactElement,
  MultiSelect: withForm(MultiSelect)
}

type FormSelectProps<T = string> = Omit<SelectProps<T>, 'onChange'> & WithFormProps

export { FormInput, FormSelectProps }
