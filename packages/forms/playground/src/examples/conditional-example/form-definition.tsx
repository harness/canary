import { unsetEmptyStringOutputTransformer, type IFormDefinition, type IInputDefinition } from '../../../../src'
import { InputConfigType, InputType } from '../../implementation/inputs/common/types'

type IInputConfigWithConfig = IInputDefinition & InputConfigType

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: InputType.text,
    path: 'name',
    label: 'Name',
    outputTransform: unsetEmptyStringOutputTransformer()
  },
  {
    inputType: InputType.select,
    path: 'repoType',
    label: 'Repo type',
    inputConfig: {
      options: [
        { label: 'Inline', value: 'inline' },
        { label: 'Remote', value: 'remote' }
      ]
    }
  },
  {
    inputType: InputType.text,
    path: 'remoteRepo',
    label: 'Repo',
    isVisible: values => {
      return values.repoType === 'remote'
    }
  }
]

export const formDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
