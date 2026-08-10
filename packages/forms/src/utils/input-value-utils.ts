import type { InputValueType } from '../types/runtime-input'

import { RUNTIME_INPUT, isExpressionValue, isRuntimeValue } from './runtime-value-utils'

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

export function constructRuntimeInputValue(value?: string, expressionType: 'cel' | 'jexl' = 'cel') {
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

export function convertStringToNumber(value: string): number | null {
  const trimmedValue = value.trim()

  if (trimmedValue === '') return null

  const num = Number(trimmedValue)

  if (!isNaN(num) && isFinite(num) && String(num) === trimmedValue) {
    return num
  }

  return null
}
