import { JSXElementConstructor, ReactElement } from 'react'

import { CiStatus, PipelineExecutionStatus } from '@/views'

export type IExecutionType = string | ReactElement<unknown, string | JSXElementConstructor<unknown>>

export interface IExecution {
  id: string
  status?: PipelineExecutionStatus
  success?: CiStatus
  name?: string
  version?: string
  sha?: string
  description?: IExecutionType
  started?: number
  finished?: number
}

export interface IExecutionListStore {
  executions: IExecution[] | null
  setExecutionsData: (data: IExecution[] | null, paginationData: { totalItems: number; pageSize: number }) => void
  totalItems: number
  pageSize: number
  page: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
}

export interface IExecutionListPageProps {
  useExecutionListStore: () => IExecutionListStore
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  searchQuery?: string | null
  setSearchQuery: (query: string | null) => void
  handleExecutePipeline: () => void
}

export interface IExecutionListProps {
  executions: IExecution[] | null
  query?: string
  handleResetQuery: () => void
  isLoading: boolean
  handleExecutePipeline: () => void
}
