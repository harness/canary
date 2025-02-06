import { useEffect, useState } from 'react'

import { ExecutionHeader, ExecutionInfo, ExecutionState, ExecutionTabs, ExecutionTree } from '@harnessio/ui/views'

import { elements, logs, stages } from './mocks/mock-data'

export const ExecutionLogsView = () => {
  const [logLines, setLogLines] = useState(logs.slice(0, 20)) // Initial 20 logs
  const [currentIndex, setCurrentIndex] = useState(20)
  const [_intervalId, setIntervalId] = useState<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setLogLines(prev => {
        if (currentIndex >= logs.length) {
          clearInterval(interval)
          return prev
        }
        return [...prev, logs[currentIndex]]
      })

      setCurrentIndex(prev => prev + 1)
    }, 2000) // Append one log every 2 seconds

    setIntervalId(interval)
    return () => clearInterval(interval)
  }, [currentIndex])

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
            defaultSelectedId="initialize"
            elements={elements}
            onSelectNode={({ parentId, childId }: { parentId: string; childId: string }) => {
              console.log(`Selected node: Parent ${parentId}, Child ${childId}`)
            }}
          />
        </div>
        <div className="flex flex-col gap-4 border border-t-0 border-white/10">
          <ExecutionInfo
            logs={logLines}
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
