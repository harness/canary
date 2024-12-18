import { JSXElementConstructor, ReactElement } from 'react'

import { TranslationStore } from '@views/repo'
import { TLinkComponent } from '@views/types/link-types'

import { CiStatus, PipelineExecutionStatus } from '../common/execution-types'

export interface IExecution {
  id: string
  status?: PipelineExecutionStatus
  success?: CiStatus
  name?: string
  version?: string
  sha?: string
  description?: string | ReactElement<any, string | JSXElementConstructor<any>>
  started?: number
  finished?: number
}

export interface IExecutionListStore {
  executions: IExecution[] | null
  setExecutionsData: (data: IExecution[] | null, totalPages: number) => void
  totalPages: number
  page: number
  setPage: (page: number) => void
}

export interface IExecutionListPageProps {
  useExecutionListStore: () => IExecutionListStore
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  searchQuery?: string | null
  setSearchQuery: (query: string | null) => void
  handleExecutePipeline: () => void
  LinkComponent: TLinkComponent
}

export interface IExecutionListProps {
  executions: IExecution[] | null
  LinkComponent: React.ComponentType<{ to: string; children: React.ReactNode }>
  query?: string
  handleResetQuery: () => void
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  handleExecutePipeline: () => void
}
