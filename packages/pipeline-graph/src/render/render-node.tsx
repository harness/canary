import LeafNodeContainer from '../components/nodes/leaf-container'
import ParallelNodeContainer from '../components/nodes/parallel-container'
import SerialNodeContainer from '../components/nodes/serial-container'
import { ContainerNodeProps } from '../types/container-node'

export function renderNode(props: ContainerNodeProps) {
  const { node, parentNode, ...rest } = props

  switch (node.containerType) {
    case 'serial': {
      return <SerialNodeContainer node={node} {...rest} parentNode={parentNode} />
    }
    case 'parallel': {
      return <ParallelNodeContainer node={node} {...rest} parentNode={parentNode} />
    }
    case 'leaf': {
      return <LeafNodeContainer node={node} {...rest} parentNode={parentNode} />
    }
  }
}
