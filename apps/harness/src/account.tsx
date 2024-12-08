import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ExecutionState, MeterState, PipelineList, SandboxLayout, type IPipeline } from '@harnessio/ui/views'

function mapExecutionStatusToMeterState(status: string): MeterState {
  switch (status) {
    case 'Success':
      return MeterState.Success
    case 'Failed':
      return MeterState.Error
    case 'Running':
      return MeterState.Warning
    default:
      return MeterState.Empty
  }
}

function mapExecutionStatusToExecutionState(status: string): ExecutionState {
  switch (status) {
    case 'Success':
      return ExecutionState.SUCCESS
    case 'Failed':
      return ExecutionState.FAILURE
    case 'Running':
      return ExecutionState.RUNNING
    default:
      return ExecutionState.UNKNOWN
  }
}

export default function Account() {
  const [accountId] = useState(localStorage.getItem('accountId'))
  const [pipelines, setPipelines] = useState([
    {
      id: 'pipeline-1',
      name: 'Pipeline 1',
      status: ExecutionState.SUCCESS,
      timestamp: '2021-09-01T12:00:00Z',
      meter: [{ state: 3 }]
    },
    {
      id: 'pipeline-2',
      name: 'Pipeline 2',
      status: ExecutionState.FAILURE,
      timestamp: '2021-09-01T12:00:00Z',
      meter: [{ state: 3 }]
    }
  ])
  const navigate = useNavigate()

  useEffect(() => {
    if (!accountId) {
      navigate('/signin')
    }

    fetch(
      `/pipeline/api/pipelines/list?routingId=${accountId}&accountIdentifier=${accountId}&projectIdentifier=abhinavtest3&orgIdentifier=default`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          filterType: 'PipelineSetup'
        })
      }
    )
      .then(res => res.json())
      .then(res => {
        setPipelines(
          res.data.content.map(pipeline => {
            const lastExecution = pipeline.recentExecutionsInfo?.[0]
            return {
              id: pipeline.identifier,
              name: pipeline.name,
              status: lastExecution ? mapExecutionStatusToExecutionState(lastExecution.status) : undefined,
              timestamp: pipeline.lastUpdatedAt,
              description: lastExecution
                ? `${lastExecution.executorInfo.triggerType} by ${lastExecution.executorInfo.username}`
                : undefined,
              meter: pipeline.recentExecutionsInfo?.map(execution => {
                return {
                  id: execution.identifier,
                  state: mapExecutionStatusToMeterState(execution.status)
                }
              })
            } satisfies IPipeline
          })
        )
      })
  }, [])

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <PipelineList pipelines={pipelines} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
