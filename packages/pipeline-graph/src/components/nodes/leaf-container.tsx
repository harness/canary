import { useContainerNodeContext } from '../../context/container-node-provider'
import { RenderNodeContent } from '../../render/render-node-content'
import { ContainerNodeProps } from '../../types/container-node'
import { LeafNodeInternalType } from '../../types/nodes-internal'
import Port from './port'

export default function LeafNodeContainer(props: ContainerNodeProps<LeafNodeInternalType>) {
  const { node, isFirst, isLast, parentNodeType, mode } = props
  const { portComponent, layout } = useContainerNodeContext()

  const h = node.config?.height ? node.config?.height + 'px' : 'auto'
  const w = node.config?.width ? node.config?.width + 'px' : 'auto'
  const maxW = node.config?.maxWidth ? node.config?.maxWidth + 'px' : 'auto'
  const maxH = node.config?.maxHeight ? node.config?.maxHeight + 'px' : 'auto'
  const minW = node.config?.minWidth ? node.config?.minWidth + 'px' : 'auto'
  const minH = node.config?.minHeight ? node.config?.minHeight + 'px' : 'auto'

  return (
    <div
      key={props.node.type + '-' + props.node.path}
      className={'PipelineGraph-LeafContainerNode'}
      style={{
        position: 'relative',
        height: h,
        width: w,
        maxWidth: maxW,
        maxHeight: maxH,
        minWidth: minW,
        minHeight: minH,
        flexShrink: 0 // IMPORTANT: do not remove this
      }}
    >
      {!node.config?.hideLeftPort &&
        (portComponent ? (
          portComponent({ side: 'left', id: `left-port-${node.path}`, layout })
        ) : (
          <Port side="left" id={`left-port-${node.path}`} layout={layout} />
        ))}

      {!node.config?.hideRightPort &&
        (portComponent ? (
          portComponent({ side: 'right', id: `right-port-${node.path}`, layout })
        ) : (
          <Port side="right" id={`right-port-${node.path}`} layout={layout} />
        ))}

      <RenderNodeContent node={node} isFirst={isFirst} isLast={isLast} parentNodeType={parentNodeType} mode={mode} />
    </div>
  )
}
