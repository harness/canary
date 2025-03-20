import { FormSeparator } from '@components/form-primitives'

import { InputComponent, type AnyFormikValue } from '@harnessio/forms'

export interface SeparatorInputConfig {
  inputType: 'separator'
}

function SeparatorInputInternal(): JSX.Element {
  return <FormSeparator className="my-4" />
}

export class SeparatorInput extends InputComponent<AnyFormikValue> {
  public internalType = 'separator'

  renderComponent(): JSX.Element {
    return <SeparatorInputInternal />
  }
}
