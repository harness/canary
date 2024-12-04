import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import { isEmpty } from 'lodash-es'

function useCommonFilter<S>() {
  const [searchParams, setSearchParams] = useSearchParams()

  const sort = searchParams.get('sort')
  const searchQuery = searchParams.get('query')

  const handleChange = useCallback(
    (property: string) => {
      return (selectedValue: string | null) => {
        setSearchParams(params => {
          const currentValue = params.get(property)

          if (selectedValue && currentValue !== selectedValue) {
            params.set(property, selectedValue)
          } else params.delete(property)

          return params
        })
      }
    },
    [setSearchParams]
  )

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
    sort: (sort as S) || undefined,
    query: searchQuery || undefined,
    handleSearch,
    handleDropdownChange: handleChange
  }
}

export { useCommonFilter }
