import { AnyNodeInternal } from '../types/nodes-internal'
import { GetPortSvgFuncType } from '../types/port-types'
import { connectPorts } from '../utils/connects-utils'
import { clear, CreateSVGPathType, getPortsConnectionPath } from './render-svg-lines'

export interface DrawEdgesProps {
  /** Graph root element that edge coordinates are measured relative to (and that ports are queried within). */
  rootEl: HTMLDivElement
  /** SVG <g> whose innerHTML receives the drawn paths. */
  svgGroupEl: SVGElement
  /** Path-annotated nodes (output of addPaths). */
  data: AnyNodeInternal[]
  edgesConfig?: {
    radius?: number
    parallelNodeOffset?: number
    serialNodeOffset?: number
  }
  getPort?: GetPortSvgFuncType
  customCreateSVGPath?: CreateSVGPathType
  isCollapsed: (path: string) => boolean
  /**
   * Effective ancestor scale. Left at 1 by the top-level graph (it forces scale(1) before measuring);
   * nested graphs pass their measured scale so coords are normalized to the unscaled overlay.
   */
  scale?: number
  /**
   * Synthetic boundary port ids for the leading/trailing connector stubs. The top-level graph uses
   * { left: 'start', right: 'end' } which resolve to the Start/End node ports. A nested graph that
   * omits Start/End nodes passes ids with no matching DOM element, so those stubs are skipped.
   */
  boundary?: { left: string; right: string }
}

/**
 * Measure ports from the DOM and write the inter-node SVG edges. Extracted from
 * PipelineGraphInternal so PipelineGraphNested can reuse the exact same measure/draw pass.
 */
export function drawEdges({
  rootEl,
  svgGroupEl,
  data,
  edgesConfig,
  getPort,
  customCreateSVGPath,
  isCollapsed,
  scale = 1,
  boundary = { left: 'start', right: 'end' }
}: DrawEdgesProps): void {
  clear(svgGroupEl)

  const connections = connectPorts(data, boundary, false)

  const allPaths: { level1: string[]; level2: string[] } = { level1: [], level2: [] }
  connections.map(portPair => {
    const levelPaths = getPortsConnectionPath({
      parentEl: rootEl,
      pipelineGraphRoot: rootEl,
      connection: portPair,
      customCreateSVGPath,
      edgesConfig,
      isCollapsed,
      getPortSvg: getPort,
      scale
    })
    allPaths.level1.push(levelPaths.level1)
    allPaths.level2.push(levelPaths.level2)
  })

  svgGroupEl.innerHTML = allPaths.level1.join('') + allPaths.level2.join('')
}
