import { ContainerNode } from '@harnessio/pipeline-graph'
import { ContentNodeFactory, ContentNodeType } from '@harnessio/ui/views'

import { CustomEndContentNode } from './nodes/custom-end-content-node'
import { CustomParallelStageGroupContentNode } from './nodes/custom-parallel-stage-group-content-node'
import { CustomSerialStageGroupContentNode } from './nodes/custom-serial-stage-group-content-node'
import { CustomSerialStepGroupContentNode } from './nodes/custom-serial-step-group-content-node'
import { CustomStageContentNode } from './nodes/custom-stage-content-node'
import { CustomStartContentNode } from './nodes/custom-start-content-node'
import { CustomStepContentNode } from './nodes/custom-step-node'

export const contentNodeFactory = new ContentNodeFactory()

// --- UI RELATED ---

contentNodeFactory.registerEntity(ContentNodeType.Start, {
  type: ContentNodeType.Start,
  component: CustomStartContentNode,
  containerType: ContainerNode.leaf
})

contentNodeFactory.registerEntity(ContentNodeType.End, {
  type: ContentNodeType.End,
  component: CustomEndContentNode,
  containerType: ContainerNode.leaf
})

// --- STEP REPLATED ---

contentNodeFactory.registerEntity(ContentNodeType.Step, {
  type: ContentNodeType.Step,
  component: CustomStepContentNode,
  containerType: ContainerNode.leaf
})

contentNodeFactory.registerEntity(ContentNodeType.ParallelStepGroup, {
  type: ContentNodeType.ParallelStepGroup,
  component: CustomParallelStageGroupContentNode,
  containerType: ContainerNode.parallel
})

contentNodeFactory.registerEntity(ContentNodeType.SerialStepGroup, {
  type: ContentNodeType.SerialStepGroup,
  component: CustomSerialStepGroupContentNode,
  containerType: ContainerNode.serial
})

// --- STAGE REPLATED ---

contentNodeFactory.registerEntity(ContentNodeType.Stage, {
  type: ContentNodeType.Stage,
  component: CustomStageContentNode,
  containerType: ContainerNode.serial
})

contentNodeFactory.registerEntity(ContentNodeType.ParallelStageGroup, {
  type: ContentNodeType.ParallelStageGroup,
  component: CustomParallelStageGroupContentNode,
  containerType: ContainerNode.parallel
})

contentNodeFactory.registerEntity(ContentNodeType.SerialStageGroup, {
  type: ContentNodeType.SerialStageGroup,
  component: CustomSerialStageGroupContentNode,
  containerType: ContainerNode.serial
})
