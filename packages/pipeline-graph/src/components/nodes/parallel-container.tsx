import { useMemo, useRef } from 'react'

import { useGraphContext } from '../../context/graph-provider'
import { renderNode } from '../../render/render-node'
import { RenderNodeContent } from '../../render/render-node-content'
import { ContainerNodeProps } from '../../types/container-node'
import { AnyNodeInternal, ParallelNodeInternalType } from '../../types/nodes-internal'
import { findAdjustment } from '../../utils/layout-utils'
import CollapseButton from '../components/collapse'
import Port from './port'

export const PARALLEL_GROUP_ADJUSTMENT = 10
export const PARALLEL_PADDING = 42
export const PADDING_TOP = 30
export const PADDING_BOTTOM = 25
export const PARALLEL_NODE_GAP = 36

export default function ParallelNodeContainer(props: ContainerNodeProps<ParallelNodeInternalType>) {
  const { node, level, parentNode } = props

  const myLevel = level + 1

  const { isCollapsed, collapse } = useGraphContext()

  const collapsed = useMemo(() => isCollapsed(props.node.path!), [isCollapsed])

  const ADJUSTMENT = findAdjustment(node, parentNode) + PARALLEL_GROUP_ADJUSTMENT

  return (
    <div
      className={'PipelineGraph-ParallelContainerNode'}
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
      <Port side="left" id={`left-port-${props.node.path}`} adjustment={collapsed ? 0 : ADJUSTMENT} />
      <Port side="right" id={`right-port-${props.node.path}`} adjustment={collapsed ? 0 : ADJUSTMENT} />

      <div
        className="parallel-node-header"
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          right: '0px',
          height: '0px',
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
      </div>

      <RenderNodeContent node={node} collapsed={collapsed}>
        {!collapsed && node.children.length > 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              rowGap: PARALLEL_NODE_GAP + 'px'
            }}
          >
            {node.children.map((item: AnyNodeInternal, index: number) =>
              renderNode({
                node: item,
                parentNode: node,
                level: myLevel,
                parentNodeType: 'parallel',
                relativeIndex: index,
                isFirst: index === 0,
                isLast: index === node.children.length - 1
              })
            )}
          </div>
        ) : undefined}
      </RenderNodeContent>
    </div>
  )
}
