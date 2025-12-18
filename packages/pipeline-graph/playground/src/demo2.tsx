import React, { useState } from 'react'

import { parse } from 'yaml'

import { CanvasProvider } from '../../src/context/canvas-provider'
import { PipelineGraph } from '../../src/pipeline-graph'
import { NodeContent } from '../../src/types/node-content'
import { AnyContainerNodeType, ContainerNode, LeafContainerNodeType } from '../../src/types/nodes'
import { CanvasControls } from './canvas/CanvasControls'
import { ApprovalNode } from './nodes/approval-node'
import { EndNode } from './nodes/end-node'
import { ParallelGroupNodeContent } from './nodes/parallel-group-node'
import { SerialGroupNodeContent } from './nodes/serial-group-node'
import { StageContentNode } from './nodes/stage-node'
import { StartNode } from './nodes/start-node'
import { StepNode } from './nodes/step-node'
import { yaml2Nodes } from './parser/yaml2AnyNodes'
import { pipeline } from './sample-data/pipeline'
import { ContentNodeTypes } from './types/content-node-types'

import './sample-data/pipeline-data'

const nodes: NodeContent[] = [
  {
    type: ContentNodeTypes.start,
    component: StartNode,
    containerType: ContainerNode.leaf
  },
  {
    type: ContentNodeTypes.end,
    containerType: ContainerNode.leaf,
    component: EndNode
  },
  {
    containerType: ContainerNode.leaf,
    type: ContentNodeTypes.step,
    component: StepNode
  },
  {
    containerType: ContainerNode.leaf,
    type: ContentNodeTypes.approval,
    component: ApprovalNode
  },
  {
    type: ContentNodeTypes.parallel,
    containerType: ContainerNode.parallel,
    component: ParallelGroupNodeContent
  } as NodeContent,
  {
    type: ContentNodeTypes.serial,
    containerType: ContainerNode.serial,
    component: SerialGroupNodeContent
  } as NodeContent,
  {
    type: ContentNodeTypes.stage,
    containerType: ContainerNode.serial,
    component: StageContentNode
  } as NodeContent
]

const yamlObject = parse(pipeline)
const plData = yaml2Nodes(yamlObject)

const startNode = {
  type: ContentNodeTypes.start,
  config: {
    width: 60,
    height: 160,
    hideDeleteButton: true,
    hideBeforeAdd: true,
    hideLeftPort: true
  },
  data: {}
} satisfies LeafContainerNodeType

const endNode = {
  type: ContentNodeTypes.end,
  config: {
    width: 60,
    height: 160,
    hideDeleteButton: true,
    hideAfterAdd: true,
    hideRightPort: true
  },
  data: {}
} satisfies LeafContainerNodeType

plData.unshift(startNode)
plData.push(endNode)

function Demo2() {
  const [data] = useState<AnyContainerNodeType[]>(plData)

  return (
    <CanvasProvider>
      <PipelineGraph
        customCreateSVGPath={props => {
          const { id, path, targetNode } = props
          const pathStyle = targetNode?.data.state === 'executed' ? ` stroke="#00ff00"` : ` stroke="#ff00ff"`
          const staticPath = `<path d="${path}" id="${id}" fill="none" ${pathStyle}  stroke-width="1"/>`
          return { level1: staticPath, level2: '' }
        }}
        // portComponent={CustomPort}
        // edgesConfig={{ radius: 2, parallelNodeOffset: 6, serialNodeOffset: 6 }}
        // serialContainerConfig={{
        //   nodeGap: 16,
        //   paddingBottom: 5,
        //   paddingLeft: 10,
        //   paddingRight: 10,
        //   paddingTop: 60,
        //   serialGroupAdjustment: 30
        // }}
        // parallelContainerConfig={{
        //   nodeGap: 16,
        //   paddingBottom: 5,
        //   paddingLeft: 16,
        //   paddingRight: 16,
        //   paddingTop: 60,
        //   parallelGroupAdjustment: 30
        // }}
        config={{ leftGap: 100 }}
        // edgesConfig={{ parallelNodeOffset: 8, serialNodeOffset: 8, radius: 4 }}
        serialContainerConfig={{
          nodeGap: 16,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          serialGroupAdjustment: 0
        }}
        parallelContainerConfig={{
          nodeGap: 16,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          parallelGroupAdjustment: 0
        }}
        data={data}
        nodes={nodes}
      />
      <CanvasControls />
    </CanvasProvider>
  )
}

export default Demo2
