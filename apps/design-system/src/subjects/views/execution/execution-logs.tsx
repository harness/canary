import { useCallback, useEffect, useState } from 'react'

import { useAnimateTree } from '@/hooks/useAnimateTree'
import { useLogs } from '@/hooks/useLogs'

import { TreeViewElement } from '@harnessio/ui/components'
import {
  ExecutionHeader,
  ExecutionInfo,
  ExecutionState,
  ExecutionTabs,
  ExecutionTree,
  ILogsStore,
  LivelogLine,
  NodeSelectionProps
} from '@harnessio/ui/views'

import { elements, logsBank, stages } from './mocks/mock-data'

const getLogsForCurrentNode = (currentNode: TreeViewElement | null | undefined): LivelogLine[] => {
  const logKey = currentNode?.id ?? ''
  const logs = logKey ? logsBank[logKey] : []
  return logs
}

export const ExecutionLogsView = () => {
  const [shouldStream, setShouldStream] = useState(false)
  const [logs, setLogs] = useState<LivelogLine[]>([])
  const [selectedStep, setSelectedStep] = useState<TreeViewElement | undefined | null>(null)

  const { updatedElements, currentNode } = useAnimateTree({ nodes: elements }) // animates the execution tree

  useEffect(() => {
    setShouldStream(true)
    setLogs(getLogsForCurrentNode(currentNode))
  }, [currentNode?.id])

  useEffect(() => {
    if (selectedStep?.status === ExecutionState.PENDING) {
      setLogs([])
    } else if (selectedStep?.status === ExecutionState.RUNNING) {
      setShouldStream(true)
      setLogs(getLogsForCurrentNode(selectedStep))
    } else if (selectedStep?.status === ExecutionState.SUCCESS) {
      setShouldStream(false)
      setLogs(getLogsForCurrentNode(selectedStep))
    }
    // if (intervalId) clearInterval(intervalId)
  }, [selectedStep])

  // animates the logs
  const { logs: streamedLogs } = useLogs({
    logs,
    isStreaming: shouldStream
  })

  const useLogsStore = useCallback(
    (): ILogsStore => ({
      logs: streamedLogs
    }),
    [streamedLogs]
  )

  return (
    <div className="flex h-full flex-col">
      <ExecutionTabs />
      <ExecutionHeader
        commitName="8fbru3ix"
        branchName="master"
        title={{ number: '311. ', title: 'Alerting docs: adds sns integration' }}
        storage="0 B"
        storageAverage="0 B / 250 MB"
        simpleOperation="27/100k"
        advancedOperations="2/50k"
        dataTransfer="4.21 kB/5 GB"
        branch="master"
        commit="b8bruh99h"
        status={ExecutionState.RUNNING}
        buildTime="1h 30m"
        createdTime="10 mins ago"
        pipelineName="build scan push test - k8s - Clone 2"
      />
      <div className="grid h-[inherit]" style={{ gridTemplateColumns: '1fr 3fr' }}>
        <div className="flex flex-col gap-4 border border-r-0 border-t-0 border-white/10 pt-4">
          <ExecutionTree
            defaultSelectedId={currentNode?.id ?? selectedStep?.id ?? elements[0].id}
            elements={updatedElements}
            onSelectNode={(selectedNode: NodeSelectionProps) => {
              setSelectedStep(selectedNode?.childNode)
            }}
          />
        </div>
        <div className="flex flex-col gap-4 border border-t-0 border-white/10">
          <ExecutionInfo
            useLogsStore={useLogsStore}
            onCopy={() => {}}
            onDownload={() => {}}
            onEdit={() => {}}
            selectedStepIdx={0}
            stage={stages[0]}
          />
        </div>
      </div>
    </div>
  )
}
