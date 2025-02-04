<<<<<<< HEAD
import { ExecutionHeader, ExecutionInfo, ExecutionTabs, ExecutionTree, PipelineStatus } from '@harnessio/ui/views'
=======
import { ExecutionHeader, ExecutionInfo, ExecutionTree, PipelineStatus } from '@harnessio/ui/views'
>>>>>>> c4607717a (feat: add pipeline status)

import { elements, logs, stages } from './mocks/mock-data'

export const ExecutionDetailsView = () => {
  return (
    <div className="flex flex-col">
      <ExecutionTabs />
      <ExecutionHeader
        commitName="8fbru3ix"
        branchName="master"
        title={{ number: 311, title: 'Alerting docs: adds sns integration' }}
      />
      <div className="grid p-4" style={{ gridTemplateColumns: '1fr 3fr' }}>
        <div>
          <PipelineStatus />
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
