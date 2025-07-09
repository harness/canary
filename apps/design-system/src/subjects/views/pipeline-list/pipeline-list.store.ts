import { noop } from '@utils/viewUtils'

import { MeterState } from '@harnessio/ui/components'
import { IPipeline, IPipelineListStore, PipelineExecutionStatus } from '@harnessio/ui/views'

const pipelines: IPipeline[] = [
  {
    id: '1',
    description: 'Pipeline description 1',
    meter: [
      { id: '1', state: MeterState.Warning },
      { id: '2', state: MeterState.Success },
      { id: '3', state: MeterState.Error },
      { id: '4', state: MeterState.Warning },
      { id: '5', state: MeterState.Success },
      { id: '6', state: MeterState.Error },
      { id: '7', state: MeterState.Warning },
      { id: '8', state: MeterState.Success }
    ],
    name: 'Pipeline 1',
    sha: '1234567890',
    status: PipelineExecutionStatus.SUCCESS,
    timestamp: 1734537035000,
    version: '1'
  },
  {
    id: '2',
    description: 'Pipeline description 2',
    meter: [
      { id: '7', state: MeterState.Warning },
      { id: '8', state: MeterState.Success },
      { id: '9', state: MeterState.Error }
    ],
    name: 'Pipeline 2',
    sha: '2345678901',
    status: PipelineExecutionStatus.ERROR,
    timestamp: 1734537035000,
    version: '1'
  },
  {
    id: '3',
    description: 'Pipeline description 2',
    meter: [],
    name: 'Pipeline 2',
    sha: '3456789012',
    status: PipelineExecutionStatus.PENDING,
    timestamp: 1734537035000,
    version: '1'
  },
  {
    id: '4',
    name: 'Pipeline name only',
    meter: [],
    timestamp: 1734537035000
  }
]

export const usePipelineListStore = (): IPipelineListStore => ({
  page: 1,
  pipelines,
  setPage: noop,
  setPipelinesData: noop,
  totalItems: 10,
  pageSize: 10
})
