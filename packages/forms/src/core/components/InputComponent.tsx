import type { IInputDefinition } from '../../types/types'
import type { InputFactory } from '../factory/InputFactory'

export interface InputProps<T, K extends { inputConfig?: unknown } = { inputConfig?: unknown }> {
  initialValues?: T
  onUpdate?: (data: T) => void
  onChange?: (data: T) => void
  factory: InputFactory
  path: string
  readonly?: boolean
  input: IInputDefinition<K['inputConfig']>
}

export abstract class InputComponent<T> {
  public abstract internalType: string

  getType(): string {
    return this.internalType
  }

  abstract renderComponent(props: InputProps<T>): JSX.Element
}
