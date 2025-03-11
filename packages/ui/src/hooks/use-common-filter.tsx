import { useCallback } from 'react'

import { useRouterContext } from '@/context'
import { isEmpty } from 'lodash-es'

function useCommonFilter() {
  const { useSearchParams } = useRouterContext()
  const [searchParams, setSearchParams] = useSearchParams()

  const searchQuery = searchParams.get('query')

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchParams(params => {
        const latestSearchQuery = event?.target?.value
        if (!isEmpty(latestSearchQuery)) {
          params.set('query', latestSearchQuery)
        } else params.delete('query')

        return params
      })
    },
    [setSearchParams]
  )

  return {
    query: searchQuery || undefined,
    handleSearch
  }
}

export { useCommonFilter }
