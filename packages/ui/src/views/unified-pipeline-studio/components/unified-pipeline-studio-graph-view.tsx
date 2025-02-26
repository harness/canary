import { useEffect, useMemo, useState } from 'react'

import { parse } from 'yaml'

import { AnyContainerNodeType, CanvasProvider, PipelineGraph } from '@harnessio/pipeline-graph'

import { CanvasControls } from './graph-implementation/canvas/canvas-controls'
import { yaml2Nodes } from './graph-implementation/utils/yaml-to-pipeline-graph'

import '@harnessio/pipeline-graph/dist/index.css'

import { useUnifiedPipelineStudioContext } from '../context/unified-pipeline-studio-context'
import { parallelContainerConfig, serialContainerConfig } from './graph-implementation/config/config'
import { contentNodeBank } from './graph-implementation/factory/content-node-bank'
import { ContentNodeType } from './graph-implementation/types/content-node-type'

const startNode = {
  type: ContentNodeType.Start,
  config: {
    width: 40,
    height: 40,
    hideDeleteButton: true,
    hideBeforeAdd: true,
    hideLeftPort: true
  },
  data: {}
} satisfies AnyContainerNodeType

const endNode = {
  type: ContentNodeType.End,
  config: {
    width: 40,
    height: 40,
    hideDeleteButton: true,
    hideAfterAdd: true,
    hideRightPort: true
  },
  data: {}
} satisfies AnyContainerNodeType

export const PipelineStudioGraphView = (): React.ReactElement => {
  const { yamlRevision } = useUnifiedPipelineStudioContext()

  const [data, setData] = useState<AnyContainerNodeType[]>([])

  useEffect(() => {
    return () => {
      setData([])
    }
  }, [])

  useEffect(() => {
    const yamlJson = parse(yamlRevision.yaml)
    const newData = yaml2Nodes(yamlJson)

    newData.unshift(startNode)
    newData.push(endNode)
    setData(newData)
  }, [yamlRevision])

  const nodes = useMemo(() => {
    return contentNodeBank.getNodesDefinition()
  }, [])

  return (
    <div className="relative flex grow">
      <CanvasProvider>
        <PipelineGraph
          // customCreateSVGPath={customCreateSVGPath}
          // edgesConfig={edgesConfig}
          // portComponent={portComponent}
          // collapseButtonComponent={collapseButtonComponent}
          serialContainerConfig={serialContainerConfig}
          parallelContainerConfig={parallelContainerConfig}
          data={data}
          nodes={nodes}
        />
        <CanvasControls />
      </CanvasProvider>
    </div>
  )
}
