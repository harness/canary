import { FormCheckbox, type FormCheckboxPropsType } from './components/form-checkbox'
import { FormMultiSelect, type FormMultiSelectPropsType } from './components/form-multi-select-v2'
import { FormNumberInput, type FormNumberInputPropsType } from './components/form-number-input'
import { FormRadio, type FormRadioPropsType } from './components/form-radio'
import { FormTextInput, type FormTextInputPropsType } from './components/form-text-input'
import { FormTextarea } from './components/form-textarea'

const FormInput = {
  Text: FormTextInput,
  MultiSelect: FormMultiSelect,
  Textarea: FormTextarea,
  Number: FormNumberInput,
  Radio: FormRadio,
  Checkbox: FormCheckbox
}

export {
  FormInput,
  type FormTextInputPropsType,
  type FormMultiSelectPropsType,
  type FormNumberInputPropsType,
  type FormRadioPropsType,
  type FormCheckboxPropsType
}
