import { useEffect, useMemo, useState } from 'react'

import { parse } from 'yaml'

import { AnyContainerNodeType, CanvasProvider, PipelineGraph } from '@harnessio/pipeline-graph'

import { ContentNodeFactory, YamlRevision } from '../pipeline-studio'
import { CanvasControls } from './graph-implementation/canvas/canvas-controls'
import { yaml2Nodes } from './graph-implementation/utils/yaml-to-pipeline-graph'

import '@harnessio/pipeline-graph/dist/index.css'

import { ParallelContainerConfig, SerialContainerConfig } from '@harnessio/pipeline-graph/src/types/container-node'

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

export interface PipelineStudioGraphViewProps {
  contentNodeFactory: ContentNodeFactory
  yamlRevision: YamlRevision
  onYamlRevisionChange: (YamlRevision: YamlRevision) => void
  getStepIcon?: (step: Record<string, any>) => JSX.Element
  serialContainerConfig?: Partial<SerialContainerConfig>
  parallelContainerConfig?: Partial<ParallelContainerConfig>
}

export const PipelineStudioGraphView = (props: PipelineStudioGraphViewProps): React.ReactElement => {
  const { yamlRevision, contentNodeFactory, getStepIcon, serialContainerConfig, parallelContainerConfig } = props

  const [data, setData] = useState<AnyContainerNodeType[]>([])

  useEffect(() => {
    return () => {
      setData([])
    }
  }, [])

  useEffect(() => {
    const yamlJson = parse(yamlRevision.yaml)
    const newData = yaml2Nodes(yamlJson, { getStepIcon })

    newData.unshift(startNode)
    newData.push(endNode)
    setData(newData)

    // NOTE: this will output json for execution mock
    console.log(newData)
  }, [yamlRevision])

  const nodes = useMemo(() => {
    return contentNodeFactory.getNodesDefinition()
  }, [contentNodeFactory])

  return (
    <div className="relative flex grow">
      <CanvasProvider>
        <PipelineGraph
          data={data}
          nodes={nodes}
          config={{ edgeClassName: 'stroke-borders-2' }}
          serialContainerConfig={serialContainerConfig}
          parallelContainerConfig={parallelContainerConfig}
        />
        <CanvasControls />
      </CanvasProvider>
    </div>
  )
}
