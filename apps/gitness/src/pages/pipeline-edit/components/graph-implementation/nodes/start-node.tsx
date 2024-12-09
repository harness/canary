import { Icon } from '@harnessio/canary'
import { LeafNodeInternalType } from '@harnessio/pipeline-graph'

export interface StartNodeDataType {}

export function StartNode(_props: { node: LeafNodeInternalType<StartNodeDataType> }) {
  return (
    <div className="flex size-full items-center justify-center rounded-full border border-borders-6 bg-primary-foreground">
      <Icon name="play" className="text-success" />
    </div>
  )
}
