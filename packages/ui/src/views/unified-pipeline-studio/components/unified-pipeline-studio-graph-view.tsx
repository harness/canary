import { useEffect, useMemo, useState } from 'react'

import { parse } from 'yaml'

import { AnyContainerNodeType, CanvasProvider, PipelineGraph } from '@harnessio/pipeline-graph'

import { CanvasControls } from './graph-implementation/canvas/canvas-controls'
import { yaml2Nodes } from './graph-implementation/utils/yaml-to-pipeline-graph'

import '@harnessio/pipeline-graph/dist/index.css'

import { CollapseButton } from '@components/pipeline-nodes/components/collapse-button'
import Port from '@components/pipeline-nodes/components/custom-port'

import { useUnifiedPipelineStudioContext } from '../context/unified-pipeline-studio-context'
import { parallelContainerConfig, serialContainerConfig } from './graph-implementation/config/config'
import { contentNodeBank } from './graph-implementation/factory/content-node-bank'
import { AddNodeDataType } from './graph-implementation/nodes/add-content-node'
import { ContentNodeType } from './graph-implementation/types/content-node-type'
import { YamlEntityType } from './graph-implementation/types/yaml-entity-type'

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
  const { yamlRevision, yamlParserOptions } = useUnifiedPipelineStudioContext()

  const [data, setData] = useState<AnyContainerNodeType[]>([])

  useEffect(() => {
    return () => {
      setData([])
    }
  }, [])

  useEffect(() => {
    const yamlJson = parse(yamlRevision.yaml)
    const newData = yaml2Nodes(yamlJson, yamlParserOptions)

    if (newData.length === 0) {
      newData.push({
        type: ContentNodeType.Add,
        data: {
          yamlChildrenPath: 'pipeline.stages',
          name: '',
          yamlEntityType: YamlEntityType.SerialStageGroup,
          yamlPath: ''
        } satisfies AddNodeDataType
      })
    }

    newData.unshift(startNode)
    newData.push(endNode)
    setData(newData)
  }, [yamlRevision])

  const nodes = useMemo(() => {
    return contentNodeBank.getNodesDefinition()
  }, [])

  return (
    <div className="relative flex grow bg-graph-bg-gradient bg-graph-bg-size">
      <CanvasProvider>
        <PipelineGraph
          customCreateSVGPath={props => {
            const { id, path } = props
            const pathStyle = ` stroke="hsl(var(--canary-border-03))"`
            const staticPath = `<path d="${path}" id="${id}" fill="none" ${pathStyle} />`
            return { level1: staticPath, level2: '' }
          }}
          edgesConfig={{
            radius: 10,
            parallelNodeOffset: 10,
            serialNodeOffset: 10
          }}
          portComponent={Port}
          collapseButtonComponent={CollapseButton}
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
