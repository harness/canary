import { useCallback, useEffect, useMemo, useState } from 'react'

import { AnimatePresence, motion, Variants } from 'framer-motion'
import { useContainerNodeContext } from '../../context/container-node-provider'
import { useGraphContext } from '../../context/graph-provider'
import { renderNode } from '../../render/render-node'
import { RenderNodeContent } from '../../render/render-node-content'
import { ContainerNodeProps } from '../../types/container-node'
import { AnyNodeInternal, SerialNodeInternalType } from '../../types/nodes-internal'
import { findAdjustmentForHarnessLayout } from '../../utils/harness-layout-utils'
import { findAdjustment, getFlexAlign } from '../../utils/layout-utils'
import Port from './port'

const containerVariants: Variants = {
  hidden: {
    height: 0,
    width: 0,
    opacity: 1,
    scale: 1,
    x: 0,
  },
  visible: {
    height: 'auto',
    width: 'auto',
    opacity: 1,
    transition: {
      height: {
        duration: 0.3,
        ease: "easeOut"
      },
      width: {
        duration: 0.3,
        ease: "easeOut"
      },
      opacity: {
        duration: 0.2
      },
      staggerChildren: 0.05,
      delayChildren: 0.3
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    width: 0,
    transformOrigin: 'top left',
    scale: 0,
    transition: {
      when: "afterChildren",
      ease: "easeOut",
      height: {
        duration: 0.3
      },
      width: {
        duration: 0.3
      },
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
}

export default function SerialNodeContainer(props: ContainerNodeProps<SerialNodeInternalType>) {
  const { node, level, parentNode, isFirst, isLast, parentNodeType, mode } = props
  const { serialContainerConfig, parallelContainerConfig, portComponent, layout } = useContainerNodeContext()

  const myLevel = level + 1

  const { isCollapsed, collapse, setShowSvg, rerender, isMounted } = useGraphContext()
  const collapsed = useMemo(() => isCollapsed(props.node.path!), [isCollapsed, props.node.path])

  const [localCollapsed, setLocalCollapsed] = useState(collapsed)

  const setCollapsed = useMemo(
    () => (collapsed: boolean) => {
      collapse(props.node.path!, collapsed)
    },
    [collapse, props.node.path]
  )

  /**
   * This is to sync the global collapsed state with the local collapsed state
   * 
   * Global collapsed state may change programmatically, so we need to sync it with the local collapsed state
   */
  useEffect(() => {
    if (!collapsed && localCollapsed) {
      setLocalCollapsed(false)
    }
  }, [collapsed])

  const handleCollaspeLocalState = useCallback((collapsed: boolean) => {
    setShowSvg(false)

    if (!collapsed) {
      setCollapsed(false)
    }
    setLocalCollapsed(collapsed)
  }, [setCollapsed])


  const handleAnimationComplete = useCallback((animationType) => {
    rerender()

    setShowSvg(true)

    if (animationType === 'exit') {
      setCollapsed(true)
    }

    if (!isMounted.current) {
      isMounted.current = true
    }
  }, [setCollapsed, rerender, setShowSvg, isMounted])

  const verticalAdjustment = serialContainerConfig.serialGroupAdjustment ?? 0

  const ADJUSTMENT =
    findAdjustment(
      node,
      serialContainerConfig.serialGroupAdjustment ?? 0,
      parallelContainerConfig.parallelGroupAdjustment ?? 0,
      parentNode
    ) + verticalAdjustment

  let top = 0
  switch (layout.type) {
    case 'harness': {
      const getHeaderHeight = layout.getHeaderHeight ?? (() => 0)
      top = level === 0 ? findAdjustmentForHarnessLayout(node, getHeaderHeight, isCollapsed, layout) : 0
      break
    }
    default: {
      top = collapsed || myLevel > 1 ? 0 : ADJUSTMENT
    }
  }

  let portAdjustment = 0
  switch (layout.type) {
    case 'harness': {
      const getHeaderHeight = layout.getHeaderHeight ?? (() => 0)
      if (collapsed) {
        portAdjustment = layout.collapsedPortPositionPerType?.[node.type] ?? 0
      } else {
        portAdjustment =
          (layout.leafPortPosition ?? 0) + findAdjustmentForHarnessLayout(node, getHeaderHeight, isCollapsed, layout)
      }
      break
    }
    default: {
      portAdjustment = collapsed ? 0 : ADJUSTMENT
    }
  }

  const customBeforePortComponent = useMemo(() => {
    return typeof portComponent === 'function'
      ? portComponent({ nodeType: node.type, position: 'before', collapsed })
      : portComponent
  }, [collapsed, node.type, portComponent])

  const customAfterPortComponent = useMemo(() => {
    return typeof portComponent === 'function'
      ? portComponent({ nodeType: node.type, position: 'after', collapsed })
      : portComponent
  }, [collapsed, node.type, portComponent])

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
        flexShrink: 0,
        top: -top + 'px'
      }}
    >
      {!node.config?.hideLeftPort &&
        (customBeforePortComponent ? (
          customBeforePortComponent({ side: 'left', id: `left-port-${node.path}`, adjustment: portAdjustment, layout })
        ) : (
          <Port
            side="left"
            id={`left-port-${node.path}`}
            adjustment={portAdjustment}
            layout={layout}
            hidden={node.config?.isLeftPortHidden}
          />
        ))}

      {!node.config?.hideRightPort &&
        (customAfterPortComponent ? (
          customAfterPortComponent({
            side: 'right',
            id: `right-port-${node.path}`,
            adjustment: portAdjustment,
            layout
          })
        ) : (
          <Port
            side="right"
            id={`right-port-${node.path}`}
            adjustment={portAdjustment}
            layout={layout}
            hidden={node.config?.isLeftPortHidden}
          />
        ))}

      <RenderNodeContent
        node={node}
        collapsed={collapsed}
        setCollapsed={handleCollaspeLocalState}
        isFirst={isFirst}
        isLast={isLast}
        parentNodeType={parentNodeType}
        mode={mode}
        portPosition={portAdjustment}
      >
        <AnimatePresence>
          {!localCollapsed && node.children.length > 0 ? (
            <motion.div
              animate="visible"
              exit="exit"
              initial={!isMounted.current ? false : "hidden"}
              variants={containerVariants}
              onAnimationComplete={handleAnimationComplete}
              style={{
                transformOrigin: 'top left',
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

            </motion.div>
          ) : undefined}
        </AnimatePresence>
      </RenderNodeContent>
    </div >
  )
}
