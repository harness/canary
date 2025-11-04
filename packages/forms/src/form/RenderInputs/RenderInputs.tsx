import { InputComponentRenderer, type InputFactory } from '../../core'
import type { IInputDefinition } from '../../types'

export function RenderInputs(props: {
  items: IInputDefinition[]
  factory: InputFactory
  withoutWrapper?: boolean
}): JSX.Element {
  const { items, ...restProps } = props

  return (
    <>
      {items.map(input => (
        <InputComponentRenderer
          key={`${input.inputType}_${input.path}_${input.label}`}
          input={input}
          path={input.path}
          {...restProps}
        />
      ))}
    </>
  )
}
