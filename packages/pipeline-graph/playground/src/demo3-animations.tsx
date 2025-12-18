import React, { useEffect, useRef, useState } from 'react'

import { cloneDeep } from 'lodash-es'
import { parse } from 'yaml'

import { CanvasProvider } from '../../src/context/canvas-provider'
import { PipelineGraph } from '../../src/pipeline-graph'
import { NodeContent } from '../../src/types/node-content'
import { AnyContainerNodeType, ContainerNode, LeafContainerNodeType } from '../../src/types/nodes'
import { CanvasControls } from './canvas/CanvasControls'
import { ApprovalNode } from './nodes/approval-node'
import { EndNode } from './nodes/end-node'
import { ParallelGroupNodeContent } from './nodes/parallel-group-node'
import { SerialGroupContentNode } from './nodes/stage-node'
import { StartNode } from './nodes/start-node'
import { StepNode, StepNodeDataType } from './nodes/step-node'
import { getIcon } from './parser/utils'
import { yaml2Nodes } from './parser/yaml2AnyNodes'
import { pipeline } from './sample-data/simple-pipeline'
import { ContentNodeTypes } from './types/content-node-types'

const nodes: NodeContent[] = [
  {
    type: ContentNodeTypes.start,
    containerType: ContainerNode.leaf,
    component: StartNode
  },
  {
    type: ContentNodeTypes.end,
    containerType: ContainerNode.leaf,
    component: EndNode
  },
  {
    type: ContentNodeTypes.step,
    containerType: ContainerNode.leaf,
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
    component: SerialGroupContentNode
  } as NodeContent
]

const yamlObject = parse(pipeline)
const plData = yaml2Nodes(yamlObject)

const endNode = {
  type: ContentNodeTypes.start,
  config: {
    width: 80,
    height: 80
  },
  data: {}
}

plData.unshift(endNode)

function Demo3Animation() {
  const dataRef = useRef(plData)
  const [data, setData] = useState<AnyContainerNodeType[]>(plData)

  useEffect(() => {
    const update = () => {
      const newData = cloneDeep(dataRef.current)

      const node = {
        type: ContentNodeTypes.step,
        data: {
          yamlPath: 'qwe-' + Math.random(),
          name: 'step',
          icon: getIcon(1),
          state: 'executing'
        } satisfies StepNodeDataType
      } satisfies LeafContainerNodeType

      newData.push(cloneDeep(node))

      dataRef.current = cloneDeep(newData)
      setData(newData)
    }

    update()

    setInterval(() => {
      update()
    }, 3000)
  }, [])

  return (
    <CanvasProvider>
      <PipelineGraph data={data} nodes={nodes} />
      <CanvasControls />
    </CanvasProvider>
  )
}

export default Demo3Animation
