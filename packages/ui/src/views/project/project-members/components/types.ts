import { MembersProps, ProjectMemberListViewProps } from '../../project-members/types' // Adjust the path to where the interface is defined.

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
