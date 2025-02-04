import {
  ExecutionHeader,
  ExecutionInfo,
  ExecutionState,
  ExecutionTabs,
  ExecutionTree,
  PipelineStatus
} from '@harnessio/ui/views'

import { elements, logs, stages } from './mocks/mock-data'

export const ExecutionDetailsView = () => {
  return (
    <div className="flex flex-col h-full">
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
      />
      <div className="grid h-[inherit]" style={{ gridTemplateColumns: '1fr 3fr' }}>
        <div className="flex flex-col gap-4 border border-white/10 border-r-0 border-t-0">
          <PipelineStatus status={ExecutionState.RUNNING} buildTime="1h 30m" createdTime="10 mins ago" />
          <ExecutionTree
            defaultSelectedId="initialize"
            elements={elements}
            onSelectNode={({ parentId, childId }: { parentId: string; childId: string }) => {
              console.log(`Selected node: Parent ${parentId}, Child ${childId}`)
            }}
          />
        </div>
        <div className="flex flex-col gap-4 border border-white/10 border-t-0">
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
