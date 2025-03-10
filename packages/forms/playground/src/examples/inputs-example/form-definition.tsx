import type { IFormDefinition, IInputDefinition } from '../../../../src'
import { InputConfigType, InputType } from '../../implementation/inputs/common/types'

type IInputConfigWithConfig = IInputDefinition & InputConfigType

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: InputType.text,
    path: 'input1',
    label: 'String input'
  },
  {
    inputType: InputType.integer,
    path: 'input2',
    label: 'Integer input'
  },
  {
    inputType: InputType.checkbox,
    path: 'input3',
    label: 'Checkbox input'
  }
]

export const formDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
