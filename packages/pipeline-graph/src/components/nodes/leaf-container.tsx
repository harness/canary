import { useRef } from 'react'

import { RenderNodeContent } from '../../render/render-node-content'
import { ContainerNodeProps } from '../../types/container-node'
import { LeafNodeInternalType } from '../../types/nodes-internal'
import DeleteButton from '../components-tmp/delete'
import AddContainer from './add-container'
import Port from './port'

export default function LeafNodeContainer(props: ContainerNodeProps<LeafNodeInternalType>) {
  const { node, parentNodeType, isFirst, isLast } = props

  const nodeRef = useRef<HTMLDivElement | null>(null)

  const h = node.config?.height ? node.config?.height + 'px' : 'auto'
  const w = node.config?.width ? node.config?.width + 'px' : 'auto'
  const maxW = node.config?.maxWidth ? node.config?.maxWidth + 'px' : 'auto'
  const maxH = node.config?.maxHeight ? node.config?.maxHeight + 'px' : 'auto'
  const minW = node.config?.minWidth ? node.config?.minWidth + 'px' : 'auto'
  const minH = node.config?.minHeight ? node.config?.minHeight + 'px' : 'auto'

  function attachRef(ref: HTMLDivElement) {
    nodeRef.current = ref
  }

  return (
    <div
      data-action="select"
      data-path={node.path}
      ref={attachRef}
      key={props.node.type + '-' + props.node.path}
      className={'node leaf-node'}
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
      {!node.config?.hideBeforeAdd && isFirst && (
        <AddContainer
          position="before"
          orientation={parentNodeType === 'parallel' ? 'vertical' : 'horizontal'}
          path={props.node.path}
          isFirst={isFirst}
          isLast={isLast}
          adjustment={0}
        />
      )}
      {!node.config?.hideAfterAdd && (
        <AddContainer
          position="after"
          orientation={parentNodeType === 'parallel' ? 'vertical' : 'horizontal'}
          path={props.node.path}
          isFirst={isFirst}
          isLast={isLast}
          adjustment={0}
        />
      )}

      <div
        className="leaf-node-header"
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          zIndex: 100,
          right: '0px',
          height: '30px',
          padding: '10px'
        }}
      >
        {!node.config?.hideDeleteButton && <DeleteButton path={props.node.path} />}
      </div>

      {!node.config?.hideLeftPort && <Port side="left" id={`left-port-${props.node.path}`} />}
      {!node.config?.hideRightPort && <Port side="right" id={`right-port-${props.node.path}`} />}

      {/* TODO: currently we have to set "children". fix this!  */}
      <RenderNodeContent node={node} children={<></>} />
    </div>
  )
}
