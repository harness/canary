import { useMemo, useRef } from 'react'

import { useGraphContext } from '../../context/graph-provider'
import { renderNode } from '../../render/render-node'
import { RenderNodeContent } from '../../render/render-node-content'
import { ContainerNodeProps } from '../../types/container-node'
import { AnyNodeInternal, ParallelNodeInternalType } from '../../types/nodes-internal'
import { findAdjustment } from '../../utils/layout-utils'
import AddButton from '../components-tmp/add'
import CollapseButton from '../components-tmp/collapse'
import DeleteButton from '../components-tmp/delete'
import AddContainer from './add-container'
import Port from './port'

export const PARALLEL_GROUP_ADJUSTMENT = 20
export const PARALLEL_PADDING = 42
export const PADDING_TOP = 40
export const PADDING_BOTTOM = 25
export const PARALLEL_NODE_GAP = 36

export default function ParallelNodeContainer(props: ContainerNodeProps<ParallelNodeInternalType>) {
  const { node, level, isFirst, isLast, parentNodeType, parentNode } = props

  const myLevel = level + 1

  const { isCollapsed, collapse } = useGraphContext()

  const elRef = useRef<HTMLDivElement | null>(null)

  const collapsed = useMemo(() => isCollapsed(props.node.path!), [isCollapsed])

  const ADJUSTMENT = findAdjustment(node, parentNode) + PARALLEL_GROUP_ADJUSTMENT

  return (
    <div
      {...(node.config?.selectable
        ? {
            'data-action': 'select',
            'data-path': node.path
          }
        : {})}
      ref={elRef}
      className={'node parallel-node'}
      key={props.node.type + '-' + props.node.path}
      style={{
        minWidth: node.config?.minWidth ? node.config?.minWidth + 'px' : 'auto',
        minHeight: node.config?.minHeight ? node.config?.minHeight + 'px' : 'auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        rowGap: PARALLEL_NODE_GAP + 'px',
        padding: PARALLEL_PADDING + 'px',
        paddingTop: (!collapsed ? PADDING_TOP + PARALLEL_GROUP_ADJUSTMENT : PADDING_TOP / 2) + 'px',
        paddingBottom: (!collapsed ? PADDING_TOP - PARALLEL_GROUP_ADJUSTMENT : PADDING_TOP / 2) + 'px',
        top: collapsed || myLevel > 1 ? 0 : -ADJUSTMENT + 'px',
        alignItems: 'center',
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
      <Port side="left" id={`left-port-${props.node.path}`} adjustment={collapsed ? 0 : ADJUSTMENT} />
      <Port side="right" id={`right-port-${props.node.path}`} adjustment={collapsed ? 0 : ADJUSTMENT} />

      <div
        className="parallel-node-header"
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          right: '0px',
          height: '30px',
          padding: '10px',
          zIndex: '100'
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

      {/* TODO: move to the  content node */}
      {node.children.length === 0 && <AddButton path={node.path} position="in" />}

      <RenderNodeContent node={node}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            rowGap: PARALLEL_NODE_GAP + 'px'
          }}
        >
          {!collapsed
            ? node.children.map((item: AnyNodeInternal, index: number) =>
                renderNode({
                  node: item,
                  parentNode: node,
                  level: myLevel,
                  parentNodeType: 'parallel',
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
