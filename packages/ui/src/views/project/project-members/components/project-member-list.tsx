import { FC } from 'react'

import { NoData, Pagination, SkeletonList } from '@/components'

import { MembersList } from './member-list'
import { ProjectMembersListProps } from './types'

const ProjectMembersList: FC<ProjectMembersListProps> = ({
  isLoading,
  memberList,
  useTranslationStore,
  handleResetFiltersQueryAndPages,
  onEditMember,
  totalItems,
  pageSize,
  page,
  setPage,
  onDeleteHandler
}) => {
  const { t } = useTranslationStore()

  if (isLoading) {
    return <SkeletonList />
  }

  if (!memberList.length) {
    return (
      <NoData
        withBorder
        textWrapperClassName="max-w-[350px]"
        iconName="no-search-magnifying-glass"
        title={t('views:noData.noResults', 'No search results')}
        description={[
          t(
            'views:noData.noResultsDescription',
            'No members match your search. Try adjusting your keywords or filters.',
            {
              type: 'members'
            }
          )
        ]}
        primaryButton={{
          label: t('views:noData.clearSearch', 'Clear search'),
          onClick: handleResetFiltersQueryAndPages
        }}
      />
    )
  }

  return (
    <>
      <MembersList
        members={memberList}
        onEdit={onEditMember}
        onDelete={onDeleteHandler}
        useTranslationStore={useTranslationStore}
      />
      <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={page} goToPage={setPage} t={t} />
    </>
  )
}

export default ProjectMembersList
