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

import { elements, logsBank } from './mocks/mock-data'

const getRandomDuration = (): number => Math.random() * (5 - 1) + 1

const getLogsForCurrentNodeId = (logKey: string): LivelogLine[] => {
  return (logsBank[logKey] ?? []).map((log: LivelogLine) => ({
    ...log,
    duration: getRandomDuration()
  }))
}

export const ExecutionLogsView = () => {
  const [enableStream, setEnableStream] = useState(false)
  const [logs, setLogs] = useState<LivelogLine[]>([])
  const [selectedStep, setSelectedStep] = useState<TreeViewElement | null | undefined>(null)

  const { updatedElements, currentNode } = useAnimateTree({ elements, delay: 2 }) // Animates the execution tree

  const { logs: streamedLogs } = useLogs({ logs, isStreaming: enableStream, delay: 0.0 }) // Animates the logs

  const useLogsStore = useCallback<() => ILogsStore>(() => ({ logs: streamedLogs }), [streamedLogs])
  useEffect(() => {
    setEnableStream(true)
    setLogs(getLogsForCurrentNodeId(currentNode?.id || ''))
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
        setLogs(getLogsForCurrentNodeId(selectedStep?.id || ''))
        break
    }
  }, [selectedStep])

  const updateHighLevelStatus = (elements: TreeViewElement[]) => {
    if (elements.every(node => node.status === ExecutionState.SUCCESS)) {
      return ExecutionState.SUCCESS
    }
    return ExecutionState.RUNNING
  }

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
        status={updateHighLevelStatus(updatedElements)}
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
          <ExecutionInfo useLogsStore={useLogsStore} onCopy={() => {}} onDownload={() => {}} onEdit={() => {}} />
        </div>
      </div>
    </div>
  )
}
