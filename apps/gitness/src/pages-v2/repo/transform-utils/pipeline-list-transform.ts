import { ListPipelinesOkResponse } from '@harnessio/code-service-client'
import { IPipeline } from '@harnessio/ui/views'

import { getExecutionStatus, getMeterState } from '../../../utils/execution-utils'

export function apiPipelines2Pipelines(data: ListPipelinesOkResponse): IPipeline[] {
  return data.map(pipelineBody => ({
    id: pipelineBody.identifier ?? '',
    description: pipelineBody?.execution?.message,
    meter:
      pipelineBody.last_executions?.map((exec, idx) => ({
        id: exec.number?.toString() ?? idx.toString(),
        state: getMeterState(pipelineBody?.execution?.status)
      })) ?? [],
    name: pipelineBody.identifier,
    sha: pipelineBody?.execution?.after,
    timestamp: pipelineBody?.created,
    status: getExecutionStatus(pipelineBody?.execution?.status)
  }))
}
