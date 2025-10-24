import type { IInputDefinition } from '../../types/types'
import type { InputFactory } from '../factory/InputFactory'

export interface InputProps<TValue, TDef = unknown> {
  initialValues?: TValue
  onUpdate?: (data: TValue) => void
  onChange?: (data: TValue) => void
  factory: InputFactory
  path: string
  readonly?: boolean
  input: IInputDefinition<TDef, TValue>
}

export abstract class InputComponent<TValue> {
  public abstract internalType: string

  getType(): string {
    return this.internalType
  }

  abstract renderComponent(props: InputProps<TValue>): JSX.Element
}
