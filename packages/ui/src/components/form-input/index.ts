import { Checkbox } from '@components/checkbox'
import { Select, SelectProps, Textarea } from '@components/form-primitives'
import { NumberInput, TextInput } from '@components/inputs'
import { Radio } from '@components/radio'

import { withForm, WithFormProps } from './components/form-hoc'
import { FormMultiSelect } from './components/form-multi-select-v2'

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
  Select: withForm(Select, ({ field }) => ({
    onSelectedChange: field.onChange
  })) as <T = string>(
    props: FormSelectProps<T> & { ref?: React.ForwardedRef<HTMLButtonElement> }
  ) => React.ReactElement,
  MultiSelect: FormMultiSelect
}

type FormSelectProps<T = string> = Omit<SelectProps<T>, 'onChange'> &
  WithFormProps & {
    onChange?: SelectProps<T>['onSelectedChange']
  }

export { FormInput, FormSelectProps }
