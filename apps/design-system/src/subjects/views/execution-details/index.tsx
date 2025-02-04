import { ExecutionHeader, ExecutionInfo, ExecutionTabs, ExecutionTree, PipelineStatus } from '@harnessio/ui/views'

import { elements, logs, stages } from './mocks/mock-data'

export const ExecutionDetailsView = () => {
  return (
    <div className="flex flex-col">
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
      <div className="grid p-4" style={{ gridTemplateColumns: '1fr 3fr' }}>
        <div>
          <PipelineStatus status="Running" buildTime="1h 30m" createdTime="10 mins ago" />
          <ExecutionTree
            defaultSelectedId="initialize"
            elements={elements}
            onSelectNode={({ parentId, childId }: { parentId: string; childId: string }) => {
              console.log(`Selected node: Parent ${parentId}, Child ${childId}`)
            }}
          />
        </div>
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
  )
}
