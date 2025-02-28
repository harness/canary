import { AddNode } from './add-node'
import { EndNode } from './end-node'
import { ParallelGroupNode } from './parallel-group-node'
import { SerialGroupNode } from './serial-group-node'
import { StageNode } from './stage-node'
import { StartNode } from './start-node'
import { StepNode } from './step-node'

export * from './components'

export const PipelineNodes = {
  AddNode,
  StageNode,
  StartNode,
  EndNode,
  StepNode,
  SerialGroupNode,
  ParallelGroupNode
}
