import { capitalize } from 'lodash-es'
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow'

import { Icon } from '@harnessio/canary'

import { getNodeDiagnostics } from '../../../../../components/Canvas/utils/NodeUtils'
import { useCanvasStore } from '../../../../../framework/CanvasStore/CanvasStoreContext'
import type { DefaultNodeProps } from '../../../types'
import { DEFAULT_NODE_LOCATION } from '../../../utils/LROrientation/Constants'

export interface PlusNodeProps extends DefaultNodeProps {}

export default function PlusNode({ data, xPos, yPos, zIndex }: NodeProps<PlusNodeProps>) {
  const { entityType, nodeType, targetPosition = Position.Left } = data
  const { getNodes, setNodes } = useReactFlow()
  const { enableDiagnostics } = useCanvasStore()

  const _addNewNode = (event: React.MouseEvent): void => {
    event.preventDefault()
    event.stopPropagation()

    const existingNodes = getNodes()
    const relevantNodes = existingNodes.filter(node => node.type === nodeType)
    const nodeCount = relevantNodes.length
    const newNodeId = `${entityType}_${nodeCount + 1}`
    const newNodeName = capitalize(`${entityType} ${nodeCount + 1}`)
    const newNode = {
      id: newNodeId,
      position: {
        ...DEFAULT_NODE_LOCATION,
        y: yPos
      },
      data: { ...data, name: newNodeName },
      type: nodeType
    }
    const updatedNodes = [...existingNodes, newNode]
    setNodes(updatedNodes)
  }

  return (
    <>
      <Handle position={targetPosition} type="target" />
      <div className="flex size-5 items-center justify-center rounded-full border border-studio-4/[0.6] bg-studio-1">
        <Icon name="plus" className="hover:cursor-pointer" />
      </div>
      {enableDiagnostics?.Node && (
        <span className="text-red text-sm">{getNodeDiagnostics({ xPos, yPos, zIndex })}</span>
      )}
    </>
  )
}
