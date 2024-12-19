import React from 'react'

import { NoData, SkeletonList } from '@/components'

import { MembersList } from './member-list'
import { ProjectMembersListProps } from './types'

const ProjectMembersList: React.FC<ProjectMembersListProps> = ({
  isLoading,
  memberList,
  searchQuery,
  useTranslationStore,
  setSearchInput,
  setSearchQuery,
  setIsInviteMemberDialogOpen,
  onEditMember
}) => {
  const { t } = useTranslationStore()
  if (isLoading) {
    return <SkeletonList />
  }

  if (!memberList?.length) {
    if (searchQuery) {
      return (
        <NoData
          iconName="no-search-magnifying-glass"
          title={t('views:noData.noResults', 'No search results')}
          description={[
            t('views:noData.checkSpelling', 'Check your spelling and filter options,'),
            t('views:noData.changeSearch', 'or search for a different keyword.')
          ]}
          primaryButton={{
            label: t('views:noData.clearSearch', 'Clear search'),
            onClick: () => {
              setSearchInput('')
              setSearchQuery(null)
            }
          }}
        />
      )
    }

    return (
      <NoData
        iconName="no-data-branches"
        title={t('views:noData.members', 'No members yet')}
        description={[t('views:noData.inviteMembers', 'Invite members to this project.')]}
        primaryButton={{
          label: t('views:projectSettings.newMember', 'Invite New Member'),
          onClick: () => {
            setIsInviteMemberDialogOpen(true)
          }
        }}
      />
    )
  }

  return <MembersList members={memberList} onEdit={onEditMember} onDelete={() => {}} />
}

export default ProjectMembersList
