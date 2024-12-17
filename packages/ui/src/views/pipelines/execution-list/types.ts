import { JSXElementConstructor, ReactElement } from 'react'

import { TranslationStore } from '@views/repo'

import { CiStatus, PipelineExecutionStatus } from '../common/execution-types'

export interface Execution {
  id: string
  status?: PipelineExecutionStatus
  success?: CiStatus
  name?: string
  version?: string
  sha?: string
  description?: string | ReactElement<any, string | JSXElementConstructor<any>>
  timestamp?: string
  lastTimestamp?: string
}

export interface ExecutionListStore {
  executions: Execution[] | null
  setExecutionsData: (data: Execution[] | null, totalPages: number) => void
  totalPages: number
  page: number
  setPage: (page: number) => void
}

export interface ExecutionListPageProps {
  useExecutionListStore: () => ExecutionListStore
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  searchQuery?: string | null
  setSearchQuery: (query: string | null) => void
}

export interface ExecutionListProps {
  executions: Execution[] | null
  LinkComponent: React.ComponentType<{ to: string; children: React.ReactNode }>
  query?: string
  handleResetQuery: () => void
  useTranslationStore: () => TranslationStore
  isLoading: boolean
}
