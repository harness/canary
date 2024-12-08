import { useMemo, useRef } from 'react'

import { useGraphContext } from '../../context/GraphProvider'
import { renderNode } from '../../render/render-node'
import { RenderNodeContent } from '../../render/render-node-content'
import { ContainerNodeProps } from '../../types/container-node'
import { AnyNodeInternal, SerialNodeInternalType } from '../../types/nodes-internal'
import { findAdjustment, getThreeDepth } from '../../utils/layout-utils'
import AddButton from '../components-tmp/add'
import CollapseButton from '../components-tmp/collapse'
import DeleteButton from '../components-tmp/delete'
import AddContainer from './add-container'
import Port from './port'

export const SERIAL_GROUP_ADJUSTMENT = 20
export const PADDING_TOP = 40
export const PADDING_BOTTOM = 20
export const SERIAL_PADDING = 26
export const SERIAL_NODE_GAP = 36

export default function SerialNodeContainer(props: ContainerNodeProps<SerialNodeInternalType>) {
  const { node, level, parentNodeType, isFirst, isLast, parentNode } = props

  const myLevel = level + 1

  const { isCollapsed, collapse, setNodeToRemove, nodeToRemove } = useGraphContext()

  const collapsed = useMemo(() => isCollapsed(node.path!), [isCollapsed, node.path])

  const elRef = useRef<HTMLDivElement | null>(null)

  const ADJUSTMENT = findAdjustment(node, parentNode) + SERIAL_GROUP_ADJUSTMENT

  console.log('level:' + level + ', getThreeDepth(node): ' + getThreeDepth(node))
  return (
    <div
      ref={elRef}
      className={'node serial-node'}
      key={node.type + '-' + node.path}
      style={{
        minWidth: node.config?.minWidth ? node.config?.minWidth + 'px' : 'auto',
        minHeight: node.config?.minHeight ? node.config?.minHeight + 'px' : 'auto',
        transition: 'width 0.46s, height 0.46s, opacity 0.46s',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        padding: SERIAL_PADDING + 'px',
        paddingTop: (!collapsed ? PADDING_TOP + SERIAL_GROUP_ADJUSTMENT : PADDING_TOP / 2) + 'px',
        paddingBottom: (!collapsed ? PADDING_TOP - SERIAL_GROUP_ADJUSTMENT : PADDING_TOP / 2) + 'px',
        top: collapsed || myLevel > 1 ? 0 : -ADJUSTMENT + 'px',
        flexShrink: 0
      }}
    >
      {/* TODO: fix (...string })?.state...)! */}
      <div
        className={(node.data as any)?.state === 'loading' ? 'border loading' : 'border'} //TODO: IMPORTANT
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          border: '1px dashed #454545',
          borderRadius: '6px',
          background: 'rgba(152, 150, 172, 0.01)'
        }}
      />

      {!node.config?.hideBeforeAdd && isFirst && (
        <AddContainer
          position="before"
          orientation={parentNodeType === 'parallel' ? 'vertical' : 'horizontal'}
          path={props.node.path}
          isFirst={isFirst}
          isLast={isLast}
          adjustment={parentNodeType === 'serial' && !collapsed ? ADJUSTMENT : 0}
        />
      )}

      {!node.config?.hideAfterAdd && (
        <AddContainer
          position="after"
          orientation={parentNodeType === 'parallel' ? 'vertical' : 'horizontal'}
          path={props.node.path}
          isFirst={isFirst}
          isLast={isLast}
          adjustment={parentNodeType === 'serial' && !collapsed ? ADJUSTMENT : 0}
        />
      )}

      <Port side="left" id={`left-port-${node.path}`} adjustment={collapsed ? 0 : ADJUSTMENT} />
      <Port side="right" id={`right-port-${node.path}`} adjustment={collapsed ? 0 : ADJUSTMENT} />

      <div
        className="serial-node-header"
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          zIndex: 100,
          right: '0px',
          height: '30px',
          padding: '10px',
          pointerEvents: 'none'
        }}
      >
        <CollapseButton
          collapsed={collapsed}
          onToggle={() => {
            collapse(node.path!, !collapsed)
          }}
        />
        {!node.config?.hideDeleteButton && <DeleteButton path={props.node.path} />}
      </div>

      {node.children.length === 0 && <AddButton path={node.path} position="in" />}

      <RenderNodeContent node={node}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: SERIAL_NODE_GAP + 'px'
          }}
        >
          {!collapsed
            ? node.children.map((item: AnyNodeInternal, index: number) =>
                renderNode({
                  node: item,
                  parentNode: node,
                  level: myLevel,
                  parentNodeType: 'serial',
                  relativeIndex: index,
                  isFirst: index === 0,
                  isLast: index === node.children.length - 1
                })
              )
            : null}
        </div>
      </RenderNodeContent>
    </div>
  )
}
