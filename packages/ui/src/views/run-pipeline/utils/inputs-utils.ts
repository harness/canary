import { RuntimeInputConfig } from '@views/unified-pipeline-studio'
import { cloneDeep, forOwn } from 'lodash-es'
import * as z from 'zod'

import { IInputDefinition, InputFactory, unsetEmptyStringOutputTransformer } from '@harnessio/forms'

import { PipelineInputDefinition } from '../types'
import { type InputLayout } from './types'

/** pipeline inputs to form inputs conversion */
export function pipelineInputs2FormInputs({
  pipelineInputs,
  options,
  pipelineInputLayout = [],
  inputComponentFactory
}: {
  pipelineInputs: Record<string, PipelineInputDefinition>
  options: { prefix?: string }
  pipelineInputLayout?: InputLayout
  inputComponentFactory: InputFactory
}): IInputDefinition[] {
  /**
   * Pre-process inputs for valid layout.
   *
   * Rule 1 - If input keys are duplicated in the layout, only the first occurrence is considered
   * Rule 2 - Inputs missing from layout appear at the end in the order of pipelineInputs
   * Rule 3 - If layout is empty, return all inputs flat
   * Rule 4 - If layout includes non-existent inputs, they get ignored
   */
  const duplicateKeys = validateUniqueInputKeysInLayout(pipelineInputLayout)
  if (duplicateKeys.length > 0) {
    console.warn(
      'Duplicate input keys detected in layout. Only the first occurrence will be used. Keys:',
      duplicateKeys
    )
  }

  const processedInputKeys = new Set<string>()
  const inputsFromLayout = processLayout(
    pipelineInputLayout,
    pipelineInputs,
    options,
    processedInputKeys,
    inputComponentFactory
  )

  const remainingInputs: IInputDefinition[] = []
  forOwn(pipelineInputs, (value, key) => {
    if (!processedInputKeys.has(key)) {
      remainingInputs.push(pipelineInput2FormInput(key, value, options, inputComponentFactory))
    }
  })

  return [...inputsFromLayout, ...remainingInputs]
}

/**
 * Recursively processes layout into form inputs, skipping duplicate keys after their first appearance.
 *
 * @param layout - The layout definition
 * @param pipelineInputs - The input data
 * @param options - Options for input formatting
 * @param processedInputKeys - Tracks already-added input keys
 * @returns An array of input definitions
 */
const processLayout = (
  layout: InputLayout,
  pipelineInputs: Record<string, PipelineInputDefinition>,
  options: { prefix?: string },
  processedInputKeys: Set<string>,
  inputComponentFactory: InputFactory
): IInputDefinition[] => {
  // NOTE: group are added to accordion
  let accordion: IInputDefinition | null = null

  const inputs = layout.flatMap(item => {
    if (typeof item === 'string') {
      if (processedInputKeys.has(item) || !(item in pipelineInputs)) return []
      accordion = null
      processedInputKeys.add(item)
      return pipelineInput2FormInput(item, pipelineInputs[item], options, inputComponentFactory)
    }

    const layoutedInputs = processLayout(item.items, pipelineInputs, options, processedInputKeys, inputComponentFactory)

    // If group has no title, flatten its items
    if (!item.title && item.items && item.items.length > 0) {
      return layoutedInputs
    }

    const accordionItem = {
      inputType: 'group',
      path: '',
      label: item.title,
      inputs: layoutedInputs,
      inputConfig: {
        autoExpandGroups: item.open
      }
    }

    if (accordion) {
      accordion.inputs?.push(accordionItem)
      return []
    } else {
      accordion = {
        inputType: 'accordion',
        path: '',
        inputs: []
      }
      accordion.inputs?.push(accordionItem)
      return accordion
    }
  })

  return inputs.filter(input => !!input)
}

const traverseInputLayout = (layout: InputLayout, inputOccurrences: Map<string, number>) => {
  layout.forEach(item => {
    if (typeof item === 'string') {
      inputOccurrences.set(item, (inputOccurrences.get(item) || 0) + 1)
    } else if (item.items && item.items.length > 0) {
      traverseInputLayout(item.items, inputOccurrences)
    }
  })
}

const validateUniqueInputKeysInLayout = (layout: InputLayout): string[] => {
  const inputOccurrences = new Map<string, number>()
  traverseInputLayout(layout, inputOccurrences)

  return Array.from(inputOccurrences.entries())
    .filter(([, count]) => count > 1)
    .map(([key]) => key)
}

/** pipeline input to form input conversion */
export function pipelineInput2FormInput(
  name: string,
  inputProps: PipelineInputDefinition,
  options: { prefix?: string },
  inputComponentFactory: InputFactory
): IInputDefinition<{ tooltip?: string } & RuntimeInputConfig> {
  const inputType = pipelineInputType2FormInputType(inputProps.type, inputProps?.ui, inputComponentFactory)

  return {
    inputType,
    path: options.prefix + name,
    label: typeof inputProps.label === 'string' ? inputProps.label : name,
    default: inputProps.default,
    required: inputProps.required as boolean,
    placeholder: inputProps.ui?.placeholder || '',
    isVisible: function () {
      // return inputProps.ui?.visible?.length ? jexl.evalSync(inputProps.ui?.visible, values) : true
      return true
    },
    inputConfig: {
      allowedValueTypes: ['fixed', 'runtime', 'expression'],
      ...(inputProps.description ? { tooltip: inputProps.description as string } : {}),
      ...(inputProps?.ui ? inputProps.ui : {}),
      // special handling for select dropdown items
      ...(inputType === 'select'
        ? { options: inputProps?.options?.map(option => ({ label: option, value: option })) }
        : {})
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

/** pipeline input ui widget / input type to form input type conversion */
function pipelineInputType2FormInputType(
  type: string,
  uiProps: PipelineInputDefinition['ui'],
  inputComponentFactory: InputFactory
): string {
  return uiProps?.widget
    ? (inputComponentFactory?.getComponent(uiProps?.widget)?.internalType ?? 'text')
    : convertTypeToDefaultInputType(type)
}

/**  default input types for pipeline inputs **/
function convertTypeToDefaultInputType(type: string): string {
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
