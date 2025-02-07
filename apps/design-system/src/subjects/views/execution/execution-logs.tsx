import { useEffect, useState } from 'react'

import { ScrollArea } from '@harnessio/ui/components'
import { ExecutionHeader, ExecutionInfo, ExecutionState, ExecutionTabs, ExecutionTree } from '@harnessio/ui/views'

import { elements, logs, stages } from './mocks/mock-data'

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const hours = Math.floor(minutes / 60)
  return hours > 0
    ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    : `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const ExecutionLogsView = () => {
  const [buildTime, setBuildTime] = useState<number>(30)

  useEffect(() => {
    const interval = setInterval(() => {
      setBuildTime(buildTime + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [buildTime])

  return (
    <div className="flex h-full flex-col">
      <ExecutionTabs />
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
        status={ExecutionState.RUNNING}
        buildTime={formatTime(buildTime)}
        createdTime="10 mins ago"
        pipelineName="build scan push test - k8s - Clone 2"
      />
      <div className="border-borders-4 grid h-[inherit] border-t " style={{ gridTemplateColumns: '1fr 3fr' }}>
        <div className="border-borders-4 flex h-[calc(100vh-226px)] flex-col gap-4 border-r">
          <ScrollArea className="pt-4">
            <ExecutionTree
              defaultSelectedId="initialize"
              elements={elements}
              onSelectNode={({ parentId, childId }: { parentId: string; childId: string }) => {
                console.log(`Selected node: Parent ${parentId}, Child ${childId}`)
              }}
            />
          </ScrollArea>
        </div>
        <div className="border-borders-4 flex flex-col gap-4">
          <ExecutionInfo
            logs={logs}
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
