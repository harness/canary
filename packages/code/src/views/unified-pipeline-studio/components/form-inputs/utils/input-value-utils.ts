import { InputValueType } from '../types/types'

export function isRuntimeValue(value: unknown) {
  return typeof value === 'string' && value.startsWith('<+input')
}

export function isExpressionValue(value: unknown) {
  return typeof value === 'string' && value.startsWith('<+')
}

export function getInputValueType(value: unknown): InputValueType {
  // NOTE: has to be waterfall approach
  if (isRuntimeValue(value)) {
    return 'runtime'
  } else if (isExpressionValue(value)) {
    return 'expression'
  }

  return 'fixed'
}

export function extractRuntimeInputName(value?: string) {
  if (typeof value === 'undefined') {
    return ''
  }

  let inputName = value

  if (value.endsWith('>')) {
    inputName = inputName.slice(0, -1)
  }
  if (value.startsWith('<+input.')) {
    inputName = inputName.slice(8)
  }

  return inputName
}

export function constructRuntimeInputValue(value?: string) {
  const inputName = extractRuntimeInputName(value)
  return `<+input.${inputName}>`
}
