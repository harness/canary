import { FilterStatus, FilterType } from './types'

export function renderQueryString(search: URLSearchParams) {
  // @ts-ignore
  if (search.size === 0) {
    return ''
  }
  const query: string[] = []
  for (const [key, value] of search.entries()) {
    const safeKey = key
      .replace(/#/g, '%23')
      .replace(/&/g, '%26')
      .replace(/\+/g, '%2B')
      .replace(/=/g, '%3D')
      .replace(/\?/g, '%3F')
    query.push(`${safeKey}=${encodeQueryValue(value)}`)
  }
  const queryString = '?' + query.join('&')
  return queryString
}

export function encodeQueryValue(input: string) {
  return input
    .replace(/%/g, '%25')
    .replace(/\+/g, '%2B')
    .replace(/ /g, '+')
    .replace(/#/g, '%23')
    .replace(/&/g, '%26')
    .replace(/"/g, '%22')
    .replace(/'/g, '%27')
    .replace(/`/g, '%60')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/[\x00-\x1F]/g, char => encodeURIComponent(char))
}

export const createQueryString = <T extends Record<string, unknown>>(
  visibleFilters: (keyof T)[],
  updatedFiltersMap: Record<keyof T, FilterType>
) => {
  const query = visibleFilters.reduce((acc, key) => {
    if (updatedFiltersMap[key]?.state === FilterStatus.FILTER_APPLIED) {
      // Add & if there's already an existing query
      const stringKey = key as string
      return acc
        ? // @ts-ignore
          `${acc}&${stringKey}=${updatedFiltersMap[stringKey].query}`
        : `${stringKey}=${updatedFiltersMap[stringKey].query}`
    }
    return acc
  }, '') as string

  return renderQueryString(new URLSearchParams(query ? `?${query}` : '')) // Add ? only if there's a query
}

export function mergeURLSearchParams(target: URLSearchParams, source: URLSearchParams): URLSearchParams {
  const mergedParams = new URLSearchParams(target.toString()) // Create a copy of target

  // Iterate through the source URLSearchParams
  for (const [key, value] of source) {
    // If the value is falsy except for `false`, skip the merging
    if (!value && value !== 'false') {
      mergedParams.delete(key) // Remove the parameter if it's falsy
    } else {
      mergedParams.set(key, value) // Otherwise, add or overwrite the param
    }
  }

  return mergedParams
}

export function isNullable(parsedValue: string | null | undefined) {
  return parsedValue === '' || parsedValue === undefined || parsedValue === null
}
