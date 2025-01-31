import { useMemo, useRef } from 'react'

import { useGraphContext } from '../../context/graph-provider'
import { renderNode } from '../../render/render-node'
import { RenderNodeContent } from '../../render/render-node-content'
import { ContainerNodeProps } from '../../types/container-node'
import { AnyNodeInternal, SerialNodeInternalType } from '../../types/nodes-internal'
import { findAdjustment } from '../../utils/layout-utils'
import CollapseButton from '../components/collapse'
import Port from './port'

export const SERIAL_GROUP_ADJUSTMENT = 10
export const PADDING_TOP = 30
export const PADDING_BOTTOM = 20
export const SERIAL_PADDING = 26
export const SERIAL_NODE_GAP = 36

export default function SerialNodeContainer(props: ContainerNodeProps<SerialNodeInternalType>) {
  const { node, level, parentNode, isFirst, isLast, parentNodeType } = props

  const myLevel = level + 1

  const { isCollapsed, collapse } = useGraphContext()

  const collapsed = useMemo(() => isCollapsed(node.path!), [isCollapsed, node.path])

  const ADJUSTMENT = findAdjustment(node, parentNode) + SERIAL_GROUP_ADJUSTMENT

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
        padding: SERIAL_PADDING + 'px',
        paddingTop: (!collapsed ? PADDING_TOP + SERIAL_GROUP_ADJUSTMENT : PADDING_TOP / 2) + 'px',
        paddingBottom: (!collapsed ? PADDING_TOP - SERIAL_GROUP_ADJUSTMENT : PADDING_TOP / 2) + 'px',
        top: collapsed || myLevel > 1 ? 0 : -ADJUSTMENT + 'px',
        flexShrink: 0
      }}
    >
      {!node.config?.hideLeftPort && (
        <Port side="left" id={`left-port-${node.path}`} adjustment={collapsed ? 0 : ADJUSTMENT} />
      )}
      {!node.config?.hideRightPort && (
        <Port side="right" id={`right-port-${node.path}`} adjustment={collapsed ? 0 : ADJUSTMENT} />
      )}

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
      >
        {!collapsed && node.children.length > 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: SERIAL_NODE_GAP + 'px'
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
                isLast: index === node.children.length - 1
              })
            )}
          </div>
        ) : undefined}
      </RenderNodeContent>
    </div>
  )
}
