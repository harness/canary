import { useCallback, useEffect, useState } from 'react'

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
      // Update local React state immediately
      if (newValue === null || newValue === undefined) {
        setValue(parser.parse(null)) // fallback to parser's default
      } else {
        setValue(newValue)
      }

      // Update the URL query parameter
      const newParams = new URLSearchParams(window.location.search)
      if (newValue === null || newValue === undefined || newValue === '') {
        newParams.delete(key) // remove query param if empty
      } else {
        newParams.set(key, String(newValue)) // update query param
      }

      // Replace the current history entry to avoid creating a new browser history state
      setSearchParams(newParams, { replace: true })
    },
    [key, setSearchParams, searchParams, parser]
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
