import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { get } from 'lodash-es'

import { SERIAL_NODE_GAP } from './components/nodes/serial-container'
import { useCanvasContext } from './context/canvas-provider'
import { useGraphContext } from './context/graph-provider'
import { renderNode } from './render/render-node'
import { clear, getPortsConnectionPath } from './render/render-svg-lines'
import { AnyNodeType } from './types/nodes'
import { AnyNodeInternal } from './types/nodes-internal'
import { connectPorts } from './utils/connects-utils'
import { addPaths } from './utils/path-utils'

export interface PipelineGraphInternalProps {
  data: AnyNodeType[]
  onAdd: (node: AnyNodeInternal, position: 'before' | 'after') => void
  onDelete: (node: AnyNodeInternal) => void
  onSelect: (node: AnyNodeInternal) => void
  onContext?: (node: AnyNodeInternal, e: Event) => void
}

export function PipelineGraphInternal(props: PipelineGraphInternalProps) {
  const { initialized, nodes: nodesBank, rerenderConnections, shiftCollapsed, setInitialized } = useGraphContext()
  const { setCanvasTransform, canvasTransformRef, config: canvasConfig, setTargetEl } = useCanvasContext()

  const { data, onAdd, onDelete, onSelect, onContext } = props
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
        let allPaths: string[] = []
        connections.map(portPair => {
          const path = getPortsConnectionPath(rootContainerEl, portPair)
          allPaths.push(path)
        })
        svgGroupRef.current.innerHTML = allPaths.join('')
      }

      // reset transform
      rootContainerEl.style.transform = ''

      const { width: graphWidth, height: graphHeight } = nodesContainerEl.getBoundingClientRect()

      if (graphHeight > 0) {
        setInitialized()

        console.log(nodesContainerEl.getBoundingClientRect().toJSON())
        // console.log()

        // console.log(nodesContainerEl.innerHTML)
        // const graphWidth = parseInt(graphWidthPx)
        // const graphHeight = parseInt(graphHeightPx)
        if (!initialized) {
          console.log('initialized 0')
          // get nodes container size and apply it to child containers

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

          console.log(graphHeight + 'px')
          console.log(graphHeight)

          console.log(parentHeight)

          setCanvasTransform({
            scale: 1,
            translateX: canvasConfig.paddingForFit,
            translateY: parentHeight / 2 - graphHeight / 2
          })
        } else {
          console.log('initialized 1')

          if (graphSizeRef.current) {
            console.log('initialized 2')

            const { width: graphWidthPx, height: graphHeightPx } = getComputedStyle(nodesContainerRef.current)

            svgEl.setAttribute('width', graphWidthPx)
            svgEl.setAttribute('height', graphHeightPx)

            rootContainerEl.style.width = graphWidthPx
            rootContainerEl.style.height = graphHeightPx

            const graphWidth = parseInt(graphWidthPx)
            const graphHeight = parseInt(graphHeightPx)

            // kep "start node" in place - e.g when delete/add nodes
            if (graphHeight !== graphSizeRef.current.h) {
              console.log('initialized 3')

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

  const getContextInfoFromElement = (targetEl: HTMLDivElement) => {
    // get closest element that have 'data-path' attribute
    const el = targetEl.hasAttribute('data-path')
      ? targetEl
      : (targetEl.closest('*[data-path]') as HTMLDivElement | null)

    if (el) {
      const path = el.getAttribute('data-path') as string
      const action = el.getAttribute('data-action') as 'add' | 'delete' | 'select'
      const position = el.getAttribute('data-position') as 'before' | 'after'
      return { path, action, position }
    }
    return null
  }

  // handle "click" event
  useEffect(() => {
    const handler = (e: Event) => {
      const targetEl = e.target as HTMLDivElement

      const contextInfo = getContextInfoFromElement(targetEl)

      if (contextInfo) {
        const { path, action, position } = contextInfo
        const itemPath = path.replace(/^pipeline.children./, '')
        const node = get(data, itemPath) as AnyNodeInternal

        switch (action) {
          case 'add': {
            onAdd(node, position)
            break
          }
          case 'delete': {
            onDelete(node)
            break
          }
          case 'select': {
            onSelect(node)
            break
          }
        }
      }
    }

    const contextHandler = (e: Event) => {
      const targetEl = e.target as HTMLDivElement

      const contextInfo = getContextInfoFromElement(targetEl)

      if (contextInfo) {
        const { path, action, position } = contextInfo
        const itemPath = path.replace(/^pipeline.children./, '')
        const node = get(data, itemPath) as AnyNodeInternal

        if (action === 'select') {
          onContext?.(node, e)
        }
      }
    }

    nodesContainerRef.current?.addEventListener('click', handler)
    nodesContainerRef.current?.addEventListener('contextmenu', contextHandler)

    return () => {
      nodesContainerRef.current?.removeEventListener('click', handler)
      nodesContainerRef.current?.removeEventListener('contextmenu', contextHandler)
    }
  }, [dataInternal, setDataInternal, shiftCollapsed])

  useEffect(() => {
    // setMainRef(rootContainerRef)
    if (rootContainerRef.current) setTargetEl(rootContainerRef.current)
  }, [rootContainerRef])

  return (
    <div
      className={'PipelineGraph-RootContainer'}
      style={{
        position: 'relative',
        height: rootWH.h ? rootWH.h + 'px' : '1x', // IMPORTANT: do not remove this
        width: rootWH.w ? rootWH.w + 'px' : 'auto', // IMPORTANT: do not remove this
        transformOrigin: '0 0',
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
          columnGap: `${SERIAL_NODE_GAP}px`
        }}
      >
        {dataInternalRef.current?.map((node, index) =>
          renderNode({
            node,
            level: 0,
            parentNodeType: 'serial',
            relativeIndex: index,
            isFirst: index === 0,
            isLast: index === dataInternalRef.current?.length - 1
          })
        )}
      </div>
    </div>
  )
}

export default PipelineGraphInternal
