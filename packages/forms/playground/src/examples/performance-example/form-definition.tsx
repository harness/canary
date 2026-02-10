import { IFormDefinition, IInputDefinition } from '../../../../src'
import { InputConfigType, InputType } from '../../implementation/inputs/common/types'

type IInputConfigWithConfig = IInputDefinition & InputConfigType

const inputs: IInputConfigWithConfig[] = new Array(500).fill(0).map((_, idx) => {
  const isOdd = idx % 2 === 1
  const prevInputIndex = idx - 1

  return {
    inputType: InputType.text,
    label: 'Input ' + idx,
    path: 'input' + idx,
    required: true,
    // Add isVisible to odd inputs that depends on previous input value
    ...(isOdd &&
      prevInputIndex >= 0 && {
        isVisible: (values: any) => {
          const prevInputValue = values[`input${prevInputIndex}`]
          return prevInputValue !== '123'
        }
      })
  }
})

export const formDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
