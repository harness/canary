import { forOwn } from 'lodash-es'

import { IFormDefinition, IInputDefinition } from '@harnessio/forms'

import { Pipeline } from '../../../types/pipeline-schema'

export interface PipelineInput<T = unknown> {
  type: 'string' | 'number' | 'secret' | 'boolean'
  default?: T
  enum?: T[]
  pattern?: string
}

export function createFormFromPipelineInputs(pipeline: Pipeline): IFormDefinition {
  const inputs: IInputDefinition[] = []

  const pipelineInputs = pipeline?.pipeline?.inputs
  if (pipelineInputs) {
    forOwn(pipelineInputs, (pipelineInput, pipelineInputKey) => {
      inputs.push(createFormInputFromPipelineInput(pipelineInput as PipelineInput, pipelineInputKey))
    })
  }

  return { inputs }
}

export function createFormInputFromPipelineInput<T>(input: PipelineInput<T>, name: string): IInputDefinition {
  const type = input.type

  // TODO: check if enum can hold number value
  // NOTE: if input contains enum we use select input
  if (input.enum) {
    return {
      label: name,
      inputType: 'select',
      path: name,
      inputConfig: {
        options: input.enum.map(item => ({ label: item, value: item }))
      }
    }
  }

  switch (type) {
    case 'string': {
      return {
        label: name,
        inputType: 'text',
        path: name
      }
    }
    case 'boolean': {
      return {
        label: name,
        inputType: 'boolean',
        path: name
      }
    }
    default: {
      return {
        label: name,
        inputType: 'text',
        path: name
      }
    }
  }
}
