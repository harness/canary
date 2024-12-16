import { useEffect, useState } from 'react'

import { parseAsInteger, useQueryState } from 'nuqs'

import { useMembershipListQuery } from '@harnessio/code-service-client'
import { ProjectMemberListView } from '@harnessio/ui/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { orderSortDate } from '../../types'
import { useMemberListStore } from './stores/member-list-store'

export function ProjectMemberListPage() {
  const space_ref = useGetSpaceURLParam()
  const { page, setPage, setMemberList } = useMemberListStore()

  const [isInviteMemberDialogOpen, setIsInviteMemberDialogOpen] = useState<boolean>(false)

  const [query, setQuery] = useQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const { isLoading, data: { body: membersData } = {} } = useMembershipListQuery({
    space_ref: space_ref ?? '',
    queryParams: {
      page,
      query: query ?? '',
      order: orderSortDate.DESC
    }
  })

  useEffect(() => {
    setQueryPage(page)
  }, [page, setPage, queryPage])

  useEffect(() => {
    if (membersData) {
      setMemberList(membersData)
    }
  }, [membersData, setMemberList])

  return (
    <ProjectMemberListView
      isLoading={isLoading}
      useTranslationStore={useTranslationStore}
      useMemberListStore={useMemberListStore}
      isInviteMemberDialogOpen={isInviteMemberDialogOpen}
      setIsInviteMemberDialogOpen={setIsInviteMemberDialogOpen}
      searchQuery={query}
      setSearchQuery={setQuery}
    />
  )
}
