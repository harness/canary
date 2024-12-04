import Elk, { type ElkNode } from 'elkjs'
import { type Edge, type Node } from 'reactflow'

import { LayoutAlgorithmOptions, type Direction } from './index'

function getDirection(direction: Direction) {
  switch (direction) {
    case 'TB':
      return 'DOWN'
    case 'LR':
      return 'RIGHT'
    case 'BT':
      return 'UP'
    case 'RL':
      return 'LEFT'
  }
}

export async function elkLayout({
  nodes,
  edges,
  options
}: {
  nodes: Node[]
  edges: Edge[]
  options: LayoutAlgorithmOptions
}): Promise<{ nodes: Node[]; edges: Edge[] }> {
  const graph = {
    id: 'elk-root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': getDirection(options.direction),
      'elk.spacing.nodeNode': `${options.spacing[0]}`
    },
    children: nodes.map(node => ({
      id: node.id,
      width: node.width ?? 0,
      height: node.height ?? 0
    })),
    edges: edges.map(edge => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target]
    }))
  }

  // We create a map of the laid out nodes here to avoid multiple traversals when
  // looking up a node's position later on.
  const elk = new Elk()
  const root = await elk.layout(graph)
  const layoutNodes = new Map<string, ElkNode>()
  for (const node of root.children ?? []) {
    layoutNodes.set(node.id, node)
  }

  const nextNodes = nodes.map(node => {
    const elkNode = layoutNodes.get(node.id)!
    const position = { x: elkNode.x!, y: elkNode.y! }

    return {
      ...node,
      position
    }
  })

  return { nodes: nextNodes, edges }
}
