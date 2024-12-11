import { LeafNodeInternalType } from '@harnessio/pipeline-graph'

export interface EndNodeDataType {}

export function EndNode(_props: { node: LeafNodeInternalType<EndNodeDataType> }) {
  return (
    <div className="flex size-full items-center justify-center rounded-full border border-borders-6 bg-primary-foreground">
      {/* TODO: replace with icon */}
      <div className="size-2.5 bg-success"></div>
    </div>
  )
}
