import { useCallback, useEffect, useState } from 'react'

import { useLogs } from '@/hooks/useLogs'
import { useTree } from '@/hooks/useTree'

import { TreeViewElement } from '@harnessio/ui/components'
import {
  ExecutionHeader,
  ExecutionInfo,
  ExecutionState,
  ExecutionTabs,
  ExecutionTree,
  ILogsStore,
  NodeSelectionProps
} from '@harnessio/ui/views'

import { elements, logs, stages } from './mocks/mock-data'

export const ExecutionLogsView = () => {
  const [currentStep, setCurrentStep] = useState<TreeViewElement | null | undefined>(null)
  const { nodes: updatedElements, currentParent, currentChild } = useTree(elements)

  const { logs: currentLogs, timerId } = useLogs({
    logs: currentStep ? (currentStep?.status === ExecutionState.PENDING ? [] : logs) : [],
    isStreaming: currentStep?.status === ExecutionState.RUNNING
  })

  const useLogsStore = useCallback(
    (): ILogsStore => ({
      logs: currentLogs
    }),
    [currentLogs]
  )

  useEffect(() => {
    setCurrentStep(currentChild)
  }, [currentChild])

  useEffect(() => {
    if (timerId) {
      clearInterval(timerId)
    }
  }, [currentParent, currentChild])

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
            defaultSelectedId={currentStep?.id ?? elements[0]?.children?.[0]?.id ?? ''}
            elements={updatedElements}
            onSelectNode={(selectedNode: NodeSelectionProps) => {
              setCurrentStep(selectedNode?.childNode)
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
