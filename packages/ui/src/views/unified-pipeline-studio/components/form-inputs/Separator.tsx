import { FormSeparator } from '@components/form-primitives'

import { InputComponent, type AnyFormikValue } from '@harnessio/forms'

import { InputType } from './types'

export interface SeparatorInputConfig {
  inputType: InputType.separator
}

function SeparatorInputInternal(): JSX.Element {
  return <FormSeparator className="my-4" />
}

export class SeparatorInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.separator

  renderComponent(): JSX.Element {
    return <SeparatorInputInternal />
  }
}
