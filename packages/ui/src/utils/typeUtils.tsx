/**
 * Valid JavaScript type names that can be returned by the typeof operator
 */
type JavaScriptType = 'string' | 'number' | 'boolean' | 'undefined' | 'object' | 'function' | 'symbol' | 'bigint'

/**
 * Checks if a value is of one of the provided types
 * @param value - The value to check
 * @param types - Array of JavaScript type names to check against
 * @returns True if the value matches any of the provided types, false otherwise
 */
export const anyTypeOf = (value: unknown, types: JavaScriptType[]): boolean => {
  const actualType = typeof value
  return types.includes(actualType as JavaScriptType)
}
