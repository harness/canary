import { MembersProps, ProjectMemberListViewProps } from '@/views'

export type ProjectMembersListProps = Pick<
  ProjectMemberListViewProps,
  'isLoading' | 'onEditMember' | 'useTranslationStore' | 'onDeleteHandler'
> & {
  memberList: MembersProps[]
  handleResetFiltersQueryAndPages: () => void
  totalItems: number
  pageSize: number
  page: number
  setPage: (val: number) => void
}
