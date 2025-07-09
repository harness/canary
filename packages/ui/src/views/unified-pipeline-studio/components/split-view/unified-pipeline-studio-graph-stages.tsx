import { useEffect, useMemo, useState } from 'react'

import { Layout, PipelineNodesComponents, Text } from '@/components'

import { AnyContainerNodeType, CanvasProvider, PipelineGraph } from '@harnessio/pipeline-graph'

import { CanvasControls } from '../graph-implementation/canvas/canvas-controls'

import '@harnessio/pipeline-graph/dist/index.css'

import { useUnifiedPipelineStudioContext } from '@views/unified-pipeline-studio/context/unified-pipeline-studio-context'
import { get } from 'lodash-es'
import { parse } from 'yaml'

import { parallelContainerConfig, serialContainerConfig } from '../graph-implementation/config/config'
import { splitView_contentNodeBank } from '../graph-implementation/factory/splitview-content-node-bank'

interface Stage {
  name: string
  steps: Record<string, unknown>[]
}

export const PipelineStudioGraphViewStages = ({ data }: { data: AnyContainerNodeType[] }): React.ReactElement => {
  const { selectedPath, yamlRevision } = useUnifiedPipelineStudioContext()
  const nodes = useMemo(() => {
    return splitView_contentNodeBank.getNodesDefinition()
  }, [])
  const [stage, setStage] = useState<Stage>()

  useEffect(() => {
    if (selectedPath?.stages) {
      const yamlJson = parse(yamlRevision.yaml)
      const stage = get(yamlJson, selectedPath.stages, {})
      console.log(stage)
      setStage(stage)
    }
  }, [selectedPath?.stages, yamlRevision])

  const service = get(stage, 'service', '')
  const env = get(stage, 'environment.id', '')
  const infra = get(stage, 'environment.deploy-to', '')

  return (
    <div className="relative flex flex-col h-full grow bg-graph-bg-gradient bg-graph-bg-size">
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
          data={data}
          nodes={nodes}
        />
        <CanvasControls />
      </CanvasProvider>
      {selectedPath?.stages ? (
        <Layout.Flex className="border-t border-cn-borders-2 h-16 justify-between items-center px-4 cursor-pointer">
          <Text variant="heading-subsection">{stage?.name}</Text>
          <Layout.Flex align="center" gap="lg">
            <Layout.Flex direction="column">
              <Text>Steps</Text>
              <Text>{stage?.steps?.length}</Text>
            </Layout.Flex>
            {service && (
              <Layout.Flex direction="column">
                <Text>Service</Text>
                <Text>{service}</Text>
              </Layout.Flex>
            )}
            {env ? (
              <Layout.Flex direction="column">
                <Text>Env</Text>
                <Text>{env}</Text>
              </Layout.Flex>
            ) : null}
            {infra ? (
              <Layout.Flex direction="column">
                <Text>Infra</Text>
                <Text>{infra}</Text>
              </Layout.Flex>
            ) : null}
          </Layout.Flex>
        </Layout.Flex>
      ) : null}
    </div>
  )
}
