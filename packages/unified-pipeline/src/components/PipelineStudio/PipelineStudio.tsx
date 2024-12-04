import { memo, useCallback, useEffect, useState } from 'react'

import type { Edge, Node } from 'reactflow'

import type { Graph } from '../../components/Canvas/types'
import { getEdgesForAllNodes } from '../../components/Canvas/utils/EdgeUtils'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import { getElementsFromGraph } from '../../utils/PipelineYamlUtils'
import { Canvas } from '../Canvas/Canvas'
import { getNodeDimensions } from '../Canvas/utils/NodeUtils'

interface PipelineStudioProps {
  nodes: Graph['nodes']
  onAddNode: (addedNode: Node) => void
  onDeleteNode: (deletedNode: Node) => void
  onSelectNode: (deletedNode: Node) => void
  readonly?: boolean
}

const PipelineStudio = memo((props: PipelineStudioProps) => <PipelineStudioInternal {...props} />)

function PipelineStudioInternal(props: PipelineStudioProps): JSX.Element {
  const [height, setHeight] = useState<number>(0)
  const [width, setWidth] = useState<number>(0)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()

  useEffect(() => {
    const initialNodes = getElementsFromGraph({
      nodes: props.nodes,
      readonly: props.readonly
    })
    const initialEdges = getEdgesForAllNodes({
      nodes: initialNodes,
      includChildNodeEdges: false,
      readonly: props.readonly
    })
    const nodesWithDimensions = initialNodes.map((node: Node) => ({
      ...node,
      ...getNodeDimensions(node)
    }))
    setNodes(nodesWithDimensions)
    setEdges(initialEdges)
  }, [props.nodes, props.readonly])

  const handleAddNode = useCallback((addedNode: Node): void => {
    props.onAddNode(addedNode)
  }, [])

  const handleDeleteNode = useCallback((deletedNode: Node): void => {
    props.onDeleteNode(deletedNode)
  }, [])

  const handleSelectNode = useCallback((selectedNode: Node): void => {
    props.onSelectNode(selectedNode)
  }, [])

  const wrapperRef = useCallback(
    (node: any) => {
      if (node !== null) {
        setHeight(node.getBoundingClientRect().height)
        setWidth(node.getBoundingClientRect().width)
      }
    },
    [windowWidth, windowHeight]
  )

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <Canvas
        nodes={nodes}
        edges={edges}
        onAddNode={handleAddNode}
        onDeleteNode={handleDeleteNode}
        onSelectNode={handleSelectNode}
        height={height}
        width={width}
      />
    </div>
  )
}
PipelineStudioInternal.displayName = 'PipelineStudioMemo'
PipelineStudio.displayName = 'PipelineStudio'

export { PipelineStudio, type PipelineStudioProps }
