import { useMemo } from 'react'

import { useContainerNodeContext } from '../../context/container-node-provider'
import { useGraphContext } from '../../context/graph-provider'
import { renderNode } from '../../render/render-node'
import { RenderNodeContent } from '../../render/render-node-content'
import { ContainerNodeProps } from '../../types/container-node'
import { AnyNodeInternal, SerialNodeInternalType } from '../../types/nodes-internal'
import { findAdjustment, getFlexAlign } from '../../utils/layout-utils'
import CollapseButton from '../components/collapse'
import Port from './port'

export default function SerialNodeContainer(props: ContainerNodeProps<SerialNodeInternalType>) {
  const { node, level, parentNode, isFirst, isLast, parentNodeType, mode } = props
  const { serialContainerConfig, parallelContainerConfig, portComponent, layout } = useContainerNodeContext()

  const myLevel = level + 1

  const { isCollapsed, collapse } = useGraphContext()
  const collapsed = useMemo(() => isCollapsed(node.path!), [isCollapsed, node.path])

  const verticalAdjustment = serialContainerConfig.serialGroupAdjustment ?? 0

  const ADJUSTMENT =
    findAdjustment(
      node,
      serialContainerConfig.serialGroupAdjustment ?? 0,
      parallelContainerConfig.parallelGroupAdjustment ?? 0,
      parentNode
    ) + verticalAdjustment

  return (
    <div
      className={'node serial-node'}
      key={node.type + '-' + node.path}
      style={{
        minWidth: node.config?.minWidth ? node.config?.minWidth + 'px' : 'auto',
        minHeight: node.config?.minHeight ? node.config?.minHeight + 'px' : 'auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        paddingLeft: serialContainerConfig.paddingLeft + 'px',
        paddingRight: serialContainerConfig.paddingRight + 'px',
        paddingTop: serialContainerConfig.paddingTop + 'px',
        paddingBottom: serialContainerConfig.paddingBottom + 'px',
        top: collapsed || myLevel > 1 ? 0 : -ADJUSTMENT + 'px',
        flexShrink: 0
      }}
    >
      {!node.config?.hideLeftPort &&
        (portComponent ? (
          portComponent({ side: 'left', id: `left-port-${node.path}`, adjustment: collapsed ? 0 : ADJUSTMENT, layout })
        ) : (
          <Port side="left" id={`left-port-${node.path}`} adjustment={collapsed ? 0 : ADJUSTMENT} layout={layout} />
        ))}

      {!node.config?.hideRightPort &&
        (portComponent ? (
          portComponent({
            side: 'right',
            id: `right-port-${node.path}`,
            adjustment: collapsed ? 0 : ADJUSTMENT,
            layout
          })
        ) : (
          <Port side="right" id={`right-port-${node.path}`} adjustment={collapsed ? 0 : ADJUSTMENT} layout={layout} />
        ))}

      <div
        className="serial-node-header"
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
              flexDirection: 'row',
              alignItems: getFlexAlign(layout.type),
              columnGap: serialContainerConfig.nodeGap + 'px'
            }}
          >
            {node.children.map((item: AnyNodeInternal, index: number) =>
              renderNode({
                node: item,
                parentNode: node,
                level: myLevel,
                parentNodeType: 'serial',
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
