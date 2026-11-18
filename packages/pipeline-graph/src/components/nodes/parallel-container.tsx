import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { useContainerNodeContext } from '../../context/container-node-provider'
import { useGraphContext } from '../../context/graph-provider'
import { renderNode } from '../../render/render-node'
import { RenderNodeContent } from '../../render/render-node-content'
import { ContainerNodeProps } from '../../types/container-node'
import { AnyNodeInternal, ParallelNodeInternalType } from '../../types/nodes-internal'
import { findAdjustmentForHarnessLayout } from '../../utils/harness-layout-utils'
import { findAdjustment } from '../../utils/layout-utils'
import { containerVariants, itemVariants } from './animation-variants'
import Port from './port'

export default function ParallelNodeContainer(props: ContainerNodeProps<ParallelNodeInternalType>) {
  const { node, level, parentNode, isFirst, isLast, parentNodeType, mode } = props
  const { parallelContainerConfig, serialContainerConfig, portComponent, layout } = useContainerNodeContext()

  const myLevel = level + 1

  const { isCollapsed, collapse, rerender, setShowSvg, isMounted, pendingRevealRef } = useGraphContext()
  const collapsed = useMemo(() => isCollapsed(props.node.path!), [isCollapsed, props.node.path])

  // This instance's contribution (0 or 1) to the graph-wide `pendingRevealRef` counter. Tracked
  // locally so we add/remove exactly once per expand and never clear a sibling's pending reveal — the
  // ref is shared across every container, so a bare `= false` here would wipe out another container's
  // still-loading expand.
  const hasPendingRef = useRef(false)
  // Fallback so the SVG can't stay hidden forever if a user-initiated expand never produces an
  // animation (e.g. children never load). Cleared once the animation starts or completes.
  const revealFallbackRef = useRef<ReturnType<typeof setTimeout>>()
  const markPendingReveal = useCallback(() => {
    if (hasPendingRef.current) return
    hasPendingRef.current = true
    pendingRevealRef.current += 1
  }, [pendingRevealRef])
  const clearPendingReveal = useCallback(() => {
    clearTimeout(revealFallbackRef.current)
    if (!hasPendingRef.current) return
    hasPendingRef.current = false
    pendingRevealRef.current = Math.max(0, pendingRevealRef.current - 1)
  }, [pendingRevealRef])
  // Drop this instance's pending contribution (and its fallback timer) if it unmounts mid-expand, so a
  // never-settling count can't keep the whole graph's edges hidden.
  useEffect(() => () => clearPendingReveal(), [clearPendingReveal])
  const setCollapsed = useMemo(
    () => (collapsed: boolean) => {
      collapse(props.node.path!, collapsed)
    },
    [collapse, props.node.path]
  )

  const [localCollapsed, setLocalCollapsed] = useState(collapsed)

  // Animate the expand/collapse only when a real collapse-state transition happens on THIS mounted
  // instance (user toggle or programmatic expand), never on mount. A node is React-keyed by its index
  // path, so inserting/removing a sibling before it remounts it with a new key; without this guard an
  // already-expanded node would replay its expand animation on that remount. Stays `false` across the
  // fresh mount (first paint and every re-key), so a mount renders straight to its target state.
  const shouldAnimateRef = useRef(false)

  /**
 * This is to sync the global collapsed state with the local collapsed state
 *
 * Global collapsed state may change programmatically, so we need to sync it with the local collapsed state.
 */
  useEffect(() => {
    // A prop-driven change the local flag hasn't caught up to is never a live transition on this
    // instance: nodes are keyed by their index path, so deleting/inserting a sibling reuses this
    // instance to render a *different* node, leaving its local state stale. Snap to the prop (the
    // source of truth) and clear any animate flag a prior user toggle left on this reused instance,
    // so the snap can't replay a stale open/close animation. Only user toggles (handleCollaspeLocalState) animate.
    if (collapsed === localCollapsed) return
    shouldAnimateRef.current = false
    // Hide the edges until the new layout settles. A programmatic expand (e.g. an execution stage
    // whose steps just finished lazy-loading) snaps open with no framer animation, so neither
    // onAnimationStart nor onAnimationComplete fires — without this the SVG stays visible and the
    // edges are drawn at preliminary port positions before the freshly-mounted children settle,
    // showing lines before the nodes. The ResizeObserver safety net in pipeline-graph-internal
    // redraws and re-reveals once the container has resized. Mirrors the user-toggle path.
    setShowSvg(false)
    setLocalCollapsed(collapsed)
  }, [collapsed])

  const handleCollaspeLocalState = useCallback((collapsed: boolean) => {
    // User toggle — a genuine transition on this live instance, so let it animate.
    shouldAnimateRef.current = true

    if (!collapsed) {
      setCollapsed(false)
      // Expanding: do NOT hide the edges now. The children may load asynchronously, leaving the node
      // collapsed-and-static for up to ~1s; hiding at click makes the connectors vanish and the user
      // stares at a graph with no lines through that gap. The current edges are valid for the still-
      // collapsed layout, so keep them until the expand animation actually starts (onAnimationStart
      // hides them right before the layout changes). Mark a reveal pending so the ResizeObserver
      // settle can't paint edges at preliminary positions during the gap; onAnimationStart/Complete
      // clears it, and the fallback guards a never-loading expand.
      markPendingReveal()
      clearTimeout(revealFallbackRef.current)
      revealFallbackRef.current = setTimeout(() => {
        clearPendingReveal()
        // Reveal only if no OTHER container is still waiting for its own expand to animate in.
        if (pendingRevealRef.current === 0) setShowSvg(true)
      }, 3000)
    } else {
      // Collapsing: hide immediately. The exit animation runs now (no async gap), so the edges would
      // otherwise linger over the shrinking node.
      setShowSvg(false)
    }
    setLocalCollapsed(collapsed)
  }, [setCollapsed, setShowSvg, markPendingReveal, clearPendingReveal, pendingRevealRef])


  const handleAnimationComplete = useCallback((animationType) => {
    clearPendingReveal()
    rerender()

    setShowSvg(true)

    if (animationType === 'exit') {
      setCollapsed(true)
    }

    if (!isMounted.current) {
      isMounted.current = true
    }
  }, [setCollapsed, rerender, setShowSvg, isMounted])

  const verticalAdjustment = parallelContainerConfig.parallelGroupAdjustment ?? 0

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
      top = collapsed || myLevel > 1 ? 0 : -ADJUSTMENT
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
    <motion.div
      // Participate in a parent container's staggered enter/exit exactly like a leaf node: when this
      // group is a child of another group's row (or of the nested preview's NodesContainer), it inherits
      // the parent's variant label and is sequenced by its `staggerChildren` / `when: afterChildren`, so
      // the group fades/slides out with its siblings before the box collapses — instead of snapping away
      // (a plain <div> is invisible to framer's stagger). At the top level of the main graph the parent
      // container is a plain div (no variant context), so this renders statically with no mount animation.
      variants={itemVariants}
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
        top: -top + 'px',
        alignItems: 'center',
        flexShrink: 0 // IMPORTANT: do not remove this
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
              initial={shouldAnimateRef.current ? 'hidden' : false}
              variants={containerVariants}
              onAnimationStart={() => {
                // Animation now drives the layout; hide the edges for its duration and clear the
                // pending guard so the ResizeObserver settle after the animation (or
                // onAnimationComplete) reveals the edges.
                setShowSvg(false)
                clearPendingReveal()
              }}
              onAnimationComplete={handleAnimationComplete}
              style={{
                transformOrigin: 'top left',
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
            </motion.div>
          ) : undefined}
        </AnimatePresence>
      </RenderNodeContent>
    </motion.div>
  )
}
