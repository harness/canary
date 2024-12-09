import React, { useEffect, useRef, useState } from 'react'

import { cloneDeep, get } from 'lodash-es'
import { parse } from 'yaml'

import { PipelineGraph } from '../../src/pipeline-graph'
import { NodeContent } from '../../src/types/node-content'
import { AnyNodeType, ContainerNode, LeafNodeType } from '../../src/types/nodes'
import { getPathPeaces } from '../../src/utils/path-utils'
import { ApprovalNode } from './nodes/approval-node'
import { EndNode } from './nodes/end-node'
import { FormNode } from './nodes/form-node'
import { ParallelGroupNodeContent } from './nodes/parallel-group-node'
import { SerialGroupNodeContent } from './nodes/stage-node'
import { StartNode } from './nodes/start-node'
import { StepNode, StepNodeDataType } from './nodes/step-node'
import { getIcon } from './parser/utils'
import { yaml2Nodes } from './parser/yaml2AnyNodes'
import { pipeline } from './sample-data/pipeline'
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
    component: FormNode
  },
  {
    type: ContentNodeTypes.form,
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
  },
  {
    type: ContentNodeTypes.serial,
    containerType: ContainerNode.serial,
    component: SerialGroupNodeContent
  }
]

const yamlObject = parse(pipeline)
const plData = yaml2Nodes(yamlObject)

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

plData.unshift(startNode)
plData.push(endNode)

function ExampleForm() {
  const dataRef = useRef(plData)
  const [data, setData] = useState<AnyNodeType[]>()

  useEffect(() => {
    setData(plData)
  }, [])

  if (!data) return null

  return (
    <div
      style={{
        position: 'relative',
        left: '5vw',
        top: '10vh',
        height: '80vh',
        width: '90vw',
        overflow: 'hidden',
        border: '1px solid gray'
      }}
    >
      <PipelineGraph
        data={data}
        nodes={nodes}
        onSelect={() => undefined}
        onAdd={(path: string, position: 'before' | 'after') => {
          const newData = cloneDeep(data)

          const itemPath = path.replace(/^pipeline.children./, '')

          const { arrayPath, index } = getPathPeaces(itemPath)
          // shift collapsed nodes

          const arr = arrayPath ? (get(newData, arrayPath) as unknown[]) : newData

          arr.splice(position === 'before' ? index : index + 1, 0, getNode())

          setData(newData)
        }}
        onDelete={(path: string) => {
          const newData = cloneDeep(data)

          const { arrayPath, index } = getPathPeaces(path.replace(/^pipeline.children./, ''))
          // shift collapsed nodes

          const arr = arrayPath ? (get(newData, arrayPath) as unknown[]) : newData

          arr.splice(index, 1)

          setData(newData)
        }}
      />
    </div>
  )
}

export default ExampleForm

function getNode() {
  return {
    type: ContentNodeTypes.step,
    config: {
      width: 180
    },
    data: {
      yamlPath: 'qwe-' + Math.random(),
      name: 'step',
      icon: getIcon(1),
      state: 'loading'
    } satisfies StepNodeDataType
  } satisfies LeafNodeType
}
