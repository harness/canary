import { get } from 'lodash-es'

interface WithPageResponse<T> {
  content: T
  headers: Request['headers']
}

export interface PageResponse {
  totalItems: number
  totalPages: number
  pageSize: number
  nextPage: number
  previousPage: number
}

export function getPagedContent<T>(data: unknown): WithPageResponse<T> {
  return { content: get(data, 'content') as T, headers: get(data, 'headers', {}) as Request['headers'] }
}

export function usePagedContent<T>(data: unknown): WithPageResponse<T> {
  return getPagedContent<T>(data)
}
