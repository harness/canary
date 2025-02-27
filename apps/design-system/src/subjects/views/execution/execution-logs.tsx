import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useAnimateTree } from '@/hooks/useAnimateTree'
import { useLogs } from '@/hooks/useLogs'
import { useTranslationStore } from '@utils/viewUtils'

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
  const [status, setStatus] = useState<ExecutionState>(ExecutionState.RUNNING)
  const [elapsedTime, setElapsedTime] = useState('00:00')
  const [createdTimeElapsed, setCreatedTimeElapsed] = useState('00:00')
  const createdStartRef = useRef<number>(Date.now())
  const elapsedStartRef = useRef<number>(Date.now())

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

  const isAllSuccess = useMemo(
    () => updatedElements.every(node => node.status === ExecutionState.SUCCESS),
    [updatedElements]
  )

  useEffect(() => {
    setStatus(isAllSuccess ? ExecutionState.SUCCESS : ExecutionState.RUNNING)
  }, [isAllSuccess])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Created timer (always counts up from 0)
  useEffect(() => {
    createdStartRef.current = Date.now()

    const interval = setInterval(() => {
      const now = Date.now()
      const totalDiff = Math.floor((now - createdStartRef.current) / 1000)
      setCreatedTimeElapsed(formatTime(totalDiff))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Elapsed timer (stops when status changes to success)
  useEffect(() => {
    elapsedStartRef.current = Date.now()

    const interval = setInterval(() => {
      if (status === 'success') return

      const now = Date.now()
      const elapsedDiff = Math.floor((now - elapsedStartRef.current) / 1000)
      setElapsedTime(formatTime(elapsedDiff))
    }, 1000)

    return () => clearInterval(interval)
  }, [status])

  return (
    <div className="flex h-full flex-col">
      <ExecutionTabs useTranslationStore={useTranslationStore} />
      <ExecutionHeader
        commitName="8fbru3ix"
        branchName="master"
        title={{
          number: '311. ',
          title: 'Alerting docs: adds sns integration'
        }}
        storage="0 B"
        storageAverage="0 B / 250 MB"
        simpleOperation="27/100k"
        advancedOperations="2/50k"
        dataTransfer="4.21 kB/5 GB"
        branch="master"
        commit="b8bruh99h"
        status={status}
        buildTime={elapsedTime}
        createdTime={createdTimeElapsed}
        pipelineName="build scan push test - k8s - Clone 2"
      />
      <div className="border-borders-4 grid h-[inherit] border-t" style={{ gridTemplateColumns: '1fr 3fr' }}>
        <div className="border-borders-4 flex h-[calc(100vh-226px)] flex-col gap-4 border-r">
          <ExecutionTree
            defaultSelectedId={currentNode?.id ?? selectedStep?.id ?? elements[0].id}
            elements={updatedElements}
            onSelectNode={(selectedNode: NodeSelectionProps) => {
              setSelectedStep(selectedNode?.childNode)
            }}
          />
        </div>
        <div className="border-borders-4 flex flex-col gap-4">
          <ExecutionInfo useLogsStore={useLogsStore} onCopy={() => {}} onDownload={() => {}} onEdit={() => {}} />
        </div>
      </div>
    </div>
  )
}
