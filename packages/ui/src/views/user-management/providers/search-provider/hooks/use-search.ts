import { useContext } from 'react'

import { SearchContext } from '@/views/user-management/providers/search-provider'

export const useSearch = () => {
  const context = useContext(SearchContext)

  if (!context) {
    throw new Error('useSearch must be used within SearchProvider')
  }

  return context
}
