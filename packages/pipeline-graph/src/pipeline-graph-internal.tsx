import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { useCanvasContext } from './context/canvas-provider'
import { useContainerNodeContext } from './context/container-node-provider'
import { useGraphContext } from './context/graph-provider'
import { renderNode } from './render/render-node'
import { clear, CreateSVGPathType, getPortsConnectionPath } from './render/render-svg-lines'
import { AnyContainerNodeType } from './types/nodes'
import { AnyNodeInternal } from './types/nodes-internal'
import { connectPorts } from './utils/connects-utils'
import { addPaths } from './utils/path-utils'

export interface PipelineGraphInternalProps {
  data: AnyContainerNodeType[]
  customCreateSVGPath?: CreateSVGPathType
  config?: {
    edgeClassName?: string
    leftGap?: number
    mode?: 'Edit' | 'Execution'
  }
  edgesConfig?: {
    radius?: number
    parallelNodeOffset?: number
    serialNodeOffset?: number
  }
}

export function PipelineGraphInternal(props: PipelineGraphInternalProps) {
  const { initialized, nodes: nodesBank, rerenderConnections, setInitialized } = useGraphContext()
  const { setCanvasTransform, canvasTransformRef, config: canvasConfig, setTargetEl } = useCanvasContext()
  const { serialContainerConfig } = useContainerNodeContext()

  const { data, config = {}, customCreateSVGPath, edgesConfig } = props
  const graphSizeRef = useRef<{ h: number; w: number } | undefined>()

  const svgGroupRef = useRef<SVGAElement>(null)

  const rootContainerRef = useRef<HTMLDivElement | null>(null)
  const nodesContainerRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  // set width and height after initialization
  // NOTE: this is required to keep "Start" node at the same vertical position when collapsing or deleting other nodes
  const [rootWH, setRootWH] = useState<{ w?: number; h?: number }>({})

  const [dataInternal, setDataInternal] = useState<AnyNodeInternal[]>(addPaths(data, nodesBank, 'pipeline', true))
  const dataInternalRef = useRef(addPaths(data, nodesBank, 'pipeline', true))

  useEffect(() => {
    const newData = addPaths(data, nodesBank, 'pipeline', true)

    setDataInternal(newData)
    dataInternalRef.current = newData
  }, [data])

  useLayoutEffect(() => {
    if (
      dataInternal &&
      rootContainerRef.current &&
      nodesContainerRef.current &&
      svgRef.current &&
      svgGroupRef.current
    ) {
      const rootContainerEl = rootContainerRef.current
      const nodesContainerEl = nodesContainerRef.current
      const svgEl = svgRef.current

      clear(svgGroupRef.current)

      // create connections
      const connections = connectPorts(dataInternal, { left: 'start', right: 'end' }, false)

      // NOTE: required to get ports coordinates from DOM
      rootContainerEl.style.transform = 'scale(1)'

      // draw lines
      if (svgGroupRef.current) {
        let allPaths: { level1: string[]; level2: string[] } = { level1: [], level2: [] }
        connections.map(portPair => {
          const levelPaths = getPortsConnectionPath({
            pipelineGraphRoot: rootContainerEl,
            connection: portPair,
            customCreateSVGPath,
            edgesConfig
          })
          allPaths.level1.push(levelPaths.level1)
          allPaths.level2.push(levelPaths.level2)
        })
        svgGroupRef.current.innerHTML = allPaths.level1.join('') + allPaths.level2.join('')
      }

      // reset transform
      rootContainerEl.style.transform = ''

      // get nodes container size (to apply size to child containers)
      const { width: graphWidth, height: graphHeight } = nodesContainerEl.getBoundingClientRect()

      if (graphHeight > 0) {
        setInitialized()

        if (!initialized) {
          setRootWH({ w: graphWidth, h: graphHeight })

          svgEl.setAttribute('width', graphWidth.toString())
          svgEl.setAttribute('height', graphHeight.toString())

          rootContainerEl.style.width = graphWidth + 'px'
          rootContainerEl.style.height = graphHeight + 'px'

          graphSizeRef.current = {
            w: graphWidth,
            h: graphHeight
          }

          // set initial position
          const parentEl = rootContainerEl.parentElement
          const { height: parentHeight } = parentEl?.getBoundingClientRect() ?? new DOMRect()

          setCanvasTransform({
            scale: 1,
            translateX: config?.leftGap ?? canvasConfig.paddingForFit ?? 80,
            translateY: parentHeight / 2 - graphHeight / 2,
            rootContainer: rootContainerRef?.current,
            isInitial: true
          })
        } else {
          if (graphSizeRef.current) {
            const { width: graphWidthPx, height: graphHeightPx } = getComputedStyle(nodesContainerRef.current)

            svgEl.setAttribute('width', graphWidthPx)
            svgEl.setAttribute('height', graphHeightPx)

            rootContainerEl.style.width = graphWidthPx
            rootContainerEl.style.height = graphHeightPx

            const graphWidth = parseInt(graphWidthPx)
            const graphHeight = parseInt(graphHeightPx)

            // kep "start node" in place (horizontally) - e.g when delete/add nodes
            if (graphHeight !== graphSizeRef.current.h) {
              const diffH = (graphSizeRef.current.h - graphHeight) / 2

              setCanvasTransform({
                scale: canvasTransformRef.current.scale,
                translateX: canvasTransformRef.current.translateX,
                translateY: canvasTransformRef.current.translateY + diffH * canvasTransformRef.current.scale
              })

              graphSizeRef.current = { h: graphHeight, w: graphWidth }
            }
          }
        }
      }
    }
  }, [dataInternal, rerenderConnections, initialized, graphSizeRef])

  useEffect(() => {
    if (rootContainerRef.current) setTargetEl(rootContainerRef.current)
  }, [rootContainerRef])

  return (
    <div
      className={'PipelineGraph-RootContainer'}
      style={{
        position: 'relative',
        height: rootWH.h ? rootWH.h + 'px' : '1x', // IMPORTANT: do not remove this
        width: rootWH.w ? rootWH.w + 'px' : 'auto', // IMPORTANT: do not remove this
        transformOrigin: 'top left',
        willChange: 'transform'
      }}
      ref={rootContainerRef}
    >
      <div className="PipelineGraph-SvgContainer">
        <svg ref={svgRef} width="1" height="1" className="PipelineGraph-Svg">
          <g ref={svgGroupRef} className="PipelineGraph-SvgGroup"></g>
        </svg>
      </div>
      <div
        className="PipelineGraph-NodesContainer"
        ref={nodesContainerRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          columnGap: `${serialContainerConfig.nodeGap}px`
        }}
      >
        {dataInternalRef.current?.map((node, index) =>
          renderNode({
            node,
            level: 0,
            parentNodeType: 'serial',
            relativeIndex: index,
            isFirst: index === 0,
            isLast: index === dataInternalRef.current?.length - 1,
            mode: config?.mode
          })
        )}
      </div>
    </div>
  )
}

export default PipelineGraphInternal
