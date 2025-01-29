import { useCallback, useEffect, useState } from 'react'

import { debounce } from 'lodash-es'

import { parseAsString, useQueryState } from '../framework/hooks/useQueryState'

interface UseDebouncedQueryStateProps {
  key: string
  defaultValue?: string
  delay?: number
}

type UseDebouncedQueryStateParams = [string] | [string, string] | [string, UseDebouncedQueryStateProps]

/**
 * Use the hook in following ways:
 * useDebouncedQueryState('key'),
 * useDebouncedQueryState('key', 'value'),
 * useDebouncedQueryState('key', { defaultValue: 'value' }) and
 * useDebouncedQueryState('key', { defaultValue: 'value', delay: 500 })
 */
export function useDebouncedQueryState(...args: UseDebouncedQueryStateParams): [string, (value: string) => void] {
  const [key, options] = args
  const defaultValue = typeof options === 'string' ? options : (options?.defaultValue ?? '')
  const delay = typeof options === 'object' && options?.delay !== undefined ? options.delay : 300

  const [query, setQuery] = useQueryState(key, parseAsString.withDefault(defaultValue)) // Pass defaultValue correctly
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  const debouncedSetQuery = useCallback(
    debounce((newQuery: string) => setDebouncedQuery(newQuery), delay),
    [delay]
  )

  useEffect(() => {
    debouncedSetQuery(query)
    return () => {
      debouncedSetQuery.cancel()
    }
  }, [query, debouncedSetQuery])

  return [debouncedQuery, setQuery]
}
