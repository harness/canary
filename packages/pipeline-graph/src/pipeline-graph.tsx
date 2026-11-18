import { Canvas } from './components/canvas/canvas'
import GraphProvider, { GraphProviderProps } from './context/graph-provider'
import PipelineGraphInternal, { PipelineGraphInternalProps } from './pipeline-graph-internal'
import { NodeContent } from './types/node-content'

import './pipeline-graph.css'

import ContainerNodeProvider, { ContainerNodeProviderProps } from './context/container-node-provider'
import { ParallelContainerConfigType, SerialContainerConfigType } from './types/container-node'
import { useState } from 'react'

export interface PipelineGraphProps
  extends PipelineGraphInternalProps,
  Pick<ContainerNodeProviderProps, 'portComponent'> {
  nodes: NodeContent[]
  serialContainerConfig?: Partial<SerialContainerConfigType>
  parallelContainerConfig?: Partial<ParallelContainerConfigType>
  collapsed?: GraphProviderProps['collapsed']
  collapse?: GraphProviderProps['collapse']
}

export function PipelineGraph(props: PipelineGraphProps) {
  const {
    data,
    nodes,
    config,
    serialContainerConfig,
    parallelContainerConfig,
    customCreateSVGPath,
    edgesConfig,
    portComponent,
    layout,
    getPort,
    collapsed = {},
    collapse = () => undefined
  } = props

  // Start hidden so edges never paint before the nodes have settled. On an API-driven first load the
  // layout effect draws edges as soon as data arrives, and a plain mount (no collapse transition,
  // `initial={false}`) fires neither the container's setShowSvg(false) nor framer's animation
  // callbacks — so a `true` default would leave lines visible at preliminary port positions before
  // the nodes mount/animate in. The ResizeObserver safety net in pipeline-graph-internal reveals the
  // SVG (and redraws) once the layout settles, so lines appear only after the nodes are in place.
  const [showSvg, setShowSvg] = useState(false)

  return (
    <GraphProvider nodes={nodes} collapsed={collapsed} collapse={collapse} setShowSvg={setShowSvg}>
      <ContainerNodeProvider
        serialContainerConfig={serialContainerConfig}
        parallelContainerConfig={parallelContainerConfig}
        portComponent={portComponent}
        layout={layout}
      >
        <Canvas>
          <PipelineGraphInternal
            data={data}
            config={config}
            customCreateSVGPath={customCreateSVGPath}
            edgesConfig={edgesConfig}
            layout={layout}
            getPort={getPort}
            showSvg={showSvg}
          />
        </Canvas>
      </ContainerNodeProvider>
    </GraphProvider>
  )
}
