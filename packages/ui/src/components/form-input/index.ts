import { FormMultiSelect, type FormMultiSelectPropsType } from './components/form-multi-select-v2'
import { FormTextInput, type FormTextInputPropsType } from './components/form-text-input'
import { FormTextarea } from './components/form-textarea'

const FormInput = {
  Text: FormTextInput,
  MultiSelect: FormMultiSelect,
  Textarea: FormTextarea
}

export { FormInput, type FormTextInputPropsType, type FormMultiSelectPropsType }
