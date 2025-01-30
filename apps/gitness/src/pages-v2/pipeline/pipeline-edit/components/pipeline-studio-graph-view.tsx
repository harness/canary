import { useEffect, useState } from 'react'

import { parse } from 'yaml'

import {
  AnyContainerNodeType,
  CanvasProvider,
  ContainerNode,
  NodeContent,
  PipelineGraph
} from '@harnessio/pipeline-graph'

import { usePipelineDataContext } from '../context/PipelineStudioDataProvider'
import { CanvasControls } from './graph-implementation/canvas/canvas-controls'
import { ContentNodeTypes } from './graph-implementation/content-node-types'
import { EndNode } from './graph-implementation/nodes/end-node'
import { StartNode } from './graph-implementation/nodes/start-node'
import { StepNode } from './graph-implementation/nodes/step-node'
import { yaml2Nodes } from './graph-implementation/utils/yaml-to-pipeline-graph'

import '@harnessio/pipeline-graph/dist/index.css'

import { NodeContextProvider } from '../context/NodeContextMenuProvider'
import { AddNode, AddNodeDataType } from './graph-implementation/nodes/add-node'
import { CommonNodeContextMenu } from './graph-implementation/nodes/common/CommonContextMenu'
import { ParallelGroupContentNode } from './graph-implementation/nodes/parallel-group-node'
import { SerialGroupContentNode } from './graph-implementation/nodes/serial-group-node'
import { StageContentNode } from './graph-implementation/nodes/stage-node'
import { YamlEntityType } from './graph-implementation/types/nodes'

const nodes: NodeContent[] = [
  {
    type: ContentNodeTypes.add,
    component: AddNode,
    containerType: ContainerNode.leaf
  },
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
  } as NodeContent,
  {
    type: ContentNodeTypes.parallel,
    containerType: ContainerNode.parallel,
    component: ParallelGroupContentNode
  } as NodeContent,
  {
    type: ContentNodeTypes.serial,
    containerType: ContainerNode.serial,
    component: SerialGroupContentNode
  } as NodeContent,
  {
    type: ContentNodeTypes.stage,
    containerType: ContainerNode.serial,
    component: StageContentNode
  } as NodeContent
]

const startNode = {
  type: ContentNodeTypes.start,
  config: {
    width: 40,
    height: 40,
    hideDeleteButton: true,
    hideBeforeAdd: true,
    hideLeftPort: true
  },
  data: {}
} satisfies AnyContainerNodeType

const endNode = {
  type: ContentNodeTypes.end,
  config: {
    width: 40,
    height: 40,
    hideDeleteButton: true,
    hideAfterAdd: true,
    hideRightPort: true
  },
  data: {}
} satisfies AnyContainerNodeType

export const PipelineStudioGraphView = (): React.ReactElement => {
  const {
    state: { yamlRevision, editStepIntention }
  } = usePipelineDataContext()

  const [data, setData] = useState<AnyContainerNodeType[]>([])

  useEffect(() => {
    return () => {
      setData([])
    }
  }, [])

  useEffect(() => {
    const yamlJson = parse(yamlRevision.yaml)
    const newData = yaml2Nodes(yamlJson, { selectedPath: editStepIntention?.path })

    if (newData.length === 0) {
      newData.push({
        type: ContentNodeTypes.add,
        data: {
          yamlChildrenPath: 'pipeline.stages',
          name: '',
          yamlEntityType: YamlEntityType.SerialGroup,
          yamlPath: ''
        } satisfies AddNodeDataType
      })
    }

    newData.unshift(startNode)
    newData.push(endNode)
    setData(newData)
  }, [yamlRevision, editStepIntention])

  return (
    // TODO: fix style.width
    <div className="relative flex size-full" style={{ width: 'calc(100vw - 220px)' }}>
      <NodeContextProvider>
        <CanvasProvider>
          <PipelineGraph data={data} nodes={nodes} config={{ edgeClassName: 'stroke-borders-2' }} />
          <CanvasControls />
          <CommonNodeContextMenu />
        </CanvasProvider>
      </NodeContextProvider>
    </div>
  )
}
