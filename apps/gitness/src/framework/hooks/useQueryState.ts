import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

type UseQueryStateReturn<T> = [T, (value: T | null) => void]

const useQueryState = <T extends string | number | null>(key: string, defaultValue: T): UseQueryStateReturn<T> => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Get the current value for the query param
  const rawValue = searchParams.get(key)

  // Parse the value based on the type of defaultValue
  const parsedValue =
    rawValue !== null ? (typeof defaultValue === 'number' ? (Number(rawValue) as T) : (rawValue as T)) : defaultValue

  // Setter to update the query param
  const setValue = useCallback(
    (newValue: T | null) => {
      const newParams = new URLSearchParams(searchParams)
      if (newValue === null || newValue === '' || newValue === undefined) {
        newParams.delete(key) // Remove the query param if value is null, empty, or undefined
      } else {
        newParams.set(key, String(newValue)) // Set the query param
      }
      setSearchParams(newParams)
    },
    [key, searchParams, setSearchParams]
  )

  return [parsedValue, setValue]
}

export { useQueryState }
