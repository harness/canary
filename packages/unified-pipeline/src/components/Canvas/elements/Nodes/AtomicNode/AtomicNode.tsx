import { useCallback, useState } from 'react'

import cx from 'classnames'
import { Handle, Node, Position, useReactFlow, type NodeProps } from 'reactflow'

import { Icon, Skeleton, Text } from '@harnessio/canary'

// import cardBg from '../../../../../assets/images/card-glow.svg'
import { DEFAULT_NODE_LOCATION } from '../../../../../components/Canvas/utils/LROrientation/Constants'
import { useCanvasStore } from '../../../../../framework/CanvasStore/CanvasStoreContext'
import { useInteractionContext } from '../../../../../framework/InteractionContext/InteractionContext'
import { Status } from '../../../../../utils/Constants'
import {
  NodeType,
  PositionType,
  type DefaultNodeProps,
  type DeleteNodeProps,
  type ExpandNodeProps
} from '../../../types'
import { STEP_NODE_HEIGHT, STEP_NODE_WIDTH } from '../../../utils/LROrientation/Constants'
import { fetchNodeConnections, getNodeDiagnostics } from '../../../utils/NodeUtils'

export interface AtomicNodeProps extends DefaultNodeProps, ExpandNodeProps, DeleteNodeProps {
  /**
   * @TODO add optional custom renderer props later
   */
}

export default function AtomicNode({ isConnectable, data, xPos, yPos, zIndex }: NodeProps<AtomicNodeProps>) {
  const { deleteElements, getEdges, addNodes } = useReactFlow()
  const { handleAddClick, selectedNodePath } = useInteractionContext()
  const { icon, name, readonly, groupId, path } = data
  const { enableDiagnostics } = useCanvasStore()
  const [width] = useState<number>(STEP_NODE_WIDTH)
  const [height] = useState<number>(STEP_NODE_HEIGHT)
  const [status] = useState(Status.DONE)
  const [showPlus, setShowPlus] = useState<boolean>(false)

  const _handleNodeDelete = useCallback(
    (nodeId: string) => {
      deleteElements({ nodes: [{ id: nodeId }] })
      const [edge1, edge2, ..._rest] = fetchNodeConnections(nodeId, getEdges())
      const edgeIdsToDelete = []
      if (edge1) {
        edgeIdsToDelete.push({ id: edge1.id })
      }
      if (edge2) {
        edgeIdsToDelete.push({ id: edge2.id })
      }
      deleteElements({ edges: edgeIdsToDelete })
    },
    [deleteElements]
  )

  const _addChildNode = useCallback((): void => {
    const newNode: Node = {
      id: 'new_node',
      data: {
        name: 'New node',
        icon: <Icon name="clone" />,
        path: '',
        expandable: true,
        positionType: PositionType.RELATIVE,
        deletable: true,
        readonly
      } as AtomicNodeProps,
      position: DEFAULT_NODE_LOCATION,
      type: NodeType.ATOMIC,
      selectable: true,
      parentNode: groupId,
      extent: 'parent',
      zIndex
    }
    addNodes([newNode])
  }, [readonly, zIndex, groupId])

  return (
    <div onMouseEnter={() => setShowPlus(true)} onMouseLeave={() => setShowPlus(false)}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      {status === Status.QUEUED ? (
        <div>
          <div className="gradient-border-glow rounded-md border p-px">
            <div
              style={{
                width,
                height
              }}
              className="content-layer rounded-md p-2.5"
            >
              <div className="flex flex-col gap-3">
                <Skeleton className="size-6" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-[5px] w-[115px]" />
                  <Skeleton className="h-[5px] w-[79px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cx(
            'border p-px rounded-md bg-studio-primary border-studio-4/[0.6] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3)]',
            { 'gradient-border-gray': status === Status.DONE },
            { 'border-studio-node-selected': selectedNodePath === path }
          )}
        >
          <div
            style={{
              width,
              minHeight: height
            }}
            className="content-layer space-y-2.5 rounded-md p-2.5"
          >
            {icon}
            <Text className="line-clamp-2 text-[11px] font-normal leading-4 text-white">{name}</Text>
            {enableDiagnostics?.Node && (
              <span className="text-red text-tiny">{getNodeDiagnostics({ xPos, yPos, zIndex })}</span>
            )}
          </div>
        </div>
      )}
      <Handle type="source" position={Position.Right} isConnectable={isConnectable}>
        {status !== Status.QUEUED && (
          <div
            role="button"
            tabIndex={0}
            className="flex size-8 -translate-x-4 -translate-y-4 items-center justify-center hover:cursor-pointer"
            onClick={e => {
              e.stopPropagation()
              handleAddClick(data)
            }}
          >
            <Icon
              name="plus"
              className={cx(
                'rounded-full w-8 h-8 opacity-0 border border-studio-4/[0.6] hover:border-studio-4 bg-studio-1 text-studio-7 transform translate-x-[2px] translate-y-[2px]',
                {
                  'transition-opacity duration-200 ease-in-out opacity-100': showPlus
                }
              )}
            />
          </div>
        )}
      </Handle>
    </div>
  )
}
