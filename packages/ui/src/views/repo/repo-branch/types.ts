import { Dispatch, SetStateAction } from 'react'

import { TranslationStore } from '@/views'
import { z } from 'zod'

import { PullRequestType } from '../pull-request/pull-request.types'
import { IBranchSelectorStore } from '../repo.types'
import { createBranchFormSchema } from './components/create-branch-dialog'

export type CreateBranchFormFields = z.infer<typeof createBranchFormSchema>
export interface BranchProps {
  id: number
  name: string
  sha: string
  timestamp: string
  user: {
    name: string
    avatarUrl?: string
  }
  checks?: {
    done?: number
    total?: number
    status?: {
      pending: number
      running: number
      success: number
      failure: number
      error: number
    }
  }
  behindAhead: {
    behind?: number
    ahead?: number
    default?: boolean
  }
  pullRequests?: PullRequestType[]
}

interface RoutingProps {
  toBranchRules: () => string
  toPullRequestCompare: ({ diffRefs }: { diffRefs: string }) => string
  toPullRequest: ({ pullRequestId }: { pullRequestId: number }) => string
}

export interface BranchListPageProps extends Partial<RoutingProps> {
  isLoading: boolean
  branches: BranchProps[]
  defaultBranch?: string
  useTranslationStore: () => TranslationStore
  setCreateBranchDialogOpen: (isOpen: boolean) => void
  handleResetFiltersAndPages: () => void
  onDeleteBranch: (branchName: string) => void
  isDirtyList: boolean
}

export interface RepoBranchListViewProps extends Partial<RoutingProps> {
  isLoading: boolean
  useRepoBranchesStore: () => IBranchSelectorStore
  useTranslationStore: () => TranslationStore
  isCreateBranchDialogOpen: boolean
  setCreateBranchDialogOpen: (isOpen: boolean) => void
  onSubmit: (formValues: CreateBranchFormFields) => void
  isCreatingBranch: boolean
  createBranchError?: string
  searchQuery: string | null
  setSearchQuery: (query: string | null) => void
  onDeleteBranch: (branchName: string) => void
  searchBranches: Branch[]
  setCreateBranchSearchQuery: Dispatch<SetStateAction<string>>
}

interface Branch {
  name?: string
}

export interface CreateBranchDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (formValues: CreateBranchFormFields) => void
  isLoadingBranches: boolean
  branches?: Branch[]
  error?: string
  isCreatingBranch?: boolean
  useTranslationStore: () => TranslationStore
  defaultBranch?: string
  handleChangeSearchValue: Dispatch<SetStateAction<string>>
}
