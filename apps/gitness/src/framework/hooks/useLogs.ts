import { useEffect, useRef, useState } from 'react'

import { LivelogLine } from '@harnessio/code-service-client'
import { ExecutionState } from '@harnessio/views'

interface UseLogsReturnType {
  logs: LivelogLine[]
}

enum LogsSSEEvent {
  MESSAGE = 'message'
}

interface UseLogsInterface {
  repoPath: string
  pipelineId: string
  stageNum: number
  stepNum: number
  stepStatus?: ExecutionState
  executionNum: string
}

export const useLogs = ({
  repoPath,
  pipelineId,
  stageNum,
  stepNum,
  stepStatus,
  executionNum
}: UseLogsInterface): UseLogsReturnType => {
  const [logs, setLogs] = useState<LivelogLine[]>([])
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (stepStatus === ExecutionState.RUNNING) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      eventSourceRef.current = new EventSource(
        `/api/v1/repos/${repoPath}/pipelines/${pipelineId}/executions/${executionNum}/logs/${String(
          stageNum
        )}/${String(stepNum)}/stream`
      )
      eventSourceRef.current.onmessage = (event: MessageEvent<string>) => {
        try {
          if (event.type === LogsSSEEvent.MESSAGE) {
            const newLog = JSON.parse(event.data)
            setLogs((existingLogs: LivelogLine[]) => [...existingLogs, newLog])
          }
        } catch (_e) {
          //ignore error
        }
      }
    }
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close()
      setLogs([])
    }
  }, [executionNum, pipelineId, repoPath, stageNum, stepNum, stepStatus])
  return { logs }
}
