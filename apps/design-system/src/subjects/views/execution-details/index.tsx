import { ExecutionHeader, ExecutionInfo, ExecutionTree } from '@harnessio/ui/views'

import { elements, logs, stages } from './mocks/mock-data'

export const ExecutionDetailsView = () => {
  return (
    <div className="flex flex-col">
      <ExecutionHeader />
      <div className="flex flex-1">
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
