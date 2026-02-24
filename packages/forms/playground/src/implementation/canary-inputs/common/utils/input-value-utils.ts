import { InputValueType } from '../../../types/types'

export const RUNTIME_INPUT = '<+input>'

export function isLegacyRuntimeValue(value: unknown) {
  // TODO: improve using regex
  return typeof value === 'string' && value.trim() === RUNTIME_INPUT
}

export function isRuntimeValue(value: unknown) {
  // TODO: improve using regex
  return (
    typeof value === 'string' &&
    (value.startsWith('<+inputs.') ||
      value.startsWith('${{inputs.') ||
      value.startsWith('${{ inputs.') ||
      value === RUNTIME_INPUT)
  )
}

export const isHarnessExpression = (str = ''): boolean => str.startsWith('<+') && str.endsWith('>')

export function isExpressionValue(value: unknown) {
  return typeof value === 'string' && (value.startsWith('<+') || value.startsWith('${{'))
}

export function getInputValueType(value: unknown): InputValueType {
  // NOTE: this has to be waterfall approach, do not change order
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

  if (value === RUNTIME_INPUT) {
    return value
  }

  const trimmed = value.trim()

  // Match ${{inputs.NAME}}
  const match1 = trimmed.match(/^\${{\s*inputs\.([^}]+)}}$/)
  if (match1) {
    return match1[1]
  }

  // Match <+inputs.NAME>
  const match2 = trimmed.match(/^<\+inputs\.([^>]+)>$/)
  if (match2) {
    return match2[1]
  }

  return trimmed
}

export function constructRuntimeInputValue(value?: string, expressionType: 'cel' | 'jexl' = 'cel') {
  if (value === RUNTIME_INPUT) {
    return value
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
