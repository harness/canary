import { IFormDefinition } from '@harnessio/forms'

export const formDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'text',
      path: 'identifier',
      label: 'Identifier',
      placeholder: 'Enter identifier',
      required: true
    },
    {
      inputType: 'text',
      path: 'name',
      label: 'Name',
      placeholder: 'Enter name',
      required: true
    },
    {
      inputType: 'group',
      path: 'inputsGroup',
      label: 'Inputs',
      inputs: [
        {
          inputType: 'text',
          path: 'inputs.input1',
          label: 'Input 1',
          placeholder: 'Enter value'
        },
        {
          inputType: 'text',
          path: 'inputs.input2',
          label: 'Input 2',
          placeholder: 'Enter value'
        }
      ]
    },
    {
      inputType: 'group',
      path: 'stagesGroup',
      label: 'Stages',
      inputs: [
        {
          inputType: 'text',
          path: 'stages.stage1',
          label: 'Stage 1',
          placeholder: 'Enter stage value'
        }
      ]
    }
  ]
}
