import { useEffect, useState } from 'react'

import { parse } from 'yaml'

import {
  AnyNodeType,
  CanvasProvider,
  ContainerNode,
  LeafNodeType,
  NodeContent,
  PipelineGraph
} from '@harnessio/pipeline-graph'

import { usePipelineDataContext } from '../context/PipelineStudioDataProvider'
// import { usePipelineViewContext } from '../context/PipelineStudioViewProvider'
import { yaml2Nodes } from '../utils/yaml-to-pipeline-graph'
import { CanvasControls } from './graph-implementation/canvas/CanvasControls'
import { ContentNodeTypes } from './graph-implementation/content-node-types'
import { EndNode } from './graph-implementation/nodes/end-node'
import { ParallelGroupNodeContent } from './graph-implementation/nodes/parallel-group-node'
import { SerialGroupNodeContent } from './graph-implementation/nodes/stage-node'
import { StartNode } from './graph-implementation/nodes/start-node'
import { StepNode } from './graph-implementation/nodes/step-node'

import '@harnessio/pipeline-graph/dist/index.css'

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
    type: ContentNodeTypes.step,
    containerType: ContainerNode.leaf,
    component: StepNode
  },
  {
    type: ContentNodeTypes.parallel,
    containerType: ContainerNode.parallel,
    component: ParallelGroupNodeContent
  },
  {
    type: ContentNodeTypes.serial,
    containerType: ContainerNode.serial,
    component: SerialGroupNodeContent
  },
  {
    type: ContentNodeTypes.stage,
    containerType: ContainerNode.serial,
    component: SerialGroupNodeContent
  }
]

const startNode = {
  type: ContentNodeTypes.start,
  config: {
    width: 80,
    height: 80,
    hideDeleteButton: true,
    hideBeforeAdd: true,
    hideLeftPort: true
  }
} satisfies LeafNodeType

const endNode = {
  type: ContentNodeTypes.end,
  config: {
    width: 80,
    height: 80,
    hideDeleteButton: true,
    hideAfterAdd: true,
    hideRightPort: true
  }
} satisfies LeafNodeType

export const PipelineStudioGraphView = (): React.ReactElement => {
  const {
    state: { yamlRevision }
    // setEditStepIntention
  } = usePipelineDataContext()
  // const { setStepDrawerOpen } = usePipelineViewContext()

  const [data, setData] = useState<AnyNodeType[]>([])

  useEffect(() => {
    return () => {
      setData([])
    }
  }, [])

  useEffect(() => {
    const yamlJson = parse(yamlRevision.yaml)
    const newData = yaml2Nodes(yamlJson)
    newData.unshift(startNode)
    newData.push(endNode)
    setData(newData)
  }, [yamlRevision])

  return (
    <div className="relative flex size-full">
      <CanvasProvider>
        <PipelineGraph
          data={data}
          nodes={nodes}
          onAdd={() => undefined}
          onDelete={() => undefined}
          onSelect={() => undefined}
        />
        <CanvasControls />
      </CanvasProvider>
    </div>
  )
}
