/**
 * Valid JavaScript type names that can be returned by the typeof operator
 */
type JavaScriptType = 'string' | 'number' | 'boolean' | 'undefined' | 'object' | 'function' | 'symbol' | 'bigint'

/**
 * Maps JavaScript type names to their actual types
 */
type TypeMap = {
  string: string
  number: number
  boolean: boolean
  undefined: undefined
  object: object | null
  function: (...args: any[]) => any
  symbol: symbol
  bigint: bigint
}

/**
 * Creates a union type from an array of JavaScript type names
 */
type TypeFromArray<T extends JavaScriptType[]> = {
  [K in keyof T]: T[K] extends JavaScriptType ? TypeMap[T[K]] : never
}[number]

/**
 * Checks if a value is of one of the provided types and provides type assertion
 * @param value - The value to check
 * @param types - Array of JavaScript type names to check against
 * @returns True if the value matches any of the provided types, false otherwise
 * @example
 * const value: unknown = "hello";
 * if (isAnyTypeOf(value, ['string', 'number'])) {
 *   TypeScript now knows that value is string | number
 *   console.log(value.toString());
 * }
 */
export function isAnyTypeOf<T extends JavaScriptType[]>(value: unknown, types: [...T]): value is TypeFromArray<T> {
  const actualType = typeof value
  return types.includes(actualType as JavaScriptType)
}

/**
 * Splits an object into two parts: one with the specified keys and one with the remaining keys
 * @param obj - The object to split
 * @param keys - Array of keys to extract
 * @returns An object with two properties: `picked` containing the extracted properties and `rest` containing the remaining properties
 * @example
 * const { picked: { created_by, review_decision }, rest } = splitObjectProps(
 *   Object.fromEntries(searchParams.entries()),
 *   ['created_by', 'review_decision']
 * );
 */
export function splitObjectProps<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): { picked: Pick<T, K>; rest: Omit<T, K> } {
  const picked = {} as Pick<T, K>
  const rest = { ...obj }

  for (const key of keys) {
    if (key in obj) {
      picked[key] = obj[key]
      delete rest[key as string]
    }
  }

  return { picked, rest }
}
