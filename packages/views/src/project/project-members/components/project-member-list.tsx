import { FC } from 'react'

import { NoData, Skeleton } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

import { MembersList } from './member-list'
import { ProjectMembersListProps } from './types'

const ProjectMembersList: FC<ProjectMembersListProps> = ({
  isLoading,
  memberList,
  handleResetFiltersQueryAndPages,
  onEditMember,
  totalItems,
  pageSize,
  page,
  setPage,
  setPageSize,
  onDeleteHandler
}) => {
  const { t } = useTranslation()

  if (isLoading) {
    return <Skeleton.List />
  }

  if (!memberList.length) {
    return (
      <NoData
        withBorder
        textWrapperClassName="max-w-[350px]"
        imageName="no-search-magnifying-glass"
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
        secondaryButton={{
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
        paginationProps={{
          totalItems,
          pageSize,
          currentPage: page,
          goToPage: setPage,
          onPageSizeChange: setPageSize
        }}
      />
    </>
  )
}

export default ProjectMembersList
