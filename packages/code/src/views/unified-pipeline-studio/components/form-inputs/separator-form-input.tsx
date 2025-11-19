import { IInputDefinition, InputComponent, type AnyFormValue } from '@harnessio/forms'
import { Separator } from '@harnessio/ui/components'

export type SeparatorFormInputDefinition = IInputDefinition<unknown, AnyFormValue, 'separator'>

function SeparatorInputInternal(): JSX.Element {
  return <Separator />
}

export class SeparatorFormInput extends InputComponent<AnyFormValue> {
  public internalType = 'separator'

  renderComponent(): JSX.Element {
    return <SeparatorInputInternal />
  }
}
