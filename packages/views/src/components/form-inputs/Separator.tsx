import { InputComponent, type AnyFormikValue } from '@harnessio/forms'

import { Separator } from '../..'
import { InputType } from './types'

export interface SeparatorInputConfig {
  inputType: InputType.separator
}

function SeparatorInputInternal(): JSX.Element {
  return <Separator className="my-4" />
}

export class SeparatorInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.separator

  renderComponent(): JSX.Element {
    return <SeparatorInputInternal />
  }
}
