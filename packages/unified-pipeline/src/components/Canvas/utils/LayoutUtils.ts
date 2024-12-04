import * as dagre from 'dagre'
import { Edge, Node, Position } from 'reactflow'

import {
  INTER_PARENT_NODE_NODE_HORIZONTAL_SEPARATION,
  INTER_PARENT_NODE_NODE_HORIZONTAL_SEPARATION_READ_ONLY,
  NODE_HORIZONTAL_MARGIN,
  NODE_VERTICAL_MARGIN
} from './LROrientation/Constants'
import { getChildNodes, getLayoutableNodes, getNonLayoutableNodes, partitionNodesByParallelism } from './NodeUtils'

// Layout direction (T = top, R = right, B = bottom, L = left, TB = top to bottom)
export enum Direction {
  TB = 'TB',
  LR = 'LR',
  RL = 'RL',
  BT = 'BT'
}

export type Options = {
  direction: Direction
}

interface LayoutArgs {
  nodes: Node[]
  edges: Edge[]
  direction?: Direction
  width?: number
  height?: number
  readonly?: boolean
}

interface DagreLayoutArgs extends LayoutArgs {
  nodeNodeSeparation: number
  margin?: number
}

interface LayoutedElements {
  nodes: Node[]
  edges: Edge[]
}

export const performLayout = ({ nodes, edges, width, height, readonly }: LayoutArgs): LayoutedElements => {
  if (nodes.length === 0) return { nodes, edges }
  const selfLayoutableNodes = getLayoutableNodes(nodes)
  const layoutedNodes: Node[] = []
  const layoutedEdges: Edge[] = []
  const nonLayoutableNodes = getNonLayoutableNodes(nodes)
  if (nonLayoutableNodes.length > 0) {
    selfLayoutableNodes.map((node: Node) => {
      /* Dagre Layout can work without a root, hence layouting of child nodes becomes possible. */
      const parentNodeId = node.id
      const childNodes = getChildNodes(parentNodeId, nonLayoutableNodes)
      const childNodeCount = childNodes.length
      if (childNodeCount > 0) {
        const { parallel: parallelNodes, sequential: sequentialChildNodes } = partitionNodesByParallelism(childNodes)
        const parallelNodeCount = parallelNodes.length
        /* As per spec, a group node having parallel nodes won't have any sequential nodes inside it and vice versa */
        if (parallelNodeCount > 0) {
          /* Layout parallel nodes */
          const parallelLayoutedElements = dagreLayout({
            nodes: parallelNodes,
            edges,
            direction: Direction.TB,
            width,
            height,
            margin: NODE_HORIZONTAL_MARGIN,
            nodeNodeSeparation: readonly
              ? INTER_PARENT_NODE_NODE_HORIZONTAL_SEPARATION_READ_ONLY
              : INTER_PARENT_NODE_NODE_HORIZONTAL_SEPARATION
          })
          layoutedNodes.push(...parallelLayoutedElements.nodes)
          layoutedEdges.push(...parallelLayoutedElements.edges)
        } else {
          /* Layout sequential nodes */
          const layoutedSequentialElements = dagreLayout({
            nodes: sequentialChildNodes,
            edges,
            width,
            height,
            margin: NODE_VERTICAL_MARGIN,
            nodeNodeSeparation: readonly
              ? INTER_PARENT_NODE_NODE_HORIZONTAL_SEPARATION_READ_ONLY
              : INTER_PARENT_NODE_NODE_HORIZONTAL_SEPARATION
          })
          layoutedNodes.push(...layoutedSequentialElements.nodes)
          layoutedEdges.push(...layoutedSequentialElements.edges)
        }
      } else {
        const layoutedSequentialElements = dagreLayout({
          nodes: childNodes,
          edges,
          width,
          height,
          margin: NODE_VERTICAL_MARGIN,
          nodeNodeSeparation: readonly
            ? INTER_PARENT_NODE_NODE_HORIZONTAL_SEPARATION_READ_ONLY
            : INTER_PARENT_NODE_NODE_HORIZONTAL_SEPARATION
        })
        layoutedNodes.push(...layoutedSequentialElements.nodes)
        layoutedEdges.push(...layoutedSequentialElements.edges)
      }
    })
  }
  return { nodes: layoutedNodes, edges: layoutedEdges }
}

const dagreLayout = ({
  nodes,
  edges,
  direction = Direction.LR,
  width = 1800,
  height = 900,
  margin = 0,
  nodeNodeSeparation = 50
}: DagreLayoutArgs): LayoutedElements => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  const isHorizontal = direction === Direction.LR
  dagreGraph.setGraph({
    rankdir: direction,
    ranksep: nodeNodeSeparation,
    marginx: isHorizontal ? margin : 0,
    marginy: isHorizontal ? 0 : margin,
    height,
    width
  })

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: node.width, height: node.height })
  })

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  /* Scale so that nodes render within parent width and height */
  const graph = dagreGraph.graph()
  const scaleX = graph.width ? Math.min(1, width / graph.width) : 1
  const scaleY = graph.height ? Math.min(1, height / graph.height) : 1
  const scale = Math.min(scaleX, scaleY)

  const layoutedNodes = nodes.map((node: Node, index: number) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    let x = nodeWithPosition.x * scale
    let y = nodeWithPosition.y * scale
    // Center nodes horizontally or vertically based on direction
    if (isHorizontal) {
      y = height / 2 // Center vertically
      x = x + margin // Apply margin horizontally
    } else {
      // Center nodes horizontally
      x = width / 2
      if (nodes.length === 2) {
        // Adjust the position for the first and last nodes
        if (index === 0) {
          y = y + margin // Ensure the first node is at the top margin
        } else if (index === 1) {
          y = y - margin // Ensure the last node is at the bottom margin
        }
      } else {
        // Calculate vertical spacing
        const nodeCount = nodes.length
        const totalSpacing = height - 2 * margin // Space available after margins
        const spacing = nodeCount > 1 ? totalSpacing / (nodeCount - 1) : totalSpacing

        // Apply spacing to ensure the first and last nodes are spaced from top and bottom
        y = margin + spacing * index // Position nodes evenly with margin space

        // Adjust the position for the first and last nodes
        if (index === 0) {
          y = y + margin // Ensure the first node is at the top margin
        } else if (index === nodeCount - 1) {
          y = y - margin // Ensure the last node is at the bottom margin
        }
      }
    }
    // Return updated node with position and edge positions
    return {
      ...node,
      position: { x, y },
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom
    }
  })

  // Return layouted nodes and original edges
  return {
    nodes: layoutedNodes,
    edges
  }
}
