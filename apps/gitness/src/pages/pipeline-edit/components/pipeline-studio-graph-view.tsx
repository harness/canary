import { useCallback, useEffect, useState } from 'react'

import { parse } from 'yaml'

import {
  AnyNodeInternal,
  AnyNodeType,
  CanvasProvider,
  ContainerNode,
  LeafNodeType,
  NodeContent,
  PipelineGraph
} from '@harnessio/pipeline-graph'

import { usePipelineDataContext } from '../context/PipelineStudioDataProvider'
import { StepDrawer, usePipelineViewContext } from '../context/PipelineStudioViewProvider'
import { CanvasControls } from './graph-implementation/canvas/canvas-controls'
import { ContentNodeTypes } from './graph-implementation/content-node-types'
import { EndNode } from './graph-implementation/nodes/end-node'
import { StartNode } from './graph-implementation/nodes/start-node'
import { StepNode } from './graph-implementation/nodes/step-node'
import { yaml2Nodes } from './graph-implementation/utils/yaml-to-pipeline-graph'

import '@harnessio/pipeline-graph/dist/index.css'

import { ParallelGroupContentNode } from './graph-implementation/nodes/parallel-group-node'
import { SerialGroupContentNode } from './graph-implementation/nodes/serial-group-node'
import { CommonNodeDataType } from './graph-implementation/types/nodes'

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
    component: ParallelGroupContentNode
  },
  {
    type: ContentNodeTypes.serial,
    containerType: ContainerNode.serial,
    component: SerialGroupContentNode
  },
  {
    type: ContentNodeTypes.stage,
    containerType: ContainerNode.serial,
    component: SerialGroupContentNode
  }
]

const startNode = {
  type: ContentNodeTypes.start,
  config: {
    width: 40,
    height: 40,
    hideDeleteButton: true,
    hideBeforeAdd: true,
    hideLeftPort: true
  }
} satisfies LeafNodeType

const endNode = {
  type: ContentNodeTypes.end,
  config: {
    width: 40,
    height: 40,
    hideDeleteButton: true,
    hideAfterAdd: true,
    hideRightPort: true
  }
} satisfies LeafNodeType

export const PipelineStudioGraphView = (): React.ReactElement => {
  const {
    state: { yamlRevision, editStepIntention },
    setEditStepIntention,
    setAddStepIntention,
    requestYamlModifications: { deleteInArray }
  } = usePipelineDataContext()
  const { setStepDrawerOpen } = usePipelineViewContext()

  const [data, setData] = useState<AnyNodeType[]>([])

  useEffect(() => {
    return () => {
      setData([])
    }
  }, [])

  useEffect(() => {
    const yamlJson = parse(yamlRevision.yaml)
    const newData = yaml2Nodes(yamlJson, { selectedPath: editStepIntention?.path })
    newData.unshift(startNode)
    newData.push(endNode)
    setData(newData)
  }, [yamlRevision, editStepIntention])

  const addStep = useCallback(
    (node: AnyNodeInternal, position: 'after' | 'before') => {
      const commonData = node.data as CommonNodeDataType

      setStepDrawerOpen(StepDrawer.Collection)
      setAddStepIntention({ path: commonData.yamlPath, position })
    },
    [setStepDrawerOpen, setAddStepIntention]
  )

  const deleteStep = useCallback(
    (node: AnyNodeInternal) => {
      const commonData = node.data as CommonNodeDataType

      deleteInArray({ path: commonData.yamlPath })
    },
    [deleteInArray]
  )

  const editStep = useCallback(
    (node: AnyNodeInternal) => {
      const commonData = node.data as CommonNodeDataType

      setStepDrawerOpen(StepDrawer.Form)
      setEditStepIntention({ path: commonData.yamlPath })
    },
    [setEditStepIntention]
  )

  return (
    <div className="relative flex size-full">
      <CanvasProvider>
        <PipelineGraph data={data} nodes={nodes} onAdd={addStep} onDelete={deleteStep} onSelect={editStep} />
        <CanvasControls />
      </CanvasProvider>
    </div>
  )
}
