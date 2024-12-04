import { isEmpty } from 'lodash-es'

import type { InputComponent } from '../components/InputComponent'

export interface IInputFactoryProps {
  allowOverride: boolean
}

export class InputOverrideError extends Error {
  constructor(inputType: string) {
    super(`Input component '${inputType}' is already registered.`)
  }
}

export class InputFactory {
  private componentBank: Map<string, InputComponent<unknown>>
  private allowOverride: boolean

  constructor(options?: IInputFactoryProps) {
    this.allowOverride = options?.allowOverride ?? false
    this.componentBank = new Map()
  }

  /**
   * Register input
   *
   * @param component - instance of input component
   * @throws Throws `InputOverrideError` if register two component with the same inputType (and if allowOverride is false)
   */
  registerComponent<T>(component: InputComponent<T>): void {
    if (!this.allowOverride && !!this.getComponent(component.internalType)) {
      throw new InputOverrideError(component.internalType)
    }

    this.componentBank.set(component.internalType, component as InputComponent<unknown>)
  }

  getComponent<T>(internalType?: string): InputComponent<T> | undefined {
    if (internalType && !isEmpty(internalType)) {
      return this.componentBank.get(internalType) as InputComponent<T>
    }
    return
  }
}
