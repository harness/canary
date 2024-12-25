import { useGraphContext } from '../context/graph-provider'
import { ContainerNode } from '../types/nodes'
import {
  AnyNodeInternal,
  LeafNodeInternalType,
  ParallelNodeInternalType,
  SerialNodeInternalType
} from '../types/nodes-internal'

export function RenderNodeContent(props: {
  node: AnyNodeInternal
  children?: React.ReactElement
  collapsed?: boolean
}) {
  const { node, children, collapsed } = props
  const { nodes } = useGraphContext()

  const nodeContent = nodes[node.type]

  switch (nodeContent.containerType) {
    case ContainerNode.leaf:
      return (
        <nodeContent.component node={node as LeafNodeInternalType<{}>} collapsed={collapsed}>
          {children}
        </nodeContent.component>
      )
    case ContainerNode.serial:
      return (
        <nodeContent.component node={node as SerialNodeInternalType<{}>} collapsed={collapsed}>
          {children}
        </nodeContent.component>
      )
    case ContainerNode.parallel:
      return (
        <nodeContent.component node={node as ParallelNodeInternalType<{}>} collapsed={collapsed}>
          {children}
        </nodeContent.component>
      )
  }
}
