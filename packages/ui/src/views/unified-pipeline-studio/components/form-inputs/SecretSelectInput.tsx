import { MouseEvent } from 'react'

import { Button } from '@components/button'
import { Icon } from '@components/icon'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import { InputLabel, InputWrapper } from './common'
import { InputError } from './common/InputError'

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

  // Handle click on the field - trigger the secret drawer/dialog
  const handleClick = (_e: MouseEvent<HTMLButtonElement>) => {
    // Get the onSecretClick function from props or from input config
    const secretClickHandler = props.onSecretClick || (input as unknown as SecretSelectInputConfig)?.onSecretClick

    // Call the handler if it exists
    if (typeof secretClickHandler === 'function') {
      secretClickHandler()
    }
  }

  return (
    <InputWrapper>
      <InputLabel label={label} description={description} required={required} />
      <Button
        variant="outline"
        className="w-full justify-between text-left font-normal"
        disabled={readonly}
        onClick={handleClick}
        {...field}
        type="button" // Prevent form submission
      >
        <span>{field.value || placeholder || `Select secret value`}</span>
        <Icon name="lock" className="size-4" />
      </Button>
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
