import { ExecutionHeader, ExecutionInfo, ExecutionTabs, ExecutionTree } from '@harnessio/ui/views'

import { elements, logs, stages } from './mocks/mock-data'

export const ExecutionDetailsView = () => {
  return (
    <div className="flex flex-col">
      <ExecutionTabs />
      <ExecutionHeader commitName="8fbru3ix" branchName="master" title="#311. Alerting docs: adds sns integration" />
      <div className="grid p-4" style={{ gridTemplateColumns: '1fr 3fr' }}>
        <ExecutionTree
          defaultSelectedId="initialize"
          elements={elements}
          onSelectNode={({ parentId, childId }: { parentId: string; childId: string }) => {
            console.log(`Selected node: Parent ${parentId}, Child ${childId}`)
          }}
        />
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
