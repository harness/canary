import { RuntimeInputConfig } from '@views/unified-pipeline-studio'
import { cloneDeep, forOwn } from 'lodash-es'
import * as z from 'zod'

import { IInputDefinition, unsetEmptyStringOutputTransformer } from '@harnessio/forms'

/** pipeline inputs to form inputs conversion */
export function pipelineInputs2FormInputs(
  pipelineInputs: Record<string, any>,
  options: { prefix?: string }
): IInputDefinition[] {
  const formInputs: IInputDefinition[] = []

  forOwn(pipelineInputs, (value, key) => {
    const formInput = pipelineInput2FormInput(key, value, options)
    formInputs.push(formInput)
  })

  return formInputs
}

/** pipeline input to form input conversion */
export function pipelineInput2FormInput(
  name: string,
  inputProps: Record<string, unknown>,
  options: { prefix?: string }
): IInputDefinition<{ tooltip?: string } & RuntimeInputConfig> {
  const inputType = pipelineInputType2FormInputType(inputProps.type as string)

  return {
    inputType,
    path: options.prefix + name,
    label: name,
    default: inputProps.default,
    required: inputProps.required as boolean,
    inputConfig: {
      allowedValueTypes: ['fixed', 'runtime', 'expression'],
      ...(inputProps.description ? { tooltip: inputProps.description as string } : {})
    },
    outputTransform:
      inputType === 'text'
        ? unsetEmptyStringOutputTransformer()
        : // @TODO: this is a temporary solution - need to handle for all scenarios
          inputType === 'connector'
          ? value => ({
              value: value?.connectorIdWithScope
            })
          : undefined,
    ...(typeof inputProps.pattern === 'string'
      ? {
          validation: {
            schema: z
              .any()
              .optional()
              .refine(
                value => new RegExp(inputProps.pattern as string).test(value ?? ''),
                `Value does not match ${inputProps.pattern} pattern`
              )
          }
        }
      : {})
  }
}

/** pipeline input type to form input type conversion */
function pipelineInputType2FormInputType(type: string) {
  switch (type) {
    case 'string':
      return 'text'
    default:
      return type
  }
}

export function pipelineInputs2JsonSchema(pipelineInputs: Record<string, any>): Record<string, any> {
  const required: string[] = []

  const inputsProperties = cloneDeep(pipelineInputs)
  forOwn(inputsProperties, (input, propName) => {
    if (input.required) required.push(propName)
  })

  const schema = {
    type: 'object',
    properties: {
      inputs: {
        type: 'object',
        properties: inputsProperties,
        required,
        additionalProperties: false
      }
    },
    additionalProperties: false
  }

  return schema
}
