import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import cn from 'classnames'

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
    onResize
  } = props

  const [internalCollapsed, setInternalCollapsed] = useState<Record<string, boolean>>({})
  const [, setShowSvg] = useState(true)

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
}

function PipelineGraphNestedInternal(props: PipelineGraphNestedInternalProps) {
  const { data, edgesConfig, getPort, customCreateSVGPath, layout = { type: 'center' }, pathPrefix, onResize } = props

  const { nodes: nodesBank, rerenderConnections, isCollapsed } = useGraphContext()
  const { serialContainerConfig } = useContainerNodeContext()

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
        <svg ref={svgRef} width="1" height="1" className={cn('PipelineGraph-Svg')} style={{ overflow: 'visible' }}>
          <g ref={svgGroupRef} className="PipelineGraph-SvgGroup"></g>
        </svg>
      </div>
      <div
        className="PipelineGraphNested-NodesContainer"
        ref={nodesContainerRef}
        style={{
          display: 'flex',
          alignItems: getFlexAlign(layout.type),
          columnGap: `${serialContainerConfig.nodeGap}px`
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
      </div>
    </div>
  )
}

export default PipelineGraphNested
