import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

type Parser<T> = {
  parse: (value: string | null) => T
  withDefault: (defaultValue: T) => Parser<T>
}

const useQueryState = <T = string>(
  key: string,
  parser: Parser<T> = parseAsString as unknown as Parser<T> // Default parser is for strings
): [T, (value: T | null) => void] => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Parse the current value or fallback to the default value
  const value = parser.parse(searchParams.get(key))

  // Setter for query params
  const setValue = useCallback(
    (newValue: T | null) => {
      const newParams = new URLSearchParams(searchParams)
      if (newValue === null) {
        newParams.delete(key)
      } else {
        newParams.set(key, String(newValue))
      }
      setSearchParams(newParams)
    },
    [key, searchParams, setSearchParams]
  )

  return [value, setValue]
}

// Create parser utility
const createParser = <T>(parseFn: (value: string | null) => T): Parser<T> => ({
  parse: parseFn,
  withDefault(defaultValue: T) {
    return createParser(value => (value === null || value === undefined ? defaultValue : parseFn(value)))
  }
})

// Default parsers
const parseAsString = createParser((value: string | null) => value || '')
const parseAsInteger = createParser((value: string | null) => (value ? parseInt(value, 10) : 0))
const parseAsBoolean = createParser((value: string | null) => value === 'true')

export { useQueryState, parseAsString, parseAsInteger, parseAsBoolean }
