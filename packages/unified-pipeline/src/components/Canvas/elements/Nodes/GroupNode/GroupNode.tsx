import { useCallback, useEffect, useState } from 'react'

import cx from 'classnames'
import { set } from 'lodash-es'
import { Handle, Node, Position, type NodeProps } from 'reactflow'

import { Icon } from '@harnessio/canary'

import { DEFAULT_NODE_LOCATION } from '../../../../../components/Canvas/utils/LROrientation/Constants'
import { useCanvasStore } from '../../../../../framework/CanvasStore/CanvasStoreContext'
import useFlowStore from '../../../../../framework/FlowStore/FlowStore'
import Expand from '../../../../../icons/Expand'
import { getIdFromName } from '../../../../../utils/StringUtils'
import {
  DefaultNodeProps,
  DeleteNodeProps,
  ExpandNodeProps,
  GroupNodesProps,
  GroupOrientation,
  NodeType,
  PositionType
} from '../../../types'
import { createEdgesForChildren, dedupeEdges, mergeEdges } from '../../../utils/EdgeUtils'
import { performLayout } from '../../../utils/LayoutUtils'
import {
  getChildNodes,
  getGroupNodeOrientation,
  getNodeById,
  getNodeDiagnostics,
  getStageGroupNodeDimensions,
  isContainerNode,
  isParentOfNode,
  updateNodePositionType
} from '../../../utils/NodeUtils'

export interface GroupNodeProps extends DefaultNodeProps, ExpandNodeProps, DeleteNodeProps, GroupNodesProps {}

export default function GroupNode(props: NodeProps<GroupNodeProps>) {
  const { nodes, edges, addEdges, updateNodes, addNodes } = useFlowStore()
  const { enableDiagnostics } = useCanvasStore()
  const { data, id: nodeId, xPos, yPos, zIndex } = props
  const { expanded = true, name, memberNodes = [], parallel, readonly, groupId, hasChanged } = data
  const [isExpanded, setIsExpanded] = useState<boolean>(expanded)
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [orientation, setOrientation] = useState<GroupOrientation>(GroupOrientation.LR)
  const [showPlusNode, setShowPlusNode] = useState<boolean>(false)
  const memberNodeCount = memberNodes.length

  useEffect(() => {
    setupNode()
  }, [hasChanged, memberNodeCount])

  const setupNode = useCallback((): void => {
    if (nodes.length === 0 || memberNodeCount === 0) return
    const groupNodeOrientation = getGroupNodeOrientation(memberNodes)
    setOrientation(groupNodeOrientation)
    const { width, height } = getStageGroupNodeDimensions({
      isExpanded,
      childNodes: memberNodes,
      orientation: groupNodeOrientation
    })
    /**
     * Compute edges
     */
    const parentNode = getNodeById(nodes, nodeId)
    if (!parentNode) return
    const childNodeEdges = createEdgesForChildren({
      parentNode,
      nodes
    })
    /**
     * Layout child nodes
     */
    const childNodes = getChildNodes(nodeId, nodes).map(child => updateNodePositionType(child, PositionType.RELATIVE))
    const layoutedElements = performLayout({
      nodes: [parallel ? updateNodePositionType(parentNode, PositionType.ABSOLUTE) : parentNode, ...childNodes],
      edges: childNodeEdges,
      width,
      height,
      readonly
    })
    addNodes(layoutedElements.nodes)
    addEdges(dedupeEdges(mergeEdges(edges, layoutedElements.edges)))
    setWidth(width)
    setHeight(height)
  }, [memberNodes, memberNodeCount, isExpanded, nodes, edges, nodeId, parallel])

  /* Required to control recursive collapse and expand */
  const shouldUpdateChildNode = (parentNodeId: string, childNode: Node) => {
    return (
      isParentOfNode(parentNodeId, childNode) && [NodeType.STAGE, NodeType.ATOMIC].includes(childNode.type as NodeType)
    )
  }

  const updateNodeDimensions = useCallback(
    (node: Node, isExpanded: boolean): void => {
      const { width, height } = getStageGroupNodeDimensions({
        isExpanded,
        childNodes: memberNodes,
        orientation
      })
      set(node, 'width', width)
      set(node, 'height', height)
      setWidth(width)
      setHeight(height)
    },
    [memberNodes, orientation]
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
      updateNodes({ updatedNodes, notifySiblings: true })
    },
    [nodes, edges, memberNodes, orientation]
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
      updateNodes({ updatedNodes, notifySiblings: true })
    },
    [nodes, edges, memberNodes, orientation]
  )

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
  }, [nodes, edges, nodeId, memberNodes, orientation])

  const _addChildNode = useCallback((): void => {
    const name = `New stage ${memberNodeCount}`
    const newNode: Node = {
      id: getIdFromName(name),
      data: {
        name,
        icon: <Icon name="clone" />,
        path: '',
        positionType: PositionType.RELATIVE,
        expandable: true,
        expanded: false,
        deletable: true,
        readonly,
        parallel: orientation === GroupOrientation.TB
      } as GroupNodeProps,
      position: DEFAULT_NODE_LOCATION,
      type: NodeType.STAGE,
      selectable: true,
      parentNode: groupId,
      extent: 'parent',
      zIndex
    }
    addNodes([newNode])
  }, [readonly, zIndex, nodes, parallel, groupId, orientation, memberNodeCount])

  return (
    <div onMouseEnter={() => setShowPlusNode(true)} onMouseLeave={() => setShowPlusNode(false)}>
      {/**
       * @TODO Add support for orientation
       */}
      <Handle position={Position.Left} type="target" id={`${nodeId}_target`} />
      <Handle position={Position.Left} type="source" id={`${nodeId}_internal_source`} />
      <div
        style={{
          width,
          height
        }}
        className={cx(
          'flex flex-col items-center justify-between text-xs font-medium leading-3 box-border text-left p-2.5 rounded-lg bg-studio-6 border border-studio-5 border-dashed',
          { 'justify-center': !isExpanded }
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
              {memberNodeCount > 0 && <span className="text-xs text-studio-2">&nbsp;({memberNodeCount})</span>}
            </div>
          </div>
        </div>
        <Icon
          name="plus"
          className={cx(
            'rounded-full w-6 h-6 opacity-0 border border-studio-4/[0.6] bg-studio-1 text-studio-7 translate-y-6 hover:cursor-pointer',
            {
              'transition-opacity duration-200 ease-in-out opacity-100':
                showPlusNode && !readonly && isExpanded && orientation === GroupOrientation.TB
            }
          )}
        />
      </div>
      {/**
       * @TODO Add support for orientation
       */}
      <Handle position={Position.Right} type="target" id={`${nodeId}_internal_target`} />
      <Handle position={Position.Right} type="source" id={`${nodeId}_source`} />
      {enableDiagnostics?.Node && (
        <span className="text-red text-sm">{getNodeDiagnostics({ xPos, yPos, zIndex })}</span>
      )}
    </div>
  )
}
