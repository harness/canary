/*
 * Copyright 2023 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import ELK, { ElkExtendedEdge, ElkNode, LayoutOptions } from 'elkjs'
import { get, set } from 'lodash-es'
import { Position, type Edge, type Node } from 'reactflow'

import { isValidPositiveInteger } from '../../../utils/StringUtils'
import { dedupeEdges } from './EdgeUtils'
import {
  INTER_PARENT_PARENT_HORIZONTAL_SEPARATION,
  NODE_DEFAULT_HEIGHT,
  NODE_DEFAULT_WIDTH,
  PLUS_NODE_ID,
  ROOT_NODE_ID
} from './LROrientation/Constants'
import { excludeTerminalNodes, getLayoutableNodes } from './NodeUtils'

enum ElkDirection {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  TOP = 'TOP'
}

export interface EdgeData {
  parentNode?: string
}

export interface LayoutedGraph {
  nodes: Node[]
  edges: Edge<EdgeData>[]
  options?: LayoutOptions
  margin?: number
  useDynamicSpacing?: boolean
}

enum ElkOption {
  NODE_NODE_BW_LAYER = 'elk.layered.spacing.nodeNodeBetweenLayers',
  DIRECTION = 'elk.direction'
}

export const elkOptions = {
  'elk.algorithm': 'layered',
  /** For spacing between different layers ,
  think of all top level parent nodes
   */
  [ElkOption.NODE_NODE_BW_LAYER]: INTER_PARENT_PARENT_HORIZONTAL_SEPARATION.toString(),
  /** For spacing between nodes in the same layer ,
  think of child nodes within a parent
   "elk.spacing.nodeNode": "100",
   */
  [ElkOption.DIRECTION]: ElkDirection.RIGHT,
  'elk.layered.nodePlacement.strategy': 'INTERACTIVE'
  // "elk.hierarchyHandling": "INCLUDE_CHILDREN",
}

const calculateSpacingBetweenLayers = ({ nodes, isHorizontal }: { nodes: Node[]; isHorizontal: boolean }): number => {
  // Find the maximum width and height among all nodes
  if (isHorizontal) {
    let maxDifference = 0
    for (let i = 0; i < nodes.length - 1; i++) {
      const currentNode = nodes[i]
      const nextNode = nodes[i + 1]
      const nextNodeWidth = nextNode?.width ?? 0
      const currentNodeWidth = currentNode?.width ?? 0
      maxDifference = Math.max(Math.abs(nextNodeWidth - currentNodeWidth), maxDifference)
    }
    return maxDifference
  } else {
    return 0
  }
}

export async function performElkLayout({
  nodes,
  edges,
  options = elkOptions,
  useDynamicSpacing = true
}: LayoutedGraph): Promise<LayoutedGraph> {
  if (nodes.length === 0) return { nodes, edges }
  const isHorizontal =
    options?.[ElkOption.DIRECTION] === ElkDirection.RIGHT || options?.[ElkOption.DIRECTION] === ElkDirection.LEFT
  let spacing: number = 0
  if (useDynamicSpacing) {
    spacing = calculateSpacingBetweenLayers({
      nodes: excludeTerminalNodes(getLayoutableNodes(nodes)),
      isHorizontal
    })
    set(elkOptions, ElkOption.NODE_NODE_BW_LAYER, spacing)
  } else {
    try {
      spacing = parseInt(get(elkOptions, ElkOption.NODE_NODE_BW_LAYER))
    } catch (e) {
      // ignore error
    }
  }
  spacing = isValidPositiveInteger(spacing) ? spacing : INTER_PARENT_PARENT_HORIZONTAL_SEPARATION
  const graph: ElkNode = {
    id: ROOT_NODE_ID,
    layoutOptions: elkOptions,
    children: nodes.map(node => ({
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      width: node?.width ?? NODE_DEFAULT_WIDTH,
      height: node?.height ?? NODE_DEFAULT_HEIGHT
    })),
    edges: edges as unknown as ElkExtendedEdge[]
  }

  const elk = new ELK()
  const elkGraph = await elk.layout(graph)

  const layoutedNodes =
    elkGraph?.children?.flatMap(node => {
      return [
        {
          ...node,
          position: { x: node.x!, y: node.y! }
        }
      ]
    }) || []

  // Find the center line (median y or x position)
  const layoutedNodesExcludingChildNodes = getLayoutableNodes(layoutedNodes as unknown as Node[])
  const layoutedNodesExceptTerminalNodes = layoutedNodesExcludingChildNodes.filter(
    node => node.id !== ROOT_NODE_ID && node.id !== PLUS_NODE_ID
  )
  let centerLine: number
  if (isHorizontal) {
    const minY = layoutedNodesExceptTerminalNodes.reduce((min, node) => Math.min(min, node.position.y), Infinity)
    const maxY = layoutedNodesExceptTerminalNodes.reduce((max, node) => Math.max(max, node.position.y), -Infinity)
    centerLine = minY + (maxY - minY) / 2
  } else {
    const minX = layoutedNodesExceptTerminalNodes.reduce((min, node) => Math.min(min, node.position.x), Infinity)
    const maxX = layoutedNodesExceptTerminalNodes.reduce((max, node) => Math.max(max, node.position.x), -Infinity)
    centerLine = minX + (maxX - minX) / 2
  }

  // Find the leftmost and rightmost nodes
  const leftmostNode = layoutedNodesExceptTerminalNodes.reduce((leftmost, node) =>
    node.position.x < leftmost.position.x ? node : leftmost
  )
  const rightmostNode = layoutedNodesExceptTerminalNodes.reduce((rightmost, node) =>
    node.position.x > rightmost.position.x ? node : rightmost
  )

  // Adjust the "root" and "plus" nodes
  layoutedNodesExcludingChildNodes.forEach(node => {
    const nodeWidth = node.width ?? NODE_DEFAULT_WIDTH
    const halfNodeWidth = nodeWidth / 2

    if (node.id === ROOT_NODE_ID) {
      const leftWidth = leftmostNode.width ?? NODE_DEFAULT_WIDTH
      const halfLeftWidth = leftWidth / 2

      node.position.x = leftmostNode.position.x - halfLeftWidth - halfNodeWidth - spacing
      node.position.y = centerLine
    } else if (node.id === PLUS_NODE_ID) {
      const rightWidth = rightmostNode.width ?? NODE_DEFAULT_WIDTH
      const halfRightWidth = rightWidth / 2

      node.position.x = rightmostNode.position.x + halfRightWidth + halfNodeWidth + spacing
      node.position.y = centerLine
    }
  })

  return {
    nodes: layoutedNodes as Node[],
    edges: elkGraph.edges ? (dedupeEdges(elkGraph.edges as unknown as Edge[]) as Edge<EdgeData>[]) : []
  }
}
