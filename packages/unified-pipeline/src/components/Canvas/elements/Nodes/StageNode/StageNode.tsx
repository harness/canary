import { memo, useCallback, useEffect, useMemo, useState } from 'react'

import cx from 'classnames'
import { set } from 'lodash-es'
import { Handle, Node, NodeProps, Position } from 'reactflow'

import { Icon } from '@harnessio/canary'

import { createEdgesForChildren, dedupeEdges, mergeEdges } from '../../../../../components/Canvas/utils/EdgeUtils'
import { performLayout } from '../../../../../components/Canvas/utils/LayoutUtils'
import { useCanvasStore } from '../../../../../framework/CanvasStore/CanvasStoreContext'
import useFlowStore from '../../../../../framework/FlowStore/FlowStore'
import Expand from '../../../../../icons/Expand'
import { DefaultNodeProps, GroupOrientation, NodeType, PositionType } from '../../../types'
import {
  fetchNodeConnections,
  getChildNodes,
  getNodeById,
  getNodeDiagnostics,
  getNodePositionType,
  getStageNodeDimensions,
  isContainerNode,
  isParentOfNode,
  updateNodePositionType
} from '../../../utils/NodeUtils'
import { GroupNodeProps } from '../GroupNode/GroupNode'

const StageNode = memo((props: NodeProps<GroupNodeProps>) => <StageNodeInternal {...props} />)

StageNode.displayName = 'StageNode'

const StageNodeInternal: React.FC<NodeProps<GroupNodeProps>> = props => {
  const { nodes, edges, deleteElements, updateNodes, addEdges, addNodes } = useFlowStore()
  const { enableDiagnostics } = useCanvasStore()
  const { data, id: nodeId, xPos, yPos, zIndex } = props
  const { expanded = true, name, memberNodes = [], readonly } = data
  const [isExpanded, setIsExpanded] = useState<boolean>(expanded)
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [showZeroState, setShowZeroState] = useState<boolean>(false)
  const childNodes = useMemo((): Node[] => getChildNodes(nodeId, nodes), [nodes])
  const memberCount = memberNodes.length

  useEffect(() => {
    setShowZeroState(memberCount === 0)
    setupNode()
  }, [memberCount])

  const setupNode = useCallback((): void => {
    if (nodes.length === 0) return
    const { width, height } = getStageNodeDimensions({
      isExpanded: true,
      childNodes
    })
    /**
     * Compute edges
     */
    const parentNode = getNodeById(nodes, nodeId)
    if (!parentNode) return
    const isGroupView = getNodePositionType(parentNode) === PositionType.RELATIVE
    const childNodeEdges = createEdgesForChildren({
      parentNode,
      nodes,
      zIndexForEdges: isGroupView ? 2 : 1,
      readonly
    })
    const preparedParentNodeForLayout =
      /* Layout does not work without atleast one absolutely positioned node */
      isGroupView ? updateNodePositionType(parentNode, PositionType.ABSOLUTE) : parentNode
    /**
     * Layout child nodes
     */
    const layoutedElements = performLayout({
      nodes: [preparedParentNodeForLayout, ...childNodes],
      edges: childNodeEdges,
      width,
      height,
      readonly
    })
    addNodes(layoutedElements.nodes)
    addEdges(dedupeEdges(mergeEdges(edges, layoutedElements.edges)))
    setWidth(width)
    setHeight(height)
  }, [isExpanded, nodes, edges, nodeId, childNodes, readonly])

  const shouldUpdateChildNode = (parentNodeId: string, childNode: Node) => {
    return isParentOfNode(parentNodeId, childNode) && [NodeType.ATOMIC].includes(childNode.type as NodeType)
  }

  const orientation = useMemo(
    (): GroupOrientation =>
      memberNodes.every(node => (node.data as DefaultNodeProps)?.parallel) ? GroupOrientation.TB : GroupOrientation.LR,
    [memberNodes]
  )

  const updateNodeDimensions = useCallback(
    (node: Node, isExpanded: boolean): void => {
      const { width, height } = getStageNodeDimensions({
        isExpanded,
        childNodes: memberNodes
      })
      set(node, 'width', width)
      set(node, 'height', height)
      setWidth(width)
      setHeight(height)
    },
    [isExpanded, memberNodes]
  )

  /*
   * Show nodes
   */
  const handleNodeExpand = useCallback(
    (expandedNodeId: string): void => {
      const expandNode = (nodeId: string, updatedNodes: Node[]): Node[] => {
        const parentNode = nodes.find(node => node.id === nodeId)
        if (!parentNode) return updatedNodes
        set(parentNode, 'data.expanded', true)
        updateNodeDimensions(parentNode, true)
        updatedNodes.push(parentNode)
        const childNodes = getChildNodes(nodeId, nodes).map(node => {
          if (shouldUpdateChildNode(nodeId, node)) {
            set(node, 'hidden', false)
            // Recursively expand child nodes
            if (isContainerNode(node)) {
              updatedNodes = expandNode(node.id, updatedNodes)
            }
          }
          return node
        })
        return updatedNodes.concat(childNodes)
      }
      const updatedNodes = expandNode(expandedNodeId, [])
      updateNodes({ updatedNodes, notifyParent: true, notifySiblings: true })
    },
    [nodes, edges]
  )

  /*
   * Hide nodes
   */
  const handleNodeCollapse = useCallback(
    (collapsedNodeId: string): void => {
      const collapseNode = (nodeId: string, updatedNodes: Node[]): Node[] => {
        const parentNode = nodes.find(node => node.id === nodeId)
        if (!parentNode) return updatedNodes
        set(parentNode, 'data.expanded', false)
        updateNodeDimensions(parentNode, false)
        updatedNodes.push(parentNode)
        const childNodes = getChildNodes(nodeId, nodes).map(node => {
          if (shouldUpdateChildNode(nodeId, node)) {
            set(node, 'hidden', true)
            // Recursively collapse child nodes
            if (isContainerNode(node)) {
              updatedNodes = collapseNode(node.id, updatedNodes)
            }
          }
          return node
        })
        return updatedNodes.concat(childNodes)
      }
      const updatedNodes = collapseNode(collapsedNodeId, [])
      updateNodes({ updatedNodes, notifyParent: true, notifySiblings: true })
    },
    [nodes, edges]
  )

  //#endregion

  const handleNodeExpandCollapse = useCallback((): void => {
    setIsExpanded((expanded: boolean) => {
      const isExpanded = !expanded
      if (isExpanded) {
        handleNodeExpand(nodeId)
      } else {
        handleNodeCollapse(nodeId)
      }
      return isExpanded
    })
  }, [nodes, edges, nodeId])

  const _handleNodeDelete = useCallback(
    (nodeId: string) => {
      deleteElements([nodeId])
      const [edge1, edge2, ..._rest] = fetchNodeConnections(nodeId, edges)
      const edgeIdsToDelete = []
      if (edge1) {
        edgeIdsToDelete.push(edge1.id)
      }
      if (edge2) {
        edgeIdsToDelete.push(edge2.id)
      }
      deleteElements(edgeIdsToDelete)
    },
    [deleteElements]
  )

  return (
    <>
      {/**
       * @TODO Add support for orientation
       */}
      <Handle position={Position.Left} type="target" id={`${nodeId}_target`} />
      <Handle position={Position.Left} type="source" id={`${nodeId}_internal_source`} />
      <div
        style={
          showZeroState
            ? {}
            : {
                width,
                height
              }
        }
        className={cx(
          'flex flex-col items-center justify-between text-xs font-medium leading-3 box-border text-left p-2.5 rounded-lg bg-studio-6 border border-studio-5 border-dashed',
          { 'justify-center': !isExpanded },
          { 'w-[337px] h-[77px]': showZeroState }
        )}
      >
        <div className="box-border flex w-full items-center justify-between">
          <div className="flex items-center">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Expand
                onClick={(event: any) => {
                  event.preventDefault()
                  event.stopPropagation()
                  handleNodeExpandCollapse()
                }}
                className={'size-6 rounded-[4px] bg-studio-2/10 hover:cursor-pointer'}
              />
              &nbsp;
              <span className="text-nowrap text-xs text-studio-8">{name}</span>
              {memberCount > 0 && <span className="text-xs text-studio-2">&nbsp;({memberCount})</span>}
            </div>
          </div>
        </div>
        {memberCount === 0 && <div className="text-studio-2">+ Add your first step</div>}
        {expanded && orientation === GroupOrientation.TB && (
          <Icon name="plus" className={cx('w-6 h-6 rounded-[4px] bg-studio-2/10')} />
        )}
      </div>
      {/**
       * @TODO Add support for orientation
       */}
      <Handle position={Position.Right} type="target" id={`${nodeId}_internal_target`} />
      <Handle position={Position.Right} type="source" id={`${nodeId}_source`} />
      {enableDiagnostics?.Node && (
        <span className="text-red text-sm">{getNodeDiagnostics({ xPos, yPos, zIndex })}</span>
      )}
    </>
  )
}

export default StageNode
