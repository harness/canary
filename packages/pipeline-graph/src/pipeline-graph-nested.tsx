import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import cn from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'

import { containerVariants } from './components/nodes/animation-variants'
import ContainerNodeProvider, {
  ContainerNodeProviderProps,
  useContainerNodeContext
} from './context/container-node-provider'
import GraphProvider, { GraphProviderProps, useGraphContext } from './context/graph-provider'
import { drawEdges } from './render/draw-edges'
import { renderNode } from './render/render-node'
import { CreateSVGPathType } from './render/render-svg-lines'
import { ParallelContainerConfigType, SerialContainerConfigType } from './types/container-node'
import { LayoutConfig } from './types/layout'
import { NodeContent } from './types/node-content'
import { AnyContainerNodeType } from './types/nodes'
import { AnyNodeInternal } from './types/nodes-internal'
import { GetPortSvgFuncType } from './types/port-types'
import { getFlexAlign } from './utils/layout-utils'
import { addPaths } from './utils/path-utils'

import './pipeline-graph.css'

export interface PipelineGraphNestedProps extends Pick<ContainerNodeProviderProps, 'portComponent'> {
  /** Node tree WITHOUT Start/End nodes — the nested graph omits the entry/exit stub lines. */
  data: AnyContainerNodeType[]
  nodes: NodeContent[]
  serialContainerConfig?: Partial<SerialContainerConfigType>
  parallelContainerConfig?: Partial<ParallelContainerConfigType>
  layout?: LayoutConfig
  edgesConfig?: {
    radius?: number
    parallelNodeOffset?: number
    serialNodeOffset?: number
  }
  getPort?: GetPortSvgFuncType
  customCreateSVGPath?: CreateSVGPathType
  collapsed?: GraphProviderProps['collapsed']
  collapse?: GraphProviderProps['collapse']
  /**
   * Prefix for the internal node paths so they stay unique when several nested graphs (or multiple
   * nesting levels) coexist. Unrelated to yaml paths. Defaults to 'nested'.
   */
  pathPrefix?: string
  /**
   * Invoked after the nested graph (re)draws its edges / changes intrinsic size — lets the host
   * graph redraw its own edges, since the top-level graph has no ResizeObserver of its own.
   */
  onResize?: () => void
  /**
   * When true, the nested sub-graph's top-level node row animates open (grow + staggered child fade)
   * each time it mounts via the internal {@link AnimatePresence}, using the SAME
   * `containerVariants`/`itemVariants` as a regular stage's children row. Pair with {@link open} to get
   * the matching staggered collapse. Defaults to false (renders straight to its final state, no anim).
   */
  animateOnMount?: boolean
  /**
   * Presence toggle for the top-level node row. Driven by the embedding preview card's expand state:
   * flipping it false animates the row closed (children stagger out, then the box shrinks) exactly like
   * collapsing a regular group, and only then unmounts the row. The sub-graph host stays mounted so the
   * close can animate. Defaults to true (always shown). Only meaningful together with
   * {@link animateOnMount}.
   */
  open?: boolean
  /** Called once the row has finished animating closed (open -> false). E.g. to scroll the card back. */
  onExitComplete?: () => void
}

/**
 * An inline, read-only sub-graph that renders a node tree using the same recursive renderer as
 * PipelineGraph, but WITHOUT the absolute root wrapper, Canvas / pan-zoom, or Start/End boundary
 * nodes. It flows in normal layout and grows to fit its subtree, so an embedding card reads as one
 * continuous graph. Reentrant: a chained node inside it may embed another PipelineGraphNested.
 */
export function PipelineGraphNested(props: PipelineGraphNestedProps) {
  const {
    data,
    nodes,
    serialContainerConfig,
    parallelContainerConfig,
    portComponent,
    layout,
    edgesConfig,
    getPort,
    customCreateSVGPath,
    collapsed,
    collapse,
    pathPrefix,
    onResize,
    animateOnMount = false,
    open = true,
    onExitComplete
  } = props

  const [internalCollapsed, setInternalCollapsed] = useState<Record<string, boolean>>({})
  // Edge visibility for this nested sub-graph. Mirrors the root graph (pipeline-graph.tsx): the
  // serial/parallel containers inside call setShowSvg(false) on collapse / onAnimationStart and
  // setShowSvg(true) on onAnimationComplete, so honoring the value here hides the connectors while a
  // nested node collapses/expands instead of leaving them painted over the animating layout.
  const [showSvg, setShowSvg] = useState(true)

  const collapsedState = collapsed ?? internalCollapsed
  const collapseFn =
    collapse ?? ((path: string, state: boolean) => setInternalCollapsed(prev => ({ ...prev, [path]: state })))

  return (
    <GraphProvider nodes={nodes} collapsed={collapsedState} collapse={collapseFn} setShowSvg={setShowSvg}>
      <ContainerNodeProvider
        serialContainerConfig={serialContainerConfig}
        parallelContainerConfig={parallelContainerConfig}
        portComponent={portComponent}
        layout={layout}
      >
        <PipelineGraphNestedInternal
          data={data}
          edgesConfig={edgesConfig}
          getPort={getPort}
          customCreateSVGPath={customCreateSVGPath}
          layout={layout}
          pathPrefix={pathPrefix}
          onResize={onResize}
          showSvg={showSvg}
          animateOnMount={animateOnMount}
          open={open}
          onExitComplete={onExitComplete}
        />
      </ContainerNodeProvider>
    </GraphProvider>
  )
}

interface PipelineGraphNestedInternalProps {
  data: AnyContainerNodeType[]
  edgesConfig?: PipelineGraphNestedProps['edgesConfig']
  getPort?: GetPortSvgFuncType
  customCreateSVGPath?: CreateSVGPathType
  layout?: LayoutConfig
  pathPrefix?: string
  onResize?: () => void
  showSvg?: boolean
  animateOnMount?: boolean
  open?: boolean
  onExitComplete?: () => void
}

function PipelineGraphNestedInternal(props: PipelineGraphNestedInternalProps) {
  const {
    data,
    edgesConfig,
    getPort,
    customCreateSVGPath,
    layout = { type: 'center' },
    pathPrefix,
    onResize,
    showSvg = true,
    animateOnMount = false,
    open = true,
    onExitComplete
  } = props

  const { nodes: nodesBank, rerenderConnections, isCollapsed, setShowSvg, rerender } = useGraphContext()
  const { serialContainerConfig } = useContainerNodeContext()

  // Clip the row only while it animates open/closed. At rest it must be `visible` so ports and floating
  // add buttons at a node's edge aren't cut off — but during the grow/shrink the still-mounted children
  // keep their full intrinsic width (they only fade via itemVariants, they don't unmount), which pins the
  // ancestor's `width: max-content` to the full size and makes the width SNAP while the height animates.
  // Hiding overflow for the animation's duration lets the box's definite animated width win, so the card
  // tracks the width shrink/grow fluidly. Safe: the edges are hidden (showSvg=false) during the animation.
  const [isAnimating, setIsAnimating] = useState(false)

  const rootRef = useRef<HTMLDivElement | null>(null)
  const nodesContainerRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const svgGroupRef = useRef<SVGGElement | null>(null)

  const [dataInternal, setDataInternal] = useState<AnyNodeInternal[]>(() =>
    addPaths(data, nodesBank, pathPrefix ?? 'nested', true)
  )

  useEffect(() => {
    setDataInternal(addPaths(data, nodesBank, pathPrefix ?? 'nested', true))
  }, [data])

  // Draw edges + size the overlay. Normalizes for the ancestor canvas transform: the nested host
  // lives under that scaled subtree, so measured coords (and the SVG overlay itself) are scaled —
  // dividing by the measured scale keeps the drawn paths aligned to the ports.
  const redraw = () => {
    const rootEl = rootRef.current
    const svgGroupEl = svgGroupRef.current
    const svgEl = svgRef.current
    const nodesContainerEl = nodesContainerRef.current

    if (!rootEl || !svgGroupEl || !svgEl || !nodesContainerEl) return

    const scale = rootEl.offsetWidth > 0 ? rootEl.getBoundingClientRect().width / rootEl.offsetWidth : 1

    drawEdges({
      rootEl,
      svgGroupEl,
      data: dataInternal,
      edgesConfig,
      getPort,
      customCreateSVGPath,
      isCollapsed,
      scale,
      // Start/End boundary ports have no DOM element here, so the entry/exit stubs are skipped.
      boundary: { left: 'nested-start', right: 'nested-end' }
    })

    svgEl.setAttribute('width', nodesContainerEl.offsetWidth.toString())
    svgEl.setAttribute('height', nodesContainerEl.offsetHeight.toString())

    onResize?.()
  }

  useLayoutEffect(() => {
    redraw()
  }, [dataInternal, rerenderConnections])

  // The library has no ResizeObserver; the child subtree can settle after async load or a collapse
  // animation, so observe the host root and redraw when its box changes. Writing the SVG innerHTML /
  // overlay attributes does not change the root's layout box, so this does not self-trigger.
  useEffect(() => {
    const rootEl = rootRef.current
    if (!rootEl || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => redraw())
    observer.observe(rootEl)

    return () => observer.disconnect()
  }, [dataInternal])

  return (
    <div
      className="PipelineGraphNested-RootContainer"
      style={{ position: 'relative', width: 'max-content' }}
      ref={rootRef}
    >
      <div
        className="PipelineGraph-SvgContainer"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <svg
          ref={svgRef}
          width="1"
          height="1"
          className={cn('PipelineGraph-Svg')}
          // Opacity is driven inline (not via Tailwind opacity-0/opacity-100 utilities, which aren't
          // shipped in the library CSS): fade in on reveal, hide instantly so edges never linger over
          // a nested node as it collapses/expands.
          style={{
            overflow: 'visible',
            opacity: showSvg ? 1 : 0,
            transition: showSvg ? 'opacity 150ms' : undefined
          }}
        >
          <g ref={svgGroupRef} className="PipelineGraph-SvgGroup"></g>
        </svg>
      </div>
      {/* The AnimatePresence lives HERE, directly around the animating node row — NOT in the embedding
          preview card. In framer-motion v6 `exit` only fires on the component the nearest
          AnimatePresence directly wraps; it does not reliably propagate down to a deeply nested
          motion.div (which is why driving collapse from the host card's AnimatePresence made the row
          snap away without animating). Keeping the boundary local mirrors serial-container.tsx exactly.
          `open` is the presence toggle: flipping it false plays the staggered-children-out + shrink
          exit, then unmounts the row and fires onExitComplete. */}
      <AnimatePresence onExitComplete={onExitComplete}>
        {open && (
          <motion.div
            className="PipelineGraphNested-NodesContainer"
            ref={nodesContainerRef}
            // This is the SINGLE element that animates the preview open/closed, using the exact same
            // `containerVariants` (+ child `itemVariants` stagger) as a regular stage's children row in
            // serial-container.tsx — so a chained/template preview grows, staggers its top-level leaf
            // stages in, and staggers them out + shrinks on collapse identically to a normal group.
            // When animateOnMount is false the row renders straight to `visible` (no mount animation)
            // for any non-preview nested usage.
            variants={containerVariants}
            initial={animateOnMount ? 'hidden' : false}
            animate="visible"
            exit="exit"
            onAnimationStart={() => {
              // Hide the edges while the box grows/shrinks; they get redrawn + revealed on complete.
              setShowSvg(false)
              // Clip for the animation so the width tracks the shrink/grow (see isAnimating note above).
              setIsAnimating(true)
            }}
            onAnimationComplete={() => {
              setShowSvg(true)
              setIsAnimating(false)
              rerender()
            }}
            // Redraw this sub-graph's edges (and bubble onResize to the host) on every animation frame so
            // ports stay aligned as the box resizes; the ResizeObserver is the settle-time safety net.
            onUpdate={redraw}
            style={{
              transformOrigin: 'top left',
              display: 'flex',
              alignItems: getFlexAlign(layout.type),
              columnGap: `${serialContainerConfig.nodeGap}px`,
              overflow: isAnimating ? 'hidden' : 'visible'
            }}
          >
            {dataInternal?.map((node, index) =>
              renderNode({
                node,
                level: 0,
                parentNodeType: 'serial',
                relativeIndex: index,
                isFirst: index === 0,
                isLast: index === dataInternal.length - 1
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PipelineGraphNested
