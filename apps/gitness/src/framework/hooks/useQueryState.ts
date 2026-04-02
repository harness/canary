import { useCallback, useEffect, useRef, useState } from 'react'

import { useRouterContext } from '@harnessio/ui/context'

interface Parser<T> {
  parse: (value: string | null) => T
  withDefault: (defaultValue: T) => Parser<T>
}

/**
 * Custom hook to sync a piece of state with the URL query parameter.
 * @param key - the query parameter key in the URL
 * @param parser - a parser to convert the string from the URL into the desired type
 * @returns a tuple [value, setQuery] similar to useState
 */
const useQueryState = <T = string>(
  key: string,
  parser: Parser<T> = parseAsString as unknown as Parser<T> // Default parser is for strings
): [T, (value: T | null) => void] => {
  const { useSearchParams } = useRouterContext()
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialize state from URL query parameter using the parser
  const [value, setValue] = useState<T>(() => parser.parse(searchParams.get(key)))

  // Keep a ref to the latest searchParams so setQuery can read fresh values
  const searchParamsRef = useRef(searchParams)
  searchParamsRef.current = searchParams

  // Effect to sync state when the URL changes (e.g., browser back/forward navigation)
  useEffect(() => {
    const urlValue = parser.parse(searchParams.get(key))
    setValue(urlValue)
  }, [searchParams, key, parser])

  /**
   * Setter function to update both state and URL query parameter
   * @param newValue - new value to set; if null/undefined/empty string, query param is removed
   */
  const setQuery = useCallback(
    (newValue: T | null) => {
      const currentParam = searchParamsRef.current.get(key)
      const isEmpty = newValue === null || newValue === undefined || newValue === ''
      const newParam = isEmpty ? null : String(newValue)

      if (currentParam === newParam) return

      const newParams = new URLSearchParams(searchParamsRef.current.toString())

      if (isEmpty) {
        setValue(parser.parse(null))
        newParams.delete(key)
      } else {
        setValue(newValue!)
        newParams.set(key, newParam!)
      }

      setSearchParams(newParams, { replace: true })
    },
    [key, setSearchParams, parser]
  )

  return [value, setQuery]
}

/**
 * Utility to create a parser with optional default handling
 * @param parseFn - function to convert string | null into T
 */
const createParser = <T>(parseFn: (value: string | null) => T): Parser<T> => ({
  parse: parseFn,
  withDefault(defaultValue: T) {
    // Returns a new parser that provides default if input is null/undefined
    return createParser(value => (value === null || value === undefined ? defaultValue : parseFn(value)))
  }
})

// Default parsers for common types
const parseAsString = createParser((value: string | null) => value || '')
const parseAsInteger = createParser((value: string | null) => (value ? parseInt(value, 10) : 0))
const parseAsBoolean = createParser((value: string | null) => value === 'true')

export { useQueryState, parseAsString, parseAsInteger, parseAsBoolean }
