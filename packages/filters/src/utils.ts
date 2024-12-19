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

export const createQueryString = (visibleFilters: string[], updatedFiltersMap: Record<string, FilterType>) => {
  const query = visibleFilters.reduce((acc, key) => {
    if (updatedFiltersMap[key]?.state === FilterStatus.FILTER_APPLIED) {
      // Add & if there's already an existing query
      return acc ? `${acc}&${key}=${updatedFiltersMap[key].query}` : `${key}=${updatedFiltersMap[key].query}`
    }
    return acc
  }, '')

  return renderQueryString(new URLSearchParams(query ? `?${query}` : '')) // Add ? only if there's a query
}
