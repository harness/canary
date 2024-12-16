import { TranslationStore } from '@views/repo'
import { z } from 'zod'

import { IMemberListStore } from '../project.types'
import { inviteMemberFormSchema } from './components/new-member-dialog'

export interface MembersProps {
  display_name: string
  role: string
  email: string
  timestamp?: string
  avatarUrl?: string
  uid: string
}

export type InviteMemberFormFields = z.infer<typeof inviteMemberFormSchema>

export interface InviteMemberDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (formValues: InviteMemberFormFields) => void
  useTranslationStore: () => TranslationStore
}

/**
 *
 */

export interface ProjectMemberListViewProps {
  isLoading: boolean
  useMemberListStore: () => IMemberListStore
  useTranslationStore: () => TranslationStore
  isInviteMemberDialogOpen: boolean
  setIsInviteMemberDialogOpen: (isOpen: boolean) => void
  searchQuery: string | null
  setSearchQuery: (query: string | null) => void
}
