import { forwardRef, Fragment } from 'react'

import type { InputFactory } from '../../core/factory/InputFactory'
import type { IFormDefinition } from '../../types/types'
import { RenderInputs } from '../RenderInputs/RenderInputs'

export interface RenderFormProps {
  inputs: IFormDefinition
  factory: InputFactory
  className?: string
  withoutWrapper?: boolean
}

export const RenderForm = forwardRef<HTMLDivElement, RenderFormProps>((props, ref): React.ReactElement => {
  const { inputs, className, factory, withoutWrapper } = props

  if (withoutWrapper) {
    return (
      <Fragment>
        {inputs.hero}
        <RenderInputs items={inputs.inputs} factory={factory} withoutWrapper={withoutWrapper} />
      </Fragment>
    )
  }
  return (
    <div className={className} ref={ref}>
      {inputs.hero}
      <RenderInputs items={inputs.inputs} factory={factory} withoutWrapper={withoutWrapper} />
    </div>
  )
})
RenderForm.displayName = 'RenderForm'
