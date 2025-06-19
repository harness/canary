import { RuntimeInputConfig } from '@views/unified-pipeline-studio'
import { evaluate } from 'cel-js'
import { cloneDeep, forOwn } from 'lodash-es'
import * as z from 'zod'

import { IInputDefinition, InputFactory, unsetEmptyStringOutputTransformer } from '@harnessio/forms'

import { PipelineInputDefinition } from '../types'
import { type InputLayout } from './types'

enum PARSERTYPES {
  CEL = 'cel'
}

export interface UnwrappedExpression {
  kind: PARSERTYPES | 'none'
  inner: string
}
export function getCorrectParserWithString(raw: string): UnwrappedExpression {
  if (raw.startsWith('${{') && raw.endsWith('}}')) {
    return {
      kind: PARSERTYPES.CEL,
      inner: raw.slice(3, -2).trim()
    }
  }

  // No recognised wrapper
  return { kind: 'none', inner: raw }
}

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
  return layout.flatMap(item => {
    if (typeof item === 'string') {
      if (processedInputKeys.has(item) || !(item in pipelineInputs)) return []
      processedInputKeys.add(item)
      return pipelineInput2FormInput(item, pipelineInputs[item], options, inputComponentFactory)
    }

    const layoutedInputs = processLayout(item.items, pipelineInputs, options, processedInputKeys, inputComponentFactory)

    // If group has no title, flatten its items
    if (!item.title && item.items && item.items.length > 0) {
      return layoutedInputs
    }

    return {
      inputType: 'group',
      path: '',
      label: item.title,
      inputs: layoutedInputs,
      inputConfig: {
        autoExpandGroups: item.open
      }
    }
  })
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
    isVisible: function (values) {
      try {
        if (typeof inputProps.ui?.visible === 'string') {
          const unwrapped = getCorrectParserWithString(inputProps.ui?.visible)
          return unwrapped.kind === PARSERTYPES.CEL ? (evaluate(unwrapped.inner, values?.inputs) as boolean) : true
        } else return true
      } catch (e) {
        console.error(`Error evaluating isVisible for input ${name}`, e)
        return false // or return true, depending on your requirements
      }
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
