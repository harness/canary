import { IFormDefinition, IInputDefinition } from '../../../../src'
import { InputConfigType, InputType } from '../../implementation/types/input-types'

type IInputConfigWithConfig = IInputDefinition & InputConfigType

export const defaultValues = {
  rootList: new Array(5).fill({
    secondList: new Array(5).fill({
      secondListProp: 'second',
      thirdArray: new Array(5).fill('third')
    })
  })
}

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: InputType.list,
    path: 'rootList',
    label: 'First list',
    required: true,
    inputConfig: {
      inputs: [
        {
          inputType: InputType.text,
          label: 'First list prop',
          relativePath: 'firstListProp'
        },
        {
          inputType: InputType.list,
          relativePath: 'secondList',
          label: 'Second list',
          required: true,
          inputConfig: {
            layout: 'grid',
            inputs: [
              {
                inputType: InputType.text,
                label: 'Second list prop',
                relativePath: 'secondListProp',
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
