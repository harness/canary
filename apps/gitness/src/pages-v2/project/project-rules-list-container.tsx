import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { useSpaceRuleListQuery } from '@harnessio/code-service-client'
import { ProjectRulesPage } from '@harnessio/ui/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useQueryState } from '../../framework/hooks/useQueryState'
import usePaginationQueryStateWithStore from '../../hooks/use-pagination-query-state-with-store'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

export const ProjectRulesListContainer = () => {
  const space_ref = useGetSpaceURLParam()
  const queryClient = useQueryClient()
  const [query, setQuery] = useQueryState('query')
  const [page, setPage] = useState(1)
  const { queryPage } = usePaginationQueryStateWithStore({ page, setPage })

  const { data: { body: rulesData } = {}, isLoading } = useSpaceRuleListQuery({
    space_ref: space_ref ?? '',
    queryParams: {
      page: queryPage,
      query: query ?? ''
    }
  })

  return (
    <ProjectRulesPage
      rulesData={rulesData ?? []}
      isLoading={isLoading}
      useTranslationStore={useTranslationStore}
      searchQuery={query}
      setSearchQuery={setQuery}
      page={page}
      setPage={setPage}
    />
  )
}
