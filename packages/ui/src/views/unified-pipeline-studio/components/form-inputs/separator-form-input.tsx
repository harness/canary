import { Separator } from '@components/separator'

import { InputComponent, type AnyFormikValue } from '@harnessio/forms'

export interface SeparatorFormInputConfig {
  inputType: 'separator'
}

function SeparatorInputInternal(): JSX.Element {
  return <Separator />
}

export class SeparatorFormInput extends InputComponent<AnyFormikValue> {
  public internalType = 'separator'

  renderComponent(): JSX.Element {
    return <SeparatorInputInternal />
  }
}
