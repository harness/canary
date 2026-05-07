import { cloneDeep, get, isArray, merge, set, unset } from 'lodash-es'

import { IFormDefinition, IInputDefinition } from '../../types/types'
import { removeTemporaryFieldsValue } from './temporary-field-utils'

type TransformItem = {
  path: string
  /** level is used to sort transformers in order to execute them form leaf to root.*/
  level: number
  isPrimitive: boolean
  inputTransform?: IInputDefinition['inputTransform']
  outputTransform?: IInputDefinition['outputTransform']
  inputPriority: 'early' | 'normal' | 'late'
  outputPriority: 'early' | 'normal' | 'late'
}

/**
 * Sort INPUT transformers by depth (shallower first) and then by primitive type.
 * INPUT transformers need parent context before children can process.
 */
const sortInputTransformers = (a: TransformItem, b: TransformItem) => {
  if (a.level !== b.level) return a.level - b.level // Shallow first
  return !a.isPrimitive ? -1 : 1 // Non-primitives first at same level
}

/**
 * Sort OUTPUT transformers by depth (deeper first) and then by primitive type.
 * OUTPUT transformers need children to populate before parents can clean up.
 */
const sortOutputTransformers = (a: TransformItem, b: TransformItem) => {
  if (a.level !== b.level) return b.level - a.level // Deep first (reversed!)
  return a.isPrimitive ? -1 : 1 // Primitives first at same level
}

/**
 * Sets a value at a path only if either the current value or new value is not undefined.
 * Prevents lodash from creating empty parent objects when both values are undefined.
 */
function safeSet(obj: Record<string, any>, path: string, value: any): void {
  const currentValue = get(obj, path)

  if (currentValue === undefined && value === undefined) {
    return
  }

  set(obj, path, value)
}

/** convert data model to form model using input transformer functions */
export function inputTransformValues(values: Record<string, any>, transformerItems: TransformItem[]) {
  const retValues = cloneDeep(values)

  // Group transformers by input priority: early, normal, late
  const earlyPriority = transformerItems.filter(t => t.inputPriority === 'early')
  const normalPriority = transformerItems.filter(t => t.inputPriority === 'normal')
  const latePriority = transformerItems.filter(t => t.inputPriority === 'late')

  // Sort each group by depth (shallower first for INPUT transformers)
  earlyPriority.sort(sortInputTransformers)
  normalPriority.sort(sortInputTransformers)
  latePriority.sort(sortInputTransformers)

  // Execute in priority order: early → normal → late
  const orderedTransformers = [...earlyPriority, ...normalPriority, ...latePriority]

  orderedTransformers.forEach(transformItem => {
    if (transformItem.inputTransform) {
      const inputTransform = isArray(transformItem.inputTransform)
        ? transformItem.inputTransform
        : [transformItem.inputTransform]

      // Start with the raw value from the initial values
      let currentValue: any
      const pathParts = transformItem.path.split('.')

      if (pathParts.length > 1) {
        const parentPath = pathParts.slice(0, -1).join('.')
        const parentValue = get(retValues, parentPath)

        // If parent is primitive, pass undefined to avoid prototype access
        if (typeof parentValue === 'string' || typeof parentValue === 'number' || typeof parentValue === 'boolean') {
          currentValue = undefined
        } else {
          currentValue = get(retValues, transformItem.path)
        }
      } else {
        currentValue = get(retValues, transformItem.path)
      }

      inputTransform.forEach(inTransform => {
        // Each transformer in the chain receives the output from the previous transformer
        const transformedObj = inTransform(currentValue, retValues)
        if (transformedObj) {
          // Update currentValue for the next transformer in the chain
          currentValue = transformedObj.value
          safeSet(retValues, transformedObj.path ?? transformItem.path, transformedObj.value)
        }
      })
    }
  })
  return retValues
}

/** convert form model to data model using output transformer functions  */
export function outputTransformValues(
  values: Record<string, any>,
  transformerItems: TransformItem[],
  cleanOutput?: boolean
) {
  // Group transformers by output priority: early, normal, late
  const earlyPriority = transformerItems.filter(t => t.outputPriority === 'early')
  const normalPriority = transformerItems.filter(t => t.outputPriority === 'normal')
  const latePriority = transformerItems.filter(t => t.outputPriority === 'late')

  // Sort each group by depth (deeper first for OUTPUT transformers)
  earlyPriority.sort(sortOutputTransformers)
  normalPriority.sort(sortOutputTransformers)
  latePriority.sort(sortOutputTransformers)

  // Execute in priority order: early → normal → late
  const orderedTransformers = [...earlyPriority, ...normalPriority, ...latePriority]

  const pathsToUnset: string[] = []

  let targetValues: Record<string, any> = {}
  if (!cleanOutput) {
    targetValues = cloneDeep(values)
  }

  const rawValues = cloneDeep(values)

  orderedTransformers.forEach(transformItem => {
    if (transformItem.outputTransform) {
      const outputTransform = isArray(transformItem.outputTransform)
        ? transformItem.outputTransform
        : [transformItem.outputTransform]

      // Start with the raw value from the form
      let currentValue = get(rawValues, transformItem.path)

      outputTransform.forEach(outTransform => {
        // Each transformer in the chain receives the output from the previous transformer
        // Pass both raw and target versions for context
        const currentTargetValue = get(targetValues, transformItem.path)
        const transformedObj = outTransform(currentValue, rawValues, currentTargetValue, targetValues)

        if (transformedObj) {
          // Update currentValue for the next transformer in the chain
          currentValue = transformedObj.value

          if (transformedObj.path) {
            if (transformedObj.merge) {
              const existingValue = get(targetValues, transformedObj.path)
              let mergedValues
              if (existingValue) {
                mergedValues = merge({}, existingValue, transformedObj.value)
              } else {
                mergedValues = transformedObj.value
              }

              safeSet(targetValues, transformedObj.path, mergedValues)
            } else {
              safeSet(targetValues, transformedObj.path, transformedObj.value)
            }

            if (transformedObj.unset) {
              pathsToUnset.push(transformItem.path)
            }
          } else {
            safeSet(targetValues, transformItem.path, transformedObj.value)
          }
        }
      })
    }
  })

  pathsToUnset.forEach(path => {
    unset(targetValues, path)
  })

  return targetValues
}

function flattenInputsRec(inputs: IInputDefinition[]): IInputDefinition[] {
  const flattenInputs = inputs.reduce<IInputDefinition[]>((acc, input) => {
    if (Array.isArray(input.inputs)) {
      return [...acc, input, ...flattenInputsRec(input.inputs)]
    } else {
      return [...acc, input]
    }
  }, [])

  return flattenInputs
}

/** Default identity transformer that returns the value as-is, skipping undefined */
const defaultInputTransform: IInputDefinition['inputTransform'] = (value: any) => {
  if (value === undefined) return undefined
  return { value }
}
const defaultOutputTransform: IInputDefinition['outputTransform'] = (value: any) => {
  if (value === undefined) return undefined
  return { value }
}

/** Collect all input/output transformer functions  */
export function getTransformers(formDefinition: IFormDefinition, addDefaultTransformer?: boolean): TransformItem[] {
  const flattenInputs = flattenInputsRec(formDefinition.inputs)

  const ret = flattenInputs.reduce<TransformItem[]>((acc, input) => {
    // TODO: has to be abstracted
    const isPrimitive =
      input.inputType === 'text' ||
      input.inputType === 'boolean' ||
      input.inputType === 'number' ||
      input.inputType === 'textarea' ||
      input.inputType === 'select'

    const hasInputTransform = !!input.inputTransform
    const hasOutputTransform = !!input.outputTransform

    // Don't add default transformers for container inputs or list/array types
    const isContainerInput = Array.isArray(input.inputs) && input.inputs.length > 0
    const isListOrArrayInput = input.inputType === 'list' || input.inputType === 'array'
    const shouldSkipDefaultTransformer = isContainerInput || isListOrArrayInput

    if (hasInputTransform || hasOutputTransform) {
      acc.push({
        path: input.path,
        inputTransform: input.inputTransform,
        outputTransform: input.outputTransform,
        level: input.path.split('.').length,
        isPrimitive,
        inputPriority: input.transformerPriority?.input ?? 'normal',
        outputPriority: input.transformerPriority?.output ?? 'normal'
      })
    } else if (addDefaultTransformer && !shouldSkipDefaultTransformer) {
      acc.push({
        path: input.path,
        inputTransform: defaultInputTransform,
        outputTransform: defaultOutputTransform,
        level: input.path.split('.').length,
        isPrimitive,
        inputPriority: 'normal',
        outputPriority: 'normal'
      })
    }

    return acc
  }, [])

  // Note: Sorting is done in inputTransformValues() and outputTransformValues()
  // based on their respective priorities (inputPriority vs outputPriority)
  return ret
}

/** Remove values for inputs that are hidden  */
export function unsetHiddenInputsValues(
  formDefinition: IFormDefinition,
  values: Record<string, any>,
  metadata?: any,
  options: { preserve?: string[] } = {}
): Record<string, any> {
  const { preserve } = options

  const flattenInputs = flattenInputsRec(formDefinition.inputs)

  const retValues = cloneDeep(values)

  flattenInputs.forEach(input => {
    if (preserve && preserve.includes(input.path)) {
      return
    }

    if (!!input.isVisible && !input.isVisible(values, metadata)) {
      unset(retValues, input.path)
    }
  })

  return retValues
}

/** Convert data to form model  */
export function convertDataToFormModel(
  inputData: Record<string, any>,
  formDefinition: IFormDefinition
): Record<string, any> {
  const transformers = getTransformers(formDefinition)
  return inputTransformValues(inputData, transformers)
}

/** Convert form model to data  */
export function convertFormModelToData(
  formData: Record<string, any>,
  formDefinition: IFormDefinition,
  metadata?: any,
  options: {
    /* path to preserve */
    preserve?: string[]
    /* produces clean output with only transformed fields (useful for API payloads) */
    cleanOutput?: boolean
  } = {}
): Record<string, any> {
  const addDefaultTransformer = options.cleanOutput
  const transformers = getTransformers(formDefinition, addDefaultTransformer)
  let data = unsetHiddenInputsValues(formDefinition, formData, metadata, options)
  data = outputTransformValues(data, transformers, options.cleanOutput)
  data = removeTemporaryFieldsValue(data)
  return data
}
