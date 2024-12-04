import React from 'react'

import { InputComponentRenderer } from '../../core/components/InputComponentRenderer'
import type { InputFactory } from '../../core/factory/InputFactory'
import type { IInputDefinition } from '../../types/types'

//import { useRootFormikContext } from '../../core/context/RootFormikContext'

export interface InputRowProps {
  input: IInputDefinition
  factory: InputFactory
}

export function Row({ input, factory }: InputRowProps): React.ReactElement {
  const { prefix = '' } = {} //useRootFormikContext()

  return (
    <div>
      <InputComponentRenderer path={`${prefix}${input.path}`} factory={factory} readonly={false} input={input} />
    </div>
  )
}
