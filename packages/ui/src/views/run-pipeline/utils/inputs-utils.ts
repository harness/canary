import { RuntimeInputConfig } from '@views/unified-pipeline-studio'
import { cloneDeep, forOwn } from 'lodash-es'
import * as z from 'zod'

import { IInputDefinition, unsetEmptyStringOutputTransformer } from '@harnessio/forms'

import { type InputLayout } from './types'

/** pipeline inputs to form inputs conversion */
export function pipelineInputs2FormInputs({
  pipelineInputs,
  options,
  pipelineInputLayout = []
}: {
  pipelineInputs: Record<string, any>
  options: { prefix?: string }
  pipelineInputLayout?: InputLayout
}): IInputDefinition[] {
  const processedInputKeys = new Set<string>()

  function processLayout(layout: InputLayout): IInputDefinition[] {
    return layout.map(item => {
      if (typeof item === 'string') {
        processedInputKeys.add(item)
        const value = pipelineInputs[item]
        return pipelineInput2FormInput(item, value, options)
      }

      // Nested group
      const groupInputs = processLayout(item.items)

      return {
        inputType: 'group',
        path: '', // Will be resolved at runtime
        label: item.title,
        inputs: groupInputs,
        ...(item.open !== undefined ? { default: { open: item.open } } : {})
      }
    })
  }

  const inputsFromLayout = processLayout(pipelineInputLayout)

  const remainingInputs: IInputDefinition[] = []
  forOwn(pipelineInputs, (value, key) => {
    if (!processedInputKeys.has(key)) {
      remainingInputs.push(pipelineInput2FormInput(key, value, options))
    }
  })

  return [...inputsFromLayout, ...remainingInputs]
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
    outputTransform: inputType === 'text' ? unsetEmptyStringOutputTransformer() : undefined,
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
