import type { InputFactory } from '../../core/factory/InputFactory'
import type { IInputDefinition } from '../../types/types'
import { Row } from '../Row/Row'

export function RenderInputs(props: { items: IInputDefinition[]; factory: InputFactory }): JSX.Element {
  const { items, factory } = props

  return (
    <>
      {items.map(input => {
        const key = `${input.inputType}_${input.path}_${input.label}`
        return <Row key={key} input={input} factory={factory} />
      })}
    </>
  )
}
