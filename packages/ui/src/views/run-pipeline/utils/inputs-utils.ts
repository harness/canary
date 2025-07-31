import { RuntimeInputConfig } from '@views/unified-pipeline-studio'
import { evaluate } from 'cel-js'
import { camelCase, cloneDeep, forOwn, get, isNull } from 'lodash-es'
import * as z from 'zod'

import {
  IInputDefinition,
  IInputTransformerFunc,
  InputFactory,
  IOutputTransformerFunc,
  unsetEmptyStringOutputTransformer
} from '@harnessio/forms'

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

export function convertMapKeysToCamelCase(map: Record<string, unknown> | null | undefined): Record<string, unknown> {
  if (!map) return {}

  return Object.entries(map).reduce(
    (acc, [key, value]) => {
      acc[camelCase(key)] = value
      return acc
    },
    {} as Record<string, unknown>
  )
}

/** pipeline input to form input conversion */
export function pipelineInput2FormInput(
  name: string,
  inputProps: PipelineInputDefinition,
  options: { prefix?: string },
  inputComponentFactory: InputFactory
): IInputDefinition<{ tooltip?: string } & RuntimeInputConfig> {
  const inputType = pipelineInputType2FormInputType(inputProps.type, inputProps.ui, inputComponentFactory)

  // base inputConfig
  const baseConfig: Record<string, any> = {
    ...(inputProps.ui ? inputProps.ui : {}),
    options: inputProps.options
  }

  // special handling for each inputTypes
  const { inputType: transformedType, inputConfig } = transformInputConfig(inputType, inputProps, baseConfig)

  return {
    inputType: transformedType,
    path: (options.prefix || '') + name,
    label: typeof inputProps.label === 'string' ? inputProps.label : name,
    default: inputProps.default,
    required: Boolean(inputProps.required),
    placeholder: inputProps.ui?.placeholder || '',
    description: inputProps.description,
    isVisible: function (values: any) {
      const camelCaseInputs = convertMapKeysToCamelCase(values?.inputs)
      try {
        if (typeof inputProps.ui?.visible === 'string') {
          const unwrapped = getCorrectParserWithString(inputProps.ui.visible)
          return unwrapped.kind === PARSERTYPES.CEL ? (evaluate(unwrapped.inner, camelCaseInputs) as boolean) : true
        }
        return true
      } catch (e) {
        console.error(`Error evaluating isVisible for input ${name}`, e)
        return false
      }
    },
    inputConfig,
    outputTransform:
      transformedType === 'text'
        ? unsetEmptyStringOutputTransformer()
        : transformedType === 'key-value-pairs'
          ? KeyValuePairsOutputTransformer()
          : undefined,
    inputTransform: transformedType === 'key-value-pairs' ? KeyValuePairsInputTransformer() : undefined,
    ...(typeof inputProps.pattern === 'string'
      ? {
          validation: {
            schema: z
              .any()
              .optional()
              .refine(
                (value: any) => new RegExp(inputProps.pattern as string).test(value ?? ''),
                `Value does not match ${inputProps.pattern} pattern`
              )
          }
        }
      : {})
  }
}

export function transformInputConfig(
  originalType: string,
  inputProps: PipelineInputDefinition,
  baseConfig: Record<string, any>
): { inputType: string; inputConfig: Record<string, any> } {
  let inputType = originalType
  const sourceOptions = inputProps.options ?? inputProps.enum ?? inputProps.items

  // use source options if ui.options is not defined
  if (Array.isArray(sourceOptions) && sourceOptions.length > 0 && !baseConfig.ui?.options?.length) {
    if (inputType === 'text' || inputType == 'select' || inputType == 'choice') {
      // convert text/choice to select when options are provided
      inputType = 'select'
      baseConfig.options = sourceOptions.map(option => ({ label: option, value: option }))
    } else if (inputType == 'multiselect') {
      baseConfig.options = sourceOptions.map(option => ({ id: option, key: option }))
    }
  }

  if (inputType === 'connector') {
    baseConfig.connectorTypes = inputProps.oneof
  }

  return { inputType, inputConfig: baseConfig }
}

/** pipeline input ui component / input type to form input type conversion */
function pipelineInputType2FormInputType(
  type: string,
  uiProps: PipelineInputDefinition['ui'],
  inputComponentFactory: InputFactory
): string {
  return uiProps?.component
    ? (inputComponentFactory?.getComponent(uiProps?.component)?.internalType ?? 'text')
    : convertTypeToDefaultInputType(type)
}

/**  default input types for pipeline inputs **/
function convertTypeToDefaultInputType(type: string): string {
  switch (type) {
    case 'string':
      return 'text'
    case 'secret':
      return 'secret-select'
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

function toKeyValueMap<K extends string | number, V>(items: Array<{ key: K; value: V }>): Record<K, V> {
  return items.reduce(
    (acc, { key, value }) => {
      acc[key] = value
      return acc
    },
    {} as Record<K, V>
  )
}

function fromKeyValueMap<K extends string | number, V>(map: Record<K, V>): Array<{ key: K; value: V }> {
  return (Object.entries(map) as [K, V][]).map(([key, value]) => ({
    key,
    value
  }))
}

export function KeyValuePairsOutputTransformer(path?: string): IOutputTransformerFunc {
  return function (inputValue: any, values: Record<string, any>) {
    const value = path ? get(values, path) : inputValue

    if (typeof value === 'undefined') return undefined

    if (isNull(value)) return { value: undefined, path }

    return { value: toKeyValueMap(value), path }
  }
}

export function KeyValuePairsInputTransformer(): IInputTransformerFunc {
  return function (value: Record<string, string>) {
    return { value: fromKeyValueMap(value) }
  }
}
