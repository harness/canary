import { PipelineNodes } from '@harnessio/ui/components'

import { LeafNodeInternalType } from '@harnessio/pipeline-graph'

export interface StartNodeDataType {}

export function StartContentNode(_props: { node: LeafNodeInternalType<StartNodeDataType> }) {
  return <PipelineNodes.StartNode />
}
