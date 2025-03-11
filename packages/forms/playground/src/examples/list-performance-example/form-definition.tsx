import { IFormDefinition, IInputDefinition } from '../../../../src'
import { InputConfigType, InputType } from '../../implementation/inputs/common/types'

type IInputConfigWithConfig = IInputDefinition & InputConfigType

export const defaultValues = {
  rootArray: new Array(5).fill({
    secondArray: new Array(5).fill({
      secondArrayProp: 'second',
      thirdArray: new Array(5).fill('third')
    })
  })
}

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: InputType.list,
    path: 'rootArray',
    label: 'First list',
    required: true,
    inputConfig: {
      inputs: [
        {
          inputType: InputType.text,
          label: 'First list prop',
          relativePath: 'firstArrayProp'
        },
        {
          inputType: InputType.list,
          relativePath: 'secondArray',
          label: 'Second list',
          required: true,
          inputConfig: {
            layout: 'grid',
            inputs: [
              {
                inputType: InputType.text,
                label: 'Second array prop',
                relativePath: 'secondArrayProp',
                required: true
              },
              {
                inputType: InputType.array,
                relativePath: 'thirdArray',
                label: 'Third array',
                required: true,
                inputConfig: {
                  input: {
                    inputType: InputType.text,
                    relativePath: 'thirdArrayProp1',
                    required: true,
                    label: 'Third array prop'
                  }
                }
              }
            ]
          }
        }
      ]
    }
  }
]

export const formDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
