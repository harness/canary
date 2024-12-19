import { IExecution, IExecutionListStore, PipelineExecutionStatus } from '@harnessio/ui/views'

import { noop } from '../../utils'

const executions: IExecution[] = [
  {
    id: '1',
    description: 'Execution description 1',
    name: 'Execution 1',
    sha: '1234567890',
    status: PipelineExecutionStatus.SUCCESS,
    started: 1734537015000,
    finished: 1734537035000,
    version: '1'
  },
  {
    id: '2',
    description: 'Execution description 2',
    name: 'Execution 2',
    sha: '2345678901',
    status: PipelineExecutionStatus.ERROR,
    started: 1734537025000,
    finished: 1734537035000,
    version: '1'
  },
  {
    id: '3',
    description: 'Execution description 2',
    name: 'Execution 2',
    sha: '3456789012',
    status: PipelineExecutionStatus.PENDING,
    started: 1734537035000,
    finished: 1734537038000,
    version: '1'
  }
]

export const useExecutionListStore = (): IExecutionListStore => ({
  page: 1,
  executions,
  setPage: noop,
  totalPages: 10,
  setExecutionsData: noop
})
