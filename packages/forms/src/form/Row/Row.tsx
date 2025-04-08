import { InputComponentRenderer } from '../../core/components/InputComponentRenderer'
import type { InputFactory } from '../../core/factory/InputFactory'
import type { IInputDefinition } from '../../types/types'

//import { useRootFormikContext } from '../../core/context/RootFormikContext'

export interface InputRowProps {
  input: IInputDefinition
  factory: InputFactory
  autoExpandGroup?: boolean
}

export function Row({ input, factory, autoExpandGroup }: InputRowProps): React.ReactElement {
  const { prefix = '' } = {} //useRootFormikContext()

  return (
    <div>
      <InputComponentRenderer
        path={`${prefix}${input.path}`}
        factory={factory}
        readonly={false}
        input={input}
        autoExpandGroup={autoExpandGroup}
      />
    </div>
  )
}
