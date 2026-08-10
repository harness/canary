/** Legacy runtime input marker. Still produced by the backend and older UIs. */
export const RUNTIME_INPUT = '<+input>'

export function isLegacyRuntimeValue(value: unknown): boolean {
  return typeof value === 'string' && value.trim() === RUNTIME_INPUT
}

export function isRuntimeValue(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false
  }

  const trimmed = value.trim()
  const hasJexlDelimiters = trimmed.startsWith('<+') && trimmed.endsWith('>')
  const hasCelDelimiters = trimmed.startsWith('${{') && trimmed.endsWith('}}')

  // `<+input` also matches `<+inputs.…`
  return (
    (hasJexlDelimiters && trimmed.startsWith('<+input')) ||
    (hasCelDelimiters && (trimmed.startsWith('${{inputs.') || trimmed.startsWith('${{ inputs.')))
  )
}

export const isHarnessExpression = (str = ''): boolean => {
  const trimmed = str.trim()
  return trimmed.startsWith('<+') && trimmed.endsWith('>')
}

export function isExpressionValue(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false
  }

  const trimmed = value.trim()
  return (
    (trimmed.startsWith('<+') && trimmed.endsWith('>')) ||
    (trimmed.startsWith('${{') && trimmed.endsWith('}}'))
  )
}

/**
 * Runtime inputs and expressions are plain strings until the pipeline runs, so their shape
 * cannot be checked against the input type (an `array` input holding `<+input>` is still valid).
 */
export function isUnresolvedValue(value: unknown): boolean {
  return isExpressionValue(value)
}
