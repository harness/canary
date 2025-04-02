import { InputComponent, type AnyFormikValue } from '@harnessio/forms'

import { Separator } from '../form-field-set'
import { InputType } from './types'

function SeparatorInputInternal(): JSX.Element {
  return <Separator className="my-4" />
}

export class SeparatorInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.separator

  renderComponent(): JSX.Element {
    return <SeparatorInputInternal />
  }
}
