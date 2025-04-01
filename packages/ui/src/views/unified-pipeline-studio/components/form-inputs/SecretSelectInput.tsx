import { SecretInput } from '@views/secrets/secret-input/secret-input'
import { SecretCreationType } from '@views/secrets/types'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import { InputLabel, InputWrapper } from './common'
import { InputError } from './common/InputError'

const DEFAULT_PLACEHOLDER = 'Select secret value'

export interface SecretSelectInputConfig {
  inputType: 'secretSelect'
  onSecretClick?: () => void
  // Optional field type the secret value represents (text, password, etc.)
  valueType?: string
  placeholder?: string
  label?: string
  description?: string
  required?: boolean
}

// Extended props interface to include onSecretClick
interface SecretSelectInputProps extends InputProps<AnyFormikValue> {
  onSecretClick?: () => void
}

function SecretSelectInputInternal(props: SecretSelectInputProps): JSX.Element {
  const { readonly, path, input } = props
  const { label = '', required, description, placeholder } = input

  // Get the field controller
  const { field } = useController({
    name: path
  })

  const handleClick = () => {
    const secretClickHandler = props.onSecretClick || (input as unknown as SecretSelectInputConfig)?.onSecretClick
    if (typeof secretClickHandler === 'function') {
      secretClickHandler()
    }
  }

  const handleClear = () => {
    field.onChange('')
  }
  console.log(field)
  return (
    <InputWrapper>
      <InputLabel label={label} description={description} required={required} />
      <SecretInput
        value={
          field.value
            ? {
                id: field.value,
                name: field.value,
                secret: {
                  type: SecretCreationType.SECRET_TEXT,
                  name: field.value,
                  identifier: field.value,
                  tags: {},
                  description: '',
                  spec: {}
                }
              }
            : undefined
        }
        placeholder={placeholder || DEFAULT_PLACEHOLDER}
        onClick={handleClick}
        onClear={handleClear}
        renderValue={value => value.secret.identifier}
        disabled={readonly}
      />
      <InputError path={path} />
    </InputWrapper>
  )
}

export class SecretSelectInput extends InputComponent<AnyFormikValue> {
  public internalType = 'secretSelect'

  renderComponent(props: InputProps<AnyFormikValue>): JSX.Element {
    return <SecretSelectInputInternal {...(props as SecretSelectInputProps)} />
  }
}
