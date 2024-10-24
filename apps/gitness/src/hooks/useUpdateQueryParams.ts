import { parseAsInteger, useQueryState } from 'nuqs'

export const useUpdateQueryParams = () => {
  const [query, setQuery] = useQueryState('query', { defaultValue: '' })
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const updatePage = (newPage: number) => setPage(newPage)
  const updateQuery = (newQuery: string) => setQuery(newQuery)

  return { page, query, updatePage, updateQuery }
}
