import { useState, useEffect } from 'react'

export enum PageResponseHeader {
  xTotal = 'x-total',
  xTotalPages = 'x-total-pages',
  xPerPage = 'x-per-page',
  xNextPage = 'x-next-page',
  xPrevPage = 'x-prev-page'
}

type PageResponseHeadersObject = Partial<Record<keyof typeof PageResponseHeader, number>>

function usePageResponseHeaders(headersInit: HeadersInit): PageResponseHeadersObject {
  const [filteredHeaders, setFilteredHeaders] = useState<PageResponseHeadersObject>({})

  useEffect(() => {
    setFilteredHeaders(
      (Object.keys(PageResponseHeader) as Array<keyof typeof PageResponseHeader>).reduce((acc, key) => {
        const headerValue = new Map<string, string>(
          headersInit instanceof Headers ? Array.from(headersInit.entries()) : Object.entries(headersInit)
        ).get(PageResponseHeader[key])
        if (headerValue) {
          acc[key] = parseInt(headerValue, 10)
        }
        return acc
      }, {} as PageResponseHeadersObject)
    )
  }, [headersInit])

  return filteredHeaders
}

export default usePageResponseHeaders
