import {
  constructRuntimeInputValue as constructRuntimeInputValueBase,
  extractRuntimeInputName,
  getInputValueType,
  isExpressionValue,
  isRuntimeValue
} from '@harnessio/forms'

export { extractRuntimeInputName, getInputValueType, isExpressionValue, isRuntimeValue }

/**
 * Views runtime UI still uses the jexl-shaped `<+inputs.NAME>` editor.
 * Prefer CEL (`${{inputs.NAME}}`) via `@harnessio/forms` when building new surfaces.
 */
export function constructRuntimeInputValue(value?: string) {
  return constructRuntimeInputValueBase(value, 'jexl')
}
