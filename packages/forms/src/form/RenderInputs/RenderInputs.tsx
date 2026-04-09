import { InputComponentRenderer, type InputFactory } from '../../core'
import type { IInputDefinition } from '../../types'

export interface RenderInputsProps {
  items: IInputDefinition[]
  factory: InputFactory
  withoutWrapper?: boolean
  className?: string
}

export function RenderInputs(props: RenderInputsProps): JSX.Element {
  const { items, className, withoutWrapper = true, ...restProps } = props

  const content = items.map(input => (
    <InputComponentRenderer key={`${input.inputType}_${input.path}`} input={input} path={input.path} {...restProps} />
  ))

  if (withoutWrapper) {
    return <>{content}</>
  }

  return <div className={className}>{content}</div>
}

RenderInputs.displayName = 'RenderInputs'
