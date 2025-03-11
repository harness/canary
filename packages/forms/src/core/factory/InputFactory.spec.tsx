import type { AnyFormikValue } from '../../types/types'
import { InputComponent, InputProps } from '../components/InputComponent'
import { InputFactory, InputOverrideError } from './InputFactory'

class TestInputComponent extends InputComponent<AnyFormikValue> {
  public internalType = 'test-input'

  renderComponent(_props: InputProps<any, { inputConfig?: unknown }>): JSX.Element {
    return <></>
  }
}

describe('Input factory tests', () => {
  test('input register', () => {
    const factory = new InputFactory()

    factory.registerComponent(new TestInputComponent())

    expect(factory.getComponent('test-input')?.internalType).toBe('test-input')
  })

  test('allow input override', () => {
    const factory = new InputFactory({ allowOverride: true })

    factory.registerComponent(new TestInputComponent())
    const override = () => {
      factory.registerComponent(new TestInputComponent())
    }

    expect(override).not.toThrow()
  })

  test('thrown an error on input override', () => {
    const factory = new InputFactory()

    factory.registerComponent(new TestInputComponent())
    const override = () => {
      factory.registerComponent(new TestInputComponent())
    }

    expect(override).toThrow(InputOverrideError)
  })
})
