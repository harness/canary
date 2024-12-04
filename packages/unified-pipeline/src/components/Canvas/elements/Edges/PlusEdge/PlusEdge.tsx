import cx from 'classnames'
import { capitalize } from 'lodash-es'
import { EdgeLabelRenderer, EdgeProps, getBezierPath, Node, SmoothStepEdge, useReactFlow, XYPosition } from 'reactflow'

import { Icon } from '@harnessio/canary'

import { useCanvasStore } from '../../../../../framework/CanvasStore/CanvasStoreContext'
import type { NodeType } from '../../../types'

export interface PlusEdgeProps {
  sourceNode: Node
  targetNode: Node
  sourcePosition: XYPosition
  targetPosition: XYPosition
  edgeClickData: {
    nodeType: NodeType
  }
  zIndex: number
}

export default function PlusEdge(props: EdgeProps<PlusEdgeProps>) {
  const { enableDiagnostics } = useCanvasStore()
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
    id: edgeId
  } = props
  const { getNodes, setNodes } = useReactFlow()
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  })

  const _addNewNode = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (data?.targetPosition) {
      const existingNodes = getNodes()
      const newNodeType = data?.edgeClickData.nodeType
      const relevantNodes = existingNodes.filter(node => node.type === newNodeType)
      const nodeCount = relevantNodes.length
      const newNodeId = `${newNodeType}_${nodeCount + 1}`
      const name = `${newNodeType} ${nodeCount + 1}`
      const nodeName = capitalize(name)
      const newNode = {
        id: newNodeId,
        position: data.targetPosition,
        data: {
          ...data.targetNode.data,
          name: nodeName
        },
        type: newNodeType
      }
      const leftNodeSplit = existingNodes.filter(node => node.position.y < data.targetPosition.y)
      const rightNodeSplit = existingNodes.filter(node => node.position.y >= data.targetPosition.y)
      const updatedNodes = [...leftNodeSplit, newNode, ...rightNodeSplit]
      setNodes(updatedNodes)
    }
  }

  return (
    <>
      <SmoothStepEdge
        id={edgeId}
        pathOptions={{ path: edgePath }}
        sourcePosition={sourcePosition}
        targetPosition={targetPosition}
        sourceX={sourceX}
        sourceY={sourceY}
        targetX={targetX}
        targetY={targetY}
        source={data?.sourceNode.id || ''}
        target={data?.targetNode.id || ''}
        markerEnd={markerEnd}
        style={style}
        label={
          <EdgeLabelRenderer>
            <div
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: 'all'
              }}
              /* https://github.com/xyflow/xyflow/discussions/3498#discussioncomment-7263647 */
              className={cx(
                'z-[1] w-5 h-5 border border-studio-4/[0.6] bg-studio-1 flex items-center justify-center rounded-full',
                {
                  'z-[2]': data?.zIndex === 2
                }
              )}
            >
              {enableDiagnostics?.Edge && <span className="text-red text-xs">{edgeId}</span>}
              <Icon name="plus" className="hover:cursor-pointer" />
            </div>
          </EdgeLabelRenderer>
        }
      />
    </>
  )
}
