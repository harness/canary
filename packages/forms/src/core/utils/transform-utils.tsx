import { cloneDeep, get, isArray, pick, set, unset } from 'lodash-es'

import { IFormDefinition, IInputDefinition } from '../../types/types'

type TransformItem = {
  path: string
  /** level is used to sort transformers in order to execute them form leaf to root.*/
  level: number
  isPrimitive: boolean
  inputTransform?: IInputDefinition['inputTransform']
  outputTransform?: IInputDefinition['outputTransform']
}

/** convert data model to form model using input transformer functions */
export function inputTransformValues(values: Record<string, any>, transformerItems: TransformItem[]) {
  const retValues = cloneDeep(values)
  transformerItems.forEach(transformItem => {
    if (transformItem.inputTransform) {
      const inputTransform = isArray(transformItem.inputTransform)
        ? transformItem.inputTransform
        : [transformItem.inputTransform]

      const rawValue = get(retValues, transformItem.path)
      inputTransform.forEach(inTransform => {
        const transformedObj = inTransform(rawValue, retValues)
        if (transformedObj) {
          set(retValues, transformedObj.path ?? transformItem.path, transformedObj.value)
        }
      })
    }
  })
  return retValues
}

/** convert form model to data model using output transformer functions  */
export function outputTransformValues(values: Record<string, any>, transformerItems: TransformItem[]) {
  const retValues = cloneDeep(values)
  transformerItems.forEach(transformItem => {
    if (transformItem.outputTransform) {
      const outputTransform = isArray(transformItem.outputTransform)
        ? transformItem.outputTransform
        : [transformItem.outputTransform]

      const rawValue = get(retValues, transformItem.path)
      outputTransform.forEach(outTransform => {
        const transformedObj = outTransform(rawValue, retValues)
        if (transformedObj) {
          set(retValues, transformedObj.path ?? transformItem.path, transformedObj.value)
        }
      })
    }
  })
  return retValues
}

function flattenInputsRec(inputs: IInputDefinition[]): IInputDefinition[] {
  const flattenInputs = inputs.reduce<IInputDefinition[]>((acc, input) => {
    if (input.inputType === 'group' && input.inputs) {
      return [...acc, input, ...flattenInputsRec(input.inputs)]
    } else {
      return [...acc, input]
    }
  }, [])

  return flattenInputs
}

/** Collect all input/output transformer functions  */
export function getTransformers(formDefinition: IFormDefinition): TransformItem[] {
  const flattenInputs = flattenInputsRec(formDefinition.inputs)

  const ret = flattenInputs.reduce<TransformItem[]>((acc, input) => {
    // TODO: has to be abstracted
    const isPrimitive =
      input.inputType === 'text' ||
      input.inputType === 'boolean' ||
      input.inputType === 'number' ||
      input.inputType === 'textarea' ||
      input.inputType === 'select'

    if (input.inputTransform || input.outputTransform) {
      acc.push({
        ...pick(input, 'path', 'inputTransform', 'outputTransform'),
        level: input.path.split('.').length,
        isPrimitive
      })
    }

    return acc
  }, [])

  ret.sort((a, b) => {
    if (a.level === b.level) return !a.isPrimitive ? -1 : 1
    return a.level > b.level ? -1 : 1
  })

  return ret
}

/** Remove values for inputs that are hidden  */
export function unsetHiddenInputsValues(
  formDefinition: IFormDefinition,
  values: Record<string, any>,
  metadata?: any
): Record<string, any> {
  const flattenInputs = flattenInputsRec(formDefinition.inputs)

  const retValues = cloneDeep(values)

  flattenInputs.forEach(input => {
    if (!!input.isVisible && !input.isVisible(values, metadata)) {
      unset(retValues, input.path)
    }
  })

  return retValues
}
