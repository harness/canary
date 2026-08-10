import type { InputValueType } from '../types/runtime-input'
import { isExpressionValue, isRuntimeValue, RUNTIME_INPUT } from './runtime-value-utils'

export type RuntimeExpressionType = 'cel' | 'jexl'

export function getRuntimeExpressionType(value?: string): RuntimeExpressionType {
  if (typeof value === 'undefined') {
    return 'cel'
  }

  const trimmed = value.trim()

  if (trimmed.startsWith('${{') && trimmed.endsWith('}}')) {
    return 'cel'
  }

  return 'jexl'
}

export function getInputValueType(value: unknown): InputValueType {
  // NOTE: waterfall approach, every runtime value is also an expression value
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

  const trimmed = value.trim()

  if (trimmed === RUNTIME_INPUT) {
    return RUNTIME_INPUT
  }

  // Match ${{inputs.NAME}}
  const match1 = trimmed.match(/^\${{\s*inputs\.([^}]+)}}$/)
  if (match1) {
    return match1[1].trim()
  }

  // Match <+inputs.NAME>
  const match2 = trimmed.match(/^<\+inputs\.([^>]+)>$/)
  if (match2) {
    return match2[1].trim()
  }

  return trimmed
}

export function constructRuntimeInputValue(
  value?: string,
  expressionType: RuntimeExpressionType = getRuntimeExpressionType(value)
) {
  const trimmed = value?.trim()
  if (trimmed === RUNTIME_INPUT) {
    return RUNTIME_INPUT
  }

  const inputName = extractRuntimeInputName(value)

  return expressionType === 'cel' ? `\${{inputs.${inputName}}}` : `<+inputs.${inputName}>`
}

export function isOnlyFixedValueAllowed(inputValueTypes?: InputValueType[]) {
  return inputValueTypes?.length === 1 && inputValueTypes[0] === 'fixed'
}

/** Ensures cached fixed values match the shape implied by `defaultEmptyValue` (e.g. arrays for list/array inputs). */
export function isValidFixedShape(value: unknown, defaultEmptyValue: unknown): boolean {
  if (getInputValueType(value) !== 'fixed') {
    return false
  }

  if (Array.isArray(defaultEmptyValue)) {
    return Array.isArray(value)
  }

  if (typeof defaultEmptyValue === 'object' && defaultEmptyValue !== null && !Array.isArray(defaultEmptyValue)) {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }

  return true
}

export function convertStringToNumber(value: string): number | null {
  const trimmedValue = value.trim()

  if (trimmedValue === '') return null

  const num = Number(trimmedValue)

  if (!isNaN(num) && isFinite(num) && String(num) === trimmedValue) {
    return num
  }

  return null
}
