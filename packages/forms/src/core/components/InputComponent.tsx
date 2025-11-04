import type { IInputDefinition } from '../../types/types'
import type { InputFactory } from '../factory/InputFactory'

export interface InputProps<TValue, TConfig = unknown> {
  initialValues?: TValue
  onUpdate?: (data: TValue) => void
  onChange?: (data: TValue) => void
  factory: InputFactory
  path: string
  readonly?: boolean
  disabled?: boolean
  warning?: string
  input: Omit<IInputDefinition<TConfig, TValue>, 'readonly' | 'disabled'>
}

export abstract class InputComponent<TValue> {
  public abstract internalType: string

  getType(): string {
    return this.internalType
  }

  abstract renderComponent(props: InputProps<TValue>): JSX.Element
}
