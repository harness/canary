import type { IFormDefinition, IInputDefinition } from '../../../../src'
import { InputConfigType, InputType } from '../../implementation/types/input-types'

type IInputConfigWithConfig = IInputDefinition & InputConfigType

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: InputType.text,
    path: 'input1',
    label: 'String input'
  },
  {
    inputType: InputType.number,
    path: 'input2',
    label: 'Integer input'
  },
  {
    inputType: InputType.boolean,
    path: 'input3',
    label: 'Checkbox input'
  }
]

export const formDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
