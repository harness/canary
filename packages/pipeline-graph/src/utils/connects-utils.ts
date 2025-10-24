import { AnyNodeInternal } from '../types/nodes-internal'

export function connectPorts(
  nodes: AnyNodeInternal[],
  parent: { left: string; right: string; node?: AnyNodeInternal },
  isParallel: boolean = false
) {
  const connections: {
    source: string
    target: string
    targetNode?: AnyNodeInternal
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
          serial: { position: 'left' },
          targetNode: node
        })
      }
      // between
      if (prevNode) {
        connections.push({
          source: `right-port-${prevNode.path}`,
          target: nodeLeftPort,
          targetNode: node
        })
      }
      // last
      if (idx === nodes.length - 1) {
        connections.push({
          source: `right-port-${node.path}`,
          target: parent.right,
          serial: { position: 'right' },
          // TODO
          targetNode: node?.data.state === 'executed' ? node : undefined // TODO
        })
      }
    } else if (isParallel) {
      connections.push({
        source: parent.left,
        target: nodeLeftPort,
        parallel: { position: 'left' },
        targetNode: node
      })

      connections.push({
        source: nodeRightPort,
        target: parent.right,
        parallel: { position: 'right' },
        // TODO
        targetNode: node?.data.state === 'executed' ? node : undefined // TODO
      })
    }

    if (node.containerType === 'serial' || node.containerType === 'parallel') {
      const childrenConnections = connectPorts(
        node.children,
        { left: nodeLeftPort, right: nodeRightPort, node },
        node.containerType === 'parallel'
      )
      connections.push(...childrenConnections)
    }
    prevNode = node
  })

  return connections
}

export function collectFirstLeafs(node: AnyNodeInternal, collectedNodes: AnyNodeInternal[]): void {
  if (node.containerType == 'leaf') {
    collectedNodes.push(node)
  }
  if (node.containerType == 'parallel') {
    node.children.forEach(nodeItem => collectFirstLeafs(nodeItem, collectedNodes))
  }
  if (node.containerType == 'serial') {
    collectFirstLeafs(node.children[0], collectedNodes)
  }
}

export function collectLastLeafs(node: AnyNodeInternal, collectedNodes: AnyNodeInternal[]): void {
  if (node.containerType == 'leaf') {
    collectedNodes.push(node)
  } else if (node.containerType == 'parallel') {
    node.children.forEach(nodeItem => collectLastLeafs(nodeItem, collectedNodes))
  } else if (node.containerType == 'serial') {
    collectLastLeafs(node.children[node.children.length - 1], collectedNodes)
  }
}
export function connectPorts2(nodes: AnyNodeInternal[]) {
  const connections: {
    source: string
    target: string
    targetNode: AnyNodeInternal
    parallel?: { position: 'left' | 'right' }
    serial?: {
      position: 'left' | 'right'
    }
  }[] = []

  let prevNodes: AnyNodeInternal[] | null = null

  nodes.map(node => {
    if (node.containerType === 'serial' || node.containerType === 'parallel') {
      const firstLeafs: AnyNodeInternal[] = []
      const lastLeafs: AnyNodeInternal[] = []

      collectFirstLeafs(node, firstLeafs)
      collectLastLeafs(node, lastLeafs)

      firstLeafs.forEach(firstLeaf => {
        connections.push({
          source: `right-port-${prevNodes?.[0].path}`,
          target: `left-port-${firstLeaf.path}`,
          targetNode: firstLeaf,
          parallel: { position: 'left' }
        })
      })

      prevNodes = lastLeafs

      return
    }

    const nodeLeftPort = `left-port-${node.path}`

    if (prevNodes) {
      prevNodes.forEach(prevNode => {
        connections.push({
          source: `right-port-${prevNode.path}`,
          target: nodeLeftPort,
          targetNode: node,
          parallel: { position: 'right' }
        })
      })
    }

    prevNodes = [node]
  })

  return connections
}
