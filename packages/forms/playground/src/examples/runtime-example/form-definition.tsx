import * as z from 'zod'

import type { IFormDefinition, IInputDefinition } from '../../../../src'
import { InputConfigType, InputType } from '../../implementation/inputs/common/types'

type IInputConfigWithConfig = IInputDefinition & InputConfigType

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: InputType.text,
    path: 'input1',
    label: 'Enter number - runtime test',
    required: true,
    validation: {
      schema: z.string().refine(
        val => {
          return /^\d+$/.test(val)
        },
        {
          message: 'Value is not a integer'
        }
      )
    }
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
  },
  {
    inputType: InputType.select,
    path: 'input4',
    label: 'Select input',
    inputConfig: {
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ],
      runtime: true,
      expression: true
    }
  }
]

export const formDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
