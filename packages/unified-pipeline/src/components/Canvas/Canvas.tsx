import { useCallback, useEffect, useLayoutEffect, useState } from 'react'

import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  ControlButton,
  Controls,
  Edge,
  EdgeMouseHandler,
  Node,
  NodeMouseHandler,
  OnEdgesChange,
  OnNodesChange,
  ReactFlowProvider,
  useReactFlow
} from 'reactflow'

import { Icon } from '@harnessio/canary'

// import useAutoLayout from '../../hooks/useAutoLayout'
import CircleOverlay, { Position } from '../../components/CircleOverlay/CircleOverlay'
import { CanvasEntity, useCanvasStore } from '../../framework/CanvasStore/CanvasStoreContext'
import useFlowStore from '../../framework/FlowStore/FlowStore'
import { defaultEdgeMarkerOptions } from './nodes-edges-defaults'
import { NodeTypes } from './types'
import { elkOptions, performElkLayout } from './utils/ElkLayout'
import { partitionNodesForLayout } from './utils/NodeUtils'

import 'reactflow/dist/style.css'

interface CanvasLayoutProps {
  height: number
  width: number
}

interface CanvasProps extends CanvasLayoutProps {
  nodes: Node[]
  edges: Edge[]
  onAddNode: (addedNode: Node) => void
  onDeleteNode: (deletedNode: Node) => void
  onSelectNode: (selectedNode: Node) => void
}

const CanvasInternal = (props: CanvasProps) => {
  const { fitView } = useReactFlow()
  const { setEnableDiagnostics, enableDiagnostics } = useCanvasStore()
  const { nodes, edges, setNodes, setEdges, addEdge } = useFlowStore()
  const [mousePosition, setMousePosition] = useState<Position | null>(null)
  const [enableOverlay] = useState<boolean>(false)

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY })
  }

  useEffect(() => {
    return () => {
      setNodes([])
      setEdges([])
    }
  }, [])

  /**
   * @TODO fix this as it's currently causing an elkjs exception
   */
  // useAutoLayout()

  useLayoutEffect(() => {
    if (props.nodes.length === 0) return
    const { selfLayoutable: parentNodes, dependents: childNodes } = partitionNodesForLayout(props.nodes)
    performElkLayout({
      nodes: parentNodes,
      edges: props.edges,
      options: elkOptions,
      useDynamicSpacing: false
    }).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
      setNodes([...layoutedNodes, ...childNodes])
      setEdges(layoutedEdges)
      window.requestAnimationFrame(() => {
        fitView({
          nodes: [{ id: layoutedNodes[1].id }],
          maxZoom: 1
        })
      })
    })
  }, [props.nodes, props.edges])

  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node: Node) => {
      event.preventDefault()
      event.stopPropagation()
      props.onSelectNode(node)
      if (enableDiagnostics?.Node) {
        console.log(node)
      }
    },
    [enableDiagnostics?.Node]
  )

  const onEdgeClick: EdgeMouseHandler = useCallback(
    (event, edge: Edge) => {
      event.preventDefault()
      event.stopPropagation()
      if (enableDiagnostics?.Edge) {
        console.log(edge)
      }
    },
    [enableDiagnostics?.Edge]
  )

  const onNodesChange: OnNodesChange = useCallback(
    nodeChanges => {
      const updatedNodes = applyNodeChanges(nodeChanges, nodes)
      const updatedNodeIds = updatedNodes.map(node => node.id)
      const existingNodeIds = nodes.map(node => node.id)
      if (updatedNodes.length > nodes.length) {
        const addedNode = updatedNodes.find(node => !existingNodeIds.includes(node.id))
        if (addedNode) {
          props.onAddNode(addedNode)
        }
      } else if (updatedNodes.length < nodes.length) {
        const deletedNode = nodes.find(node => !updatedNodeIds.includes(node.id))
        if (deletedNode) {
          props.onDeleteNode(deletedNode)
        }
      }
    },
    [nodes]
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    edgeChanges => {
      const updatedEdges = applyEdgeChanges(edgeChanges, edges)
      setEdges(updatedEdges)
    },
    [edges]
  )

  const onConnect = useCallback(
    (params: any): void =>
      addEdge({
        ...params,
        markerEnd: defaultEdgeMarkerOptions
      }),
    [setEdges]
  )

  return (
    <div className="canvas-container size-full" onMouseMove={handleMouseMove}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NodeTypes}
        onEdgeClick={onEdgeClick}
        onNodeClick={onNodeClick}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={{ hideAttribution: true }}
        /* https://github.com/xyflow/xyflow/discussions/2827 */
        nodeOrigin={[0.5, 0.5]}
      >
        <Controls position="bottom-right" showFitView={false} showInteractive={false}>
          {process.env.NODE_ENV !== 'production' && (
            <>
              <ControlButton
                onClick={() =>
                  setEnableDiagnostics(diagnostics => {
                    return {
                      ...diagnostics,
                      [CanvasEntity.Node]: !diagnostics.Node
                    }
                  })
                }
              >
                <Icon name="circle" />
              </ControlButton>
              <ControlButton
                onClick={() =>
                  setEnableDiagnostics(diagnostics => {
                    return {
                      ...diagnostics,
                      [CanvasEntity.Edge]: !diagnostics.Edge
                    }
                  })
                }
              >
                <Icon name="x-mark" />
              </ControlButton>
            </>
          )}
        </Controls>
      </ReactFlow>
      {enableOverlay && mousePosition && <CircleOverlay position={mousePosition} />}
    </div>
  )
}

export function Canvas(props: CanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasInternal {...props} />
    </ReactFlowProvider>
  )
}
Canvas.displayName = 'PipelineCanvas'
CanvasInternal.displayName = 'PipelineCanvasWithReactFlow'
