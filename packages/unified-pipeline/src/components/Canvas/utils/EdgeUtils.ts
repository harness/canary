import { isEmpty } from 'lodash-es'
import type { Edge, Node } from 'reactflow'

import type { PlusEdgeProps } from '../elements/Edges/PlusEdge/PlusEdge'
import { EdgeType, NodeType } from '../types'
import { GROUP_NODE_VERTICAL_ALIGNMENT_MARGIN } from './LROrientation/Constants'
import { getChildNodes, getLayoutableNodes, partitionNodesByParallelism } from './NodeUtils'

/* node to parent edge */
export const linkChildNodeToParent = ({
  childNode,
  parentNode,
  zIndex = 1,
  parallel = false
}: {
  childNode: Node
  parentNode: Node
  zIndex?: number
  parallel?: boolean
}): Edge => {
  const parentId = parentNode.id
  const childNodeId = childNode.id
  return {
    id: `edge-${childNodeId}->${parentId}`,
    sourceNode: childNode,
    source: childNodeId,
    target: parentId,
    sourceHandle: `${childNodeId}_source`,
    targetHandle: `${parentId}_internal_target`,
    data: {
      sourceNode: childNode,
      targetNode: parentNode,
      sourcePosition: parentNode.position,
      targetPosition: childNode.position,
      edgeClickData: { nodeType: NodeType.STAGE }
    },
    type: EdgeType.SMOOTHSTEP,
    pathOptions: {
      borderRadius: 8,
      offset: parallel ? -1 * GROUP_NODE_VERTICAL_ALIGNMENT_MARGIN : 0
    },
    /* https://github.com/xyflow/xyflow/discussions/3498#discussioncomment-7263647 */
    zIndex,
    className: 'edge'
  }
}

/* parent to node edge */
export const linkParentNodeToChild = ({
  childNode,
  parentNode,
  zIndex = 1,
  parallel = false
}: {
  childNode: Node
  parentNode: Node
  zIndex?: number
  parallel?: boolean
}): Edge => {
  const parentId = parentNode.id
  const childNodeId = childNode.id
  return {
    id: `edge-${parentId}->${childNodeId}`,
    sourceNode: parentNode,
    source: parentId,
    target: childNodeId,
    sourceHandle: `${parentId}_internal_source`,
    targetHandle: `${childNodeId}_target`,
    data: {
      sourceNode: parentNode,
      targetNode: childNode,
      sourcePosition: parentNode.position,
      targetPosition: childNode.position,
      edgeClickData: { nodeType: NodeType.STAGE }
    },
    type: EdgeType.SMOOTHSTEP,
    pathOptions: {
      borderRadius: 8,
      offset: parallel ? -1 * GROUP_NODE_VERTICAL_ALIGNMENT_MARGIN : 0
    },
    /* https://github.com/xyflow/xyflow/discussions/3498#discussioncomment-7263647 */
    zIndex,
    className: 'edge'
  }
}

export const createEdgesForChildren = ({
  parentNode,
  nodes,
  zIndexForEdges,
  readonly
}: {
  parentNode: Node
  nodes: Node[]
  zIndexForEdges?: number
  readonly?: boolean
}): Edge[] => {
  const parentNodeId = parentNode.id
  const childNodes = getChildNodes(parentNodeId, nodes)
  if (childNodes.length === 0) return []
  const childNodeEdges: Edge[] = []
  const { parallel: parallelNodes, sequential: sequentialNodes } = partitionNodesByParallelism(childNodes)
  if (sequentialNodes.length > 1) {
    childNodeEdges.push(
      ...createEdgesForSequentialNodes({
        nodes: sequentialNodes,
        zIndex: zIndexForEdges,
        readonly
      })
    )
    const firstChildNodeToConnect = sequentialNodes[0]
    const lastChildNodeToConnect = sequentialNodes[sequentialNodes.length - 1]
    /**
     * Connect nodes to the auto-layoutable parent
     * When a group contains *only* sequential nodes
     */
    if (firstChildNodeToConnect && lastChildNodeToConnect && parentNode) {
      const childParentEdges: Edge[] = [
        linkParentNodeToChild({
          childNode: firstChildNodeToConnect,
          parentNode: parentNode,
          zIndex: zIndexForEdges
        }),
        linkChildNodeToParent({
          childNode: lastChildNodeToConnect,
          parentNode: parentNode,
          zIndex: zIndexForEdges
        })
      ]
      if (childParentEdges.length > 0) {
        childNodeEdges.push(...childParentEdges)
      }
    }
  }
  if (parentNode && parallelNodes.length > 0) {
    childNodeEdges.push(
      ...createEdgesForParallelNodes({
        parentNode,
        parallelNodes,
        zIndex: zIndexForEdges
      })
    )
  }
  return childNodeEdges
}

export const getEdgesForAllNodes = ({
  nodes,
  includChildNodeEdges = true,
  readonly
}: {
  nodes: Node[]
  includChildNodeEdges?: boolean
  readonly?: boolean
}): Edge[] => {
  const edges: Edge[] = []
  if (nodes.length === 0) return []
  const selfLayoutableNodes = getLayoutableNodes(nodes)
  edges.push(...createEdgesForNodes({ nodes: selfLayoutableNodes, readonly }))
  if (includChildNodeEdges) {
    selfLayoutableNodes.forEach(parentNode => {
      edges.push(...createEdgesForChildren({ parentNode, nodes, readonly }))
    })
  }
  return edges
}

export const createEdgesForParallelNodes = ({
  parentNode,
  parallelNodes,
  zIndex = 1
}: {
  parentNode: Node
  parallelNodes: Node[]
  zIndex?: number
}): Edge[] => {
  if (parallelNodes.length === 0) return []
  const edges: Edge[] = []
  parallelNodes.forEach(node => {
    edges.push(
      ...[
        linkParentNodeToChild({
          parentNode,
          childNode: node,
          zIndex,
          parallel: true
        }),
        linkChildNodeToParent({
          parentNode,
          childNode: node,
          zIndex,
          parallel: true
        })
      ]
    )
  })
  return edges
}

export const createEdgesForSequentialNodes = ({
  nodes,
  zIndex
}: {
  nodes: Node[]
  zIndex?: number
  readonly?: boolean
}): Edge[] => {
  if (nodes.length === 0) return []
  const edges: Edge[] = []
  for (let nodeIdx = 0; nodeIdx < nodes.length - 1; nodeIdx++) {
    const sourceNode = nodes[nodeIdx]
    const targetNode = nodes[nodeIdx + 1]
    edges.push(
      createEdgeForNodes({
        sourceNode,
        targetNode,
        edgeType: EdgeType.SMOOTHSTEP,
        zIndex
      })
    )
  }
  return edges
}

const createEdgeForNodes = ({
  sourceNode,
  targetNode,
  zIndex = 1
}: {
  sourceNode: Node
  targetNode: Node
  edgeType: EdgeType
  zIndex?: number
  readonly?: boolean
}): Edge<PlusEdgeProps> => {
  const { id: sourceNodeId, position: sourceNodePosition } = sourceNode
  const { id: targetNodeId, position: targetNodePosition } = targetNode

  return {
    id: `edge-${sourceNodeId}->${targetNodeId}`,
    sourceNode,
    source: sourceNodeId,
    target: targetNodeId,
    sourceHandle: `${sourceNodeId}_source`,
    targetHandle: `${targetNodeId}_target`,
    data: {
      sourceNode,
      targetNode,
      sourcePosition: sourceNodePosition,
      targetPosition: targetNodePosition,
      edgeClickData: { nodeType: NodeType.STAGE },
      zIndex
    },
    type: EdgeType.SMOOTHSTEP,
    zIndex,
    className: 'edge'
  }
}

export const createEdgesForNodes = ({
  nodes,
  edgeType = EdgeType.SMOOTHSTEP,
  zIndex = 1,
  readonly
}: {
  nodes: Node[]
  edgeType?: EdgeType
  zIndex?: number
  readonly?: boolean
}): Edge[] => {
  if (!nodes || nodes.length <= 1) {
    return []
  }

  const edgesForNodes: Edge<PlusEdgeProps>[] = []
  for (let nodeIdx = 0; nodeIdx < nodes.length - 1; nodeIdx++) {
    const sourceNode = nodes[nodeIdx]
    const targetNode = nodes[nodeIdx + 1]
    const edge = createEdgeForNodes({
      sourceNode,
      targetNode,
      edgeType,
      zIndex,
      readonly
    })
    edgesForNodes.push(edge)
  }

  return edgesForNodes
}

export const dedupeEdges = (edges: Edge[]): Edge[] => {
  const edgeMap: Map<string, Edge> = new Map()

  edges.forEach(edge => {
    edgeMap.set(edge.id, edge)
  })

  return Array.from(edgeMap.values())
}

/* edge2 overwrites edge1 */
export const mergeEdges = (edges1: Edge[], edges2: Edge[]): Edge[] => {
  const edgeMap = new Map<string, Edge>()

  edges1.forEach(edge => edgeMap.set(edge.id, edge))
  edges2.forEach(edge => edgeMap.set(edge.id, edge))

  return Array.from(edgeMap.values())
}

/**
 * Updates the visibility of specified edges in the complete set of edges.
 * @param edgesToUpdate - Edges to be marked as hidden or visible
 * @param allEdges - Complete set of edges
 * @param hidden - Boolean to indicate if the edges should be marked hidden (true) or visible (false)
 * @returns Complete set of edges after updating the specified ones
 */
export const updateEdgeVisibility = ({
  edgesToUpdate,
  allEdges,
  hidden
}: {
  edgesToUpdate: Edge[]
  allEdges: Edge[]
  hidden: boolean
}): Edge[] => {
  if (isEmpty(edgesToUpdate) || isEmpty(allEdges)) {
    return allEdges
  }

  if (edgesToUpdate.length > allEdges.length) {
    return allEdges
  }

  const allEdgeIds = allEdges.map(edge => edge.id)
  const matchingEdges = edgesToUpdate.filter(edge => allEdgeIds.includes(edge.id))
  const updatedEdges = matchingEdges.map((edge: Edge) => ({ ...edge, hidden }))
  return updatedEdges
}

export const getConnectedEdges = (nodeId: string, edges: Edge[]): Edge[] => {
  return edges.filter(edge => edge.source === nodeId || edge.target === nodeId)
}
