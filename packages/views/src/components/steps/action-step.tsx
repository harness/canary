import {
  arrayToObjectOutputTransformer,
  IFormDefinition,
  objectToArrayInputTransformer,
  unsetEmptyArrayOutputTransformer,
  unsetEmptyStringOutputTransformer
} from '@harnessio/forms'

import { InputConfigType, InputType } from '../form-inputs/types'
import { ACTION_STEP_IDENTIFIER, IInputConfigWithConfig } from './types'

export const ACTION_STEP_DESCRIPTION = 'Action step description.'

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: InputType.text,
    path: `${ACTION_STEP_IDENTIFIER}.uses`,
    label: 'Uses',
    outputTransform: unsetEmptyStringOutputTransformer()
  },
  {
    inputType: InputType.list,
    path: `${ACTION_STEP_IDENTIFIER}.with`,
    label: 'With',
    inputConfig: {
      layout: 'grid',
      inputs: [
        {
          inputType: InputType.text,
          relativePath: 'key',
          label: 'Key',
          outputTransform: unsetEmptyStringOutputTransformer()
        },
        {
          inputType: InputType.text,
          relativePath: 'value',
          label: 'Value',
          outputTransform: unsetEmptyStringOutputTransformer()
        }
      ]
    },
    inputTransform: objectToArrayInputTransformer(),
    outputTransform: arrayToObjectOutputTransformer({ unsetIfEmpty: true })
  },
  {
    inputType: InputType.list,
    path: `${ACTION_STEP_IDENTIFIER}.env`,
    label: 'Environment',
    inputConfig: {
      layout: 'grid',
      inputs: [
        {
          inputType: InputType.text,
          relativePath: 'key',
          label: 'Key',
          outputTransform: unsetEmptyStringOutputTransformer()
        },
        {
          inputType: InputType.text,
          relativePath: 'value',
          label: 'Value',
          outputTransform: unsetEmptyStringOutputTransformer()
        }
      ]
    },
    inputTransform: objectToArrayInputTransformer(),
    outputTransform: arrayToObjectOutputTransformer({ unsetIfEmpty: true })
  },
  {
    inputType: InputType.list,
    path: `${ACTION_STEP_IDENTIFIER}.report`,
    label: 'Report',
    description: 'Report uploads reports at the provided paths',
    inputConfig: {
      layout: 'grid',
      inputs: [
        {
          inputType: InputType.select,
          relativePath: 'type',
          label: 'Type',
          inputConfig: {
            options: [
              { label: 'junit', value: 'junit' },
              { label: 'xunit', value: 'xunit' },
              { label: 'nunit', value: 'nunit' }
            ]
          }
        },
        {
          inputType: InputType.text,
          relativePath: 'path',
          label: 'Path'
        }
      ]
    },
    outputTransform: unsetEmptyArrayOutputTransformer()
  }
]

export const actionStepFormDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
