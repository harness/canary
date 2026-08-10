import {
  constructRuntimeInputValue as constructRuntimeInputValueBase,
  extractRuntimeInputName,
  getInputValueType,
  getRuntimeExpressionType,
  isExpressionValue,
  isRuntimeValue,
  type RuntimeExpressionType
} from '@harnessio/forms'

export {
  extractRuntimeInputName,
  getInputValueType,
  getRuntimeExpressionType,
  isExpressionValue,
  isRuntimeValue,
  type RuntimeExpressionType
}

export function constructRuntimeInputValue(value?: string, expressionType?: RuntimeExpressionType) {
  return constructRuntimeInputValueBase(value, expressionType ?? getRuntimeExpressionType(value))
}
