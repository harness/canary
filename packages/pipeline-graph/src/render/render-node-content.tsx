import { useGraphContext } from '../context/graph-provider'
import { ContainerNodeType } from '../types/container-node'
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
  isFirst?: boolean
  isLast?: boolean
  parentNodeType?: ContainerNodeType
}) {
  const { node, children, collapsed, isFirst, isLast, parentNodeType } = props
  const { nodes } = useGraphContext()

  const nodeContent = nodes[node.type]

  switch (nodeContent.containerType) {
    case ContainerNode.leaf:
      return (
        <nodeContent.component
          node={node as LeafNodeInternalType<{}>}
          collapsed={collapsed}
          isFirst={isFirst}
          isLast={isLast}
          parentNodeType={parentNodeType}
        >
          {children}
        </nodeContent.component>
      )
    case ContainerNode.serial:
      return (
        <nodeContent.component
          node={node as SerialNodeInternalType<{}>}
          collapsed={collapsed}
          isFirst={isFirst}
          isLast={isLast}
          parentNodeType={parentNodeType}
        >
          {children}
        </nodeContent.component>
      )
    case ContainerNode.parallel:
      return (
        <nodeContent.component
          node={node as ParallelNodeInternalType<{}>}
          collapsed={collapsed}
          isFirst={isFirst}
          isLast={isLast}
          parentNodeType={parentNodeType}
        >
          {children}
        </nodeContent.component>
      )
  }
}
