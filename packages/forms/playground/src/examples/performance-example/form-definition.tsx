import { IFormDefinition, IInputDefinition } from '../../../../src'
import { InputConfigType, InputType } from '../../implementation/inputs/common/types'

type IInputConfigWithConfig = IInputDefinition & InputConfigType

const inputs: IInputConfigWithConfig[] = new Array(100).fill(0).map((_, idx) => ({
  inputType: InputType.text,
  label: 'Input ' + idx,
  path: 'input' + idx,
  required: true
}))

export const formDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
