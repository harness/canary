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
  return logKey ? logsBank[logKey] : []
}

export const ExecutionLogsView = () => {
  const [enableStream, setEnableStream] = useState(false)
  const [logs, setLogs] = useState<LivelogLine[]>([])
  const [selectedStep, setSelectedStep] = useState<TreeViewElement | null | undefined>(null)

  const { updatedElements, currentNode } = useAnimateTree({ elements, delay: 10 }) // Animates the execution tree

  useEffect(() => {
    setEnableStream(true)
    setLogs(getLogsForCurrentNode(currentNode))
  }, [currentNode?.id])

  useEffect(() => {
    if (!selectedStep) return

    switch (selectedStep.status) {
      case ExecutionState.PENDING:
        setLogs([])
        break
      case ExecutionState.RUNNING:
      case ExecutionState.SUCCESS:
        setEnableStream(selectedStep.status === ExecutionState.RUNNING)
        setLogs(getLogsForCurrentNode(selectedStep))
        break
    }
  }, [selectedStep])

  // Animates the logs
  const { logs: streamedLogs } = useLogs({ logs, isStreaming: enableStream })

  const useLogsStore = useCallback<() => ILogsStore>(() => ({ logs: streamedLogs }), [streamedLogs])

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
