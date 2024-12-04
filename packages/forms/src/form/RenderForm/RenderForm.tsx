import React from 'react'

import type { InputFactory } from '../../core/factory/InputFactory'
import type { IFormDefinition } from '../../types/types'
import { RenderInputs } from '../RenderInputs/RenderInputs'

export interface RenderFormProps {
  inputs: IFormDefinition
  factory: InputFactory
  className?: string
}

export const RenderForm = React.forwardRef<HTMLDivElement, RenderFormProps>((props, ref): React.ReactElement => {
  const { inputs, className, factory } = props

  return (
    <div className={className} ref={ref}>
      {inputs.hero}
      <RenderInputs items={inputs.inputs} factory={factory} />
    </div>
  )
})
