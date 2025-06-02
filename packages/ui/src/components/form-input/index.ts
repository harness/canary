import { Checkbox } from '@components/checkbox'
import { Textarea } from '@components/form-primitives'
import { NumberInput, TextInput } from '@components/inputs'
import { Radio } from '@components/radio'

import { withForm } from './components/form-hoc'
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
  MultiSelect: FormMultiSelect
}

export { FormInput }
