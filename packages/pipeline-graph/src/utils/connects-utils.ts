import { AnyNodeInternal } from '../types/nodes-internal'

export function connectPorts(
  nodes: AnyNodeInternal[],
  parent: { left: string; right: string },
  isParallel: boolean = false
) {
  const connections: {
    source: string
    target: string
    parallel?: { position: 'left' | 'right' }
    serial?: {
      position: 'left' | 'right'
    }
  }[] = []

  let prevNode: AnyNodeInternal | null = null
  nodes.map((node, idx) => {
    const nodeLeftPort = `left-port-${node.path}`
    const nodeRightPort = `right-port-${node.path}`

    if (!isParallel) {
      // first
      if (idx === 0) {
        connections.push({
          source: parent.left,
          target: `left-port-${node.path}`,
          serial: { position: 'left' }
        })
      }
      // between
      if (prevNode) {
        connections.push({
          source: `right-port-${prevNode.path}`,
          target: nodeLeftPort
        })
      }
      // last
      if (idx === nodes.length - 1) {
        connections.push({
          source: `right-port-${node.path}`,
          target: parent.right,
          serial: { position: 'right' }
        })
      }
    } else if (isParallel) {
      connections.push({
        source: parent.left,
        target: nodeLeftPort,
        parallel: { position: 'left' }
      })

      connections.push({
        source: nodeRightPort,
        target: parent.right,
        parallel: { position: 'right' }
      })
    }

    if (node.containerType === 'serial' || node.containerType === 'parallel') {
      const childrenConnections = connectPorts(
        node.children,
        { left: nodeLeftPort, right: nodeRightPort },
        node.containerType === 'parallel'
      )
      connections.push(...childrenConnections)
    }
    prevNode = node
  })

  return connections
}
