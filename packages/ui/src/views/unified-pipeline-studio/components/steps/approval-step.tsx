import {
  arrayToObjectOutputTransformer,
  IFormDefinition,
  objectToArrayInputTransformer,
  unsetEmptyStringOutputTransformer
} from '@harnessio/forms'

import { InputConfigType } from '../form-inputs/types'
import { APPROVAL_STEP_IDENTIFIER, IInputConfigWithConfig } from './types'

export const APPROVAL_STEP_DESCRIPTION = 'Approval step description.'

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: 'text',
    path: `${APPROVAL_STEP_IDENTIFIER}.uses`,
    label: 'Uses',
    outputTransform: unsetEmptyStringOutputTransformer()
  },
  // TODO: check this - width has following type with?: Record<string, any>;
  {
    inputType: 'list',
    path: `${APPROVAL_STEP_IDENTIFIER}.with`,
    label: 'With',
    inputConfig: {
      layout: 'grid',
      inputs: [
        {
          inputType: 'text',
          relativePath: 'key',
          label: 'Key',
          outputTransform: unsetEmptyStringOutputTransformer()
        },
        {
          inputType: 'text',
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
    inputType: 'list',
    path: `${APPROVAL_STEP_IDENTIFIER}.env`,
    label: 'Environment',
    inputConfig: {
      layout: 'grid',
      inputs: [
        {
          inputType: 'text',
          relativePath: 'key',
          label: 'Key',
          outputTransform: unsetEmptyStringOutputTransformer()
        },
        {
          inputType: 'text',
          relativePath: 'value',
          label: 'Value',
          outputTransform: unsetEmptyStringOutputTransformer()
        }
      ]
    },
    inputTransform: objectToArrayInputTransformer(),
    outputTransform: arrayToObjectOutputTransformer({ unsetIfEmpty: true })
  }
]

export const approvalStepFormDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
