import { ContainerNode } from '@harnessio/pipeline-graph'

import { AddContentNode } from '../nodes/add-content-node'
import { EndContentNode } from '../nodes/end-content-node'
import { ParallelStageGroupContentNode } from '../nodes/parallel-stage-group-content-node'
import { ParallelStepGroupContentNode } from '../nodes/parallel-step-group-content-node'
import { SerialStageGroupContentNode } from '../nodes/serial-stage-group-content-node'
import { SerialStepGroupContentNode } from '../nodes/serial-step-group-content-node'
import { StageContentNode } from '../nodes/stage-content-node'
import { StartContentNode } from '../nodes/start-content-node'
import { StepContentNode } from '../nodes/step-content-node'
import { ContentNodeType } from '../types/content-node-type'
import { ContentNodeFactory } from './content-node-factory'

export const contentNodeBank = new ContentNodeFactory()

// NOTE: Add node is used only whe pipeline is empty
contentNodeBank.registerEntity(ContentNodeType.Add, {
  type: ContentNodeType.Add,
  component: AddContentNode,
  containerType: ContainerNode.leaf
})

// --

contentNodeBank.registerEntity(ContentNodeType.Start, {
  type: ContentNodeType.Start,
  component: StartContentNode,
  containerType: ContainerNode.leaf
})

contentNodeBank.registerEntity(ContentNodeType.End, {
  type: ContentNodeType.End,
  component: EndContentNode,
  containerType: ContainerNode.leaf
})

// ---

contentNodeBank.registerEntity(ContentNodeType.Step, {
  type: ContentNodeType.Step,
  component: StepContentNode,
  containerType: ContainerNode.leaf
})

contentNodeBank.registerEntity(ContentNodeType.ParallelStepGroup, {
  type: ContentNodeType.ParallelStepGroup,
  component: ParallelStepGroupContentNode,
  containerType: ContainerNode.parallel
})

contentNodeBank.registerEntity(ContentNodeType.SerialStepGroup, {
  type: ContentNodeType.SerialStepGroup,
  component: SerialStepGroupContentNode,
  containerType: ContainerNode.serial
})

contentNodeBank.registerEntity(ContentNodeType.Stage, {
  type: ContentNodeType.Stage,
  component: StageContentNode,
  containerType: ContainerNode.serial
})

contentNodeBank.registerEntity(ContentNodeType.ParallelStageGroup, {
  type: ContentNodeType.ParallelStageGroup,
  component: ParallelStageGroupContentNode,
  containerType: ContainerNode.parallel
})

contentNodeBank.registerEntity(ContentNodeType.SerialStageGroup, {
  type: ContentNodeType.SerialStageGroup,
  component: SerialStageGroupContentNode,
  containerType: ContainerNode.serial
})
