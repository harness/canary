import { useEffect, useMemo, useState } from 'react'

import { PipelineNodesComponents } from '@/components'
import { parse } from 'yaml'

import { AnyContainerNodeType, CanvasProvider, PipelineGraph } from '@harnessio/pipeline-graph'

import { CanvasControls } from '../graph-implementation/canvas/canvas-controls'
import { processSteps } from '../graph-implementation/utils/yaml-to-pipeline-graph'

import '@harnessio/pipeline-graph/dist/index.css'

import { get } from 'lodash-es'

import { useUnifiedPipelineStudioContext } from '../../context/unified-pipeline-studio-context'
import { parallelContainerConfig, serialContainerConfig } from '../graph-implementation/config/config'
import { contentNodeBank } from '../graph-implementation/factory/content-node-bank'
import { endNode, startNode } from '../graph-implementation/utils/start-end-nodes'

export const PipelineStudioGraphViewSteps = ({ data: _data }: { data: AnyContainerNodeType[] }): React.ReactElement => {
  const { selectedPath, yamlRevision, yamlParserOptions } = useUnifiedPipelineStudioContext()

  const [stepsData, setStepsData] = useState<AnyContainerNodeType[]>([])

  useEffect(() => {
    if (selectedPath?.stages) {
      const yamlJson = parse(yamlRevision.yaml)
      const stage = get(yamlJson, selectedPath.stages)

      const newData = processSteps(stage.steps, selectedPath.stages + '.steps', yamlParserOptions ?? {})

      newData.unshift(startNode)
      newData.push(endNode)

      setStepsData(newData)
    } else {
      setStepsData([])
    }
  }, [selectedPath?.stages, yamlRevision])

  const nodes = useMemo(() => {
    return contentNodeBank.getNodesDefinition()
  }, [])

  return (
    <div className="relative flex h-full grow bg-cn-graph-bg-gradient cn-graph-bg-size">
      <CanvasProvider>
        <PipelineGraph
          customCreateSVGPath={props => {
            const { id, path } = props
            const pathStyle = ` stroke="var(--cn-border-1)"`
            const staticPath = `<path d="${path}" id="${id}" fill="none" ${pathStyle} />`
            return { level1: staticPath, level2: '' }
          }}
          edgesConfig={{
            radius: 10,
            parallelNodeOffset: 10,
            serialNodeOffset: 10
          }}
          portComponent={PipelineNodesComponents.Port}
          collapseButtonComponent={PipelineNodesComponents.CollapseButton}
          serialContainerConfig={serialContainerConfig}
          parallelContainerConfig={parallelContainerConfig}
          data={stepsData}
          nodes={nodes}
        />
        <CanvasControls />
      </CanvasProvider>
    </div>
  )
}
