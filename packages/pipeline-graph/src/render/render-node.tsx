import LeafNodeContainer from '../components/nodes/leaf-container'
import ParallelNodeContainer from '../components/nodes/parallel-container'
import SerialNodeContainer from '../components/nodes/serial-container'
import { ContainerNodeProps } from '../types/container-node'

export function renderNode(props: ContainerNodeProps) {
  const { node, parentNode, ...rest } = props

  switch (node.containerType) {
    case 'serial': {
      return <SerialNodeContainer key={node.type + '-' + node.path} node={node} {...rest} parentNode={parentNode} />
    }
    case 'parallel': {
      return <ParallelNodeContainer key={node.type + '-' + node.path} node={node} {...rest} parentNode={parentNode} />
    }
    case 'leaf': {
      return <LeafNodeContainer key={node.type + '-' + node.path} node={node} {...rest} parentNode={parentNode} />
    }
  }
}
