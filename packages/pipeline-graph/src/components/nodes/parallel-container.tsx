import { useMemo } from 'react'

import { useContainerNodeContext } from '../../context/container-node-provider'
import { useGraphContext } from '../../context/graph-provider'
import { renderNode } from '../../render/render-node'
import { RenderNodeContent } from '../../render/render-node-content'
import { ContainerNodeProps } from '../../types/container-node'
import { AnyNodeInternal, ParallelNodeInternalType } from '../../types/nodes-internal'
import { findAdjustment } from '../../utils/layout-utils'
import CollapseButton from '../components/collapse'
import Port from './port'

export default function ParallelNodeContainer(props: ContainerNodeProps<ParallelNodeInternalType>) {
  const { node, level, parentNode, isFirst, isLast, parentNodeType, mode } = props
  const { parallelContainerConfig, serialContainerConfig } = useContainerNodeContext()

  const myLevel = level + 1

  const { isCollapsed, collapse } = useGraphContext()
  const collapsed = useMemo(() => isCollapsed(props.node.path!), [isCollapsed])

  const verticalAdjustment = parallelContainerConfig.parallelGroupAdjustment ?? 0

  const ADJUSTMENT =
    findAdjustment(
      node,
      serialContainerConfig.serialGroupAdjustment ?? 0,
      parallelContainerConfig.parallelGroupAdjustment ?? 0,
      parentNode
    ) + verticalAdjustment

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
        paddingLeft: parallelContainerConfig.paddingLeft + 'px',
        paddingRight: parallelContainerConfig.paddingRight + 'px',
        paddingTop: parallelContainerConfig.paddingTop + 'px',
        paddingBottom: parallelContainerConfig.paddingBottom + 'px',
        top: collapsed || myLevel > 1 ? 0 : -ADJUSTMENT + 'px',
        alignItems: 'center',
        flexShrink: 0 // IMPORTANT: do not remove this
      }}
    >
      {!node.config?.hideLeftPort && (
        <Port side="left" id={`left-port-${props.node.path}`} adjustment={collapsed ? 0 : ADJUSTMENT} />
      )}
      {!node.config?.hideRightPort && (
        <Port side="right" id={`right-port-${props.node.path}`} adjustment={collapsed ? 0 : ADJUSTMENT} />
      )}

      <div
        className="parallel-node-header"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '0px',
          height: '0px',
          padding: '0px',
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

      <RenderNodeContent
        node={node}
        collapsed={collapsed}
        isFirst={isFirst}
        isLast={isLast}
        parentNodeType={parentNodeType}
        mode={mode}
      >
        {!collapsed && node.children.length > 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              rowGap: parallelContainerConfig.nodeGap + 'px'
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
                isLast: index === node.children.length - 1,
                mode
              })
            )}
          </div>
        ) : undefined}
      </RenderNodeContent>
    </div>
  )
}
