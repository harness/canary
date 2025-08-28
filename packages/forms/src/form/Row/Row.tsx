import { InputComponentRenderer } from '../../core/components/InputComponentRenderer'
import type { InputFactory } from '../../core/factory/InputFactory'
import type { IInputDefinition } from '../../types/types'

//import { useRootFormikContext } from '../../core/context/RootFormikContext'

export interface InputRowProps {
  input: IInputDefinition
  factory: InputFactory
  withoutWrapper?: boolean
}

export function Row({ input, factory, withoutWrapper = false }: InputRowProps): React.ReactElement {
  const { prefix = '' } = {} //useRootFormikContext()

  if (withoutWrapper) {
    return <InputComponentRenderer path={`${prefix}${input.path}`} factory={factory} readonly={false} input={input} />
  }

  return (
    <div>
      <InputComponentRenderer path={`${prefix}${input.path}`} factory={factory} readonly={false} input={input} />
    </div>
  )
}
