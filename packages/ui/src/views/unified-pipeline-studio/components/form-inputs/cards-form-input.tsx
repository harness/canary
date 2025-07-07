import { CardSelect } from '@components/index'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import { InputLabel, InputWrapper } from './common'
import { InputCaption } from './common/InputCaption'
import { RuntimeInputConfig } from './types/types'

export interface CardOption {
  label: string
  description: string
  value: string | boolean
  id: string
  title: string
}

export interface CardsFormInputConfig {
  inputType: 'cards'
  inputConfig: {
    options: CardOption[]
    tooltip?: string
  } & RuntimeInputConfig
}

type CardsFormInputProps = InputProps<AnyFormikValue, CardsFormInputConfig>

function CardsFormInputInternal(props: CardsFormInputProps): JSX.Element {
  const { path, input } = props
  const { label, required, description, inputConfig, readonly } = input
  const options = inputConfig?.options ?? []

  const { field, fieldState } = useController({
    name: path,
    disabled: readonly
  })

  return (
    <InputWrapper {...props}>
      <InputLabel label={label} required={required} />
      <CardSelect.Root type="single" value={field.value} onValueChange={field.onChange} disabled={readonly}>
        {options.map(option => (
          <CardSelect.Item value={option.value} key={option.value?.toString()}>
            <CardSelect.Title>{option.label}</CardSelect.Title>
            <CardSelect.Description>{option.description}</CardSelect.Description>
          </CardSelect.Item>
        ))}
      </CardSelect.Root>
      <InputCaption error={fieldState?.error?.message} caption={description} />
    </InputWrapper>
  )
}

export class CardsFormInput extends InputComponent<AnyFormikValue> {
  public internalType = 'cards'

  renderComponent(props: CardsFormInputProps): JSX.Element {
    return <CardsFormInputInternal {...props} />
  }
}
