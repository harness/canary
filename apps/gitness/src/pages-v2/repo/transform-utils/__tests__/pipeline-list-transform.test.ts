import { EnumCiStatus, ListPipelinesOkResponse } from '@harnessio/code-service-client'

import { apiPipelines2Pipelines } from '../pipeline-list-transform'

// Mock data
const mockPipelines: ListPipelinesOkResponse = [
  {
    identifier: 'pipeline1',
    execution: { message: 'Execution message', status: 'SUCCESS' as EnumCiStatus, after: 'sha123' },
    last_executions: [{ number: 1 }],
    created: 1741027200000 // '2025-03-01T00:00:00Z' in milliseconds since Unix epoch
  }
]

// Tests

describe('apiPipelines2Pipelines', () => {
  it('should transform pipeline data correctly', () => {
    const result = apiPipelines2Pipelines(mockPipelines)
    expect(result).toEqual([
      {
        id: 'pipeline1',
        description: 'Execution message',
        meter: [{ id: '1', state: 0 }],
        name: 'pipeline1',
        sha: 'sha123',
        timestamp: 1741027200000,
        status: 'unknown'
      }
    ])
  })
})
