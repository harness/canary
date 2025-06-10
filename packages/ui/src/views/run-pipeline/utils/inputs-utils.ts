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
  /**
   * Pre-process inputs for valid layout.
   * Rule 1 - If there are duplicate keys in the layout, we skip the layout and return all inputs flat
   * Rule 2 - ...
   */
  const duplicateKeys = validateUniqueInputKeysInLayout(pipelineInputLayout)

  // If duplicates found, skip layout and return all inputs flat
  if (validateUniqueInputKeysInLayout(pipelineInputLayout).length > 0) {
    console.warn('Duplicate input keys detected in layout. Using flat input list instead. Keys:', duplicateKeys)

    const fallbackInputs: IInputDefinition[] = []
    forOwn(pipelineInputs, (value, key) => {
      fallbackInputs.push(pipelineInput2FormInput(key, value, options))
    })
    return fallbackInputs
  }

  const processedInputKeys = new Set<string>()

  const processLayout = (layout: InputLayout): IInputDefinition[] => {
    return layout.flatMap(item => {
      if (typeof item === 'string') {
        processedInputKeys.add(item)
        const value = pipelineInputs[item]
        return pipelineInput2FormInput(item, value, options)
      }

      // If group has no title, flatten its items
      if (!item.title) {
        return processLayout(item.items)
      }

      return {
        inputType: 'group',
        path: '',
        label: item.title,
        inputs: processLayout(item.items),
        inputConfig: {
          autoExpandGroups: item.open
        }
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

export const validateUniqueInputKeysInLayout = (layout: InputLayout): string[] => {
  const inputOccurrences = new Map<string, number>()

  const traverse = (layout: InputLayout) => {
    layout.forEach(item => {
      if (typeof item === 'string') {
        inputOccurrences.set(item, (inputOccurrences.get(item) || 0) + 1)
      } else {
        traverse(item.items)
      }
    })
  }

  traverse(layout)

  const duplicates = Array.from(inputOccurrences.entries())
    .filter(([, count]) => count > 1)
    .map(([key]) => key)

  return duplicates
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
