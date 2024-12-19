import { MembersProps, ProjectMemberListViewProps } from '../../project-members/types'

export type ProjectMembersListProps = Pick<
  ProjectMemberListViewProps,
  | 'isLoading'
  | 'searchQuery'
  | 'setSearchQuery'
  | 'setIsInviteMemberDialogOpen'
  | 'onEditMember'
  | 'useTranslationStore'
> & {
  memberList: MembersProps[]
  setSearchInput: (value: string) => void
}
