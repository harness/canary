import { IPrincipalListStore, PrincipalData } from '@views/account'
import { TranslationStore } from '@views/repo'
import { z } from 'zod'

import { IMemberListStore } from '../project.types'
import { inviteMemberFormSchema } from './components/invite-member-dialog'

export interface MembersProps {
  display_name: string
  role: string
  email: string
  timestamp?: string
  avatarUrl?: string
  uid: string
}

export type InviteMemberFormFields = z.infer<typeof inviteMemberFormSchema>

export interface ProjectMemberListViewProps {
  isLoading: boolean
  isInvitingMember: boolean
  useMemberListStore: () => IMemberListStore
  usePrincipalListStore: () => IPrincipalListStore
  useTranslationStore: () => TranslationStore
  isInviteMemberDialogOpen: boolean
  setIsInviteMemberDialogOpen: (isOpen: boolean) => void
  searchQuery: string | null
  setSearchQuery: (query: string | null) => void
  inviteMemberError?: string
  onSubmit: (formValues: InviteMemberFormFields) => void
  onEditMember: (updatedMember: MembersProps) => void
  setPrincipalsSearchQuery: (val: string) => void
  principalsSearchQuery: string
  onDeleteHandler: (id: string) => void
}

export interface InviteMemberDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (formValues: InviteMemberFormFields) => void
  useTranslationStore: () => TranslationStore
  isInvitingMember: boolean
  principals: Array<PrincipalData>
  error?: string
  setPrincipalsSearchQuery: (val: string) => void
  principalsSearchQuery: string
}

export enum EnumMembershipRole {
  CONTRIBUTOR = 'contributor',
  EXECUTOR = 'executor',
  READER = 'reader',
  SPACE_OWNER = 'space_owner'
}
