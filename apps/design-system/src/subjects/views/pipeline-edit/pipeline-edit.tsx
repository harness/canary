import { useState } from 'react'

import { Button, ButtonGroup, Icon } from '@harnessio/ui/components'
import {
  CommonNodeDataType,
  deleteItemInArray,
  ErrorDataType,
  injectItemInArray,
  PipelineEdit,
  YamlEntityType
} from '@harnessio/ui/views'

import { demoPSYaml } from './mocks/demoPSYaml'
import { parallelContainerConfig, serialContainerConfig } from './mocks/pipelineExecutionMock'
import { contentNodeFactory } from './nodes-factory'
import PipelineExecution from './pipeline-execution'
import CustomPort from './pipeline-nodes/components/custom-port'
import { getIconBasedOnStep } from './utils/step-icon-utils'

const PipelineStudioWrapper = () => {
  const [yamlRevision, setYamlRevision] = useState({ yaml: demoPSYaml })
  const [view, setView] = useState<'graph' | 'yaml'>('graph')
  const [isExecution, setIsExecution] = useState(true)

  const [selectedPath, setSelectedPath] = useState<string | undefined>()
  const [errorData, setErrorData] = useState<ErrorDataType>()

  const processAddIntention = (
    nodeData: CommonNodeDataType,
    position: 'after' | 'before' | 'in',
    yamlEntityTypeToAdd?: YamlEntityType | undefined
  ) => {
    let newYaml = yamlRevision.yaml

    switch (yamlEntityTypeToAdd) {
      case YamlEntityType.SerialStageGroup:
        // NOTE: if we are adding in the array we have to provide path to children array
        newYaml = injectItemInArray(yamlRevision.yaml, {
          path: position === 'in' && nodeData.yamlChildrenPath ? nodeData.yamlChildrenPath : nodeData.yamlPath,
          position,
          item: { group: { stages: [] } }
        })
        break

      case YamlEntityType.ParallelStageGroup:
        // NOTE: if we are adding in the array we have to provide path to children array
        newYaml = injectItemInArray(yamlRevision.yaml, {
          path: position === 'in' && nodeData.yamlChildrenPath ? nodeData.yamlChildrenPath : nodeData.yamlPath,
          position,
          item: { parallel: { stages: [] } }
        })
        break

      case YamlEntityType.Stage:
        // NOTE: if we are adding in the array we have to provide path to children array
        newYaml = injectItemInArray(yamlRevision.yaml, {
          path: position === 'in' && nodeData.yamlChildrenPath ? nodeData.yamlChildrenPath : nodeData.yamlPath,
          position,
          item: { steps: [] }
        })
        break

      default:
        if (nodeData.yamlEntityType === YamlEntityType.Stage) {
          // TODO: set addIntent state and open drawer....
        }
        break
    }

    setYamlRevision({ yaml: newYaml })
  }

  const isYamlInvalid = errorData && !errorData?.isYamlValid

  return (
    <div // eslint-disable-line jsx-a11y/no-static-element-interactions
      className="flex h-screen flex-col"
      onClick={() => {
        setSelectedPath(undefined)
      }}
    >
      <ButtonGroup className="m-2 flex gap-2">
        <Button
          onClick={() => {
            setIsExecution(false)
            setView('graph')
          }}
          variant={'secondary'}
          disabled={isYamlInvalid}
        >
          {isYamlInvalid ? <Icon name="triangle-warning" /> : null}
          Visual
        </Button>
        <Button
          onClick={() => {
            setIsExecution(false)
            setView('yaml')
          }}
          variant={'secondary'}
        >
          Yaml
        </Button>
        <Button onClick={() => setIsExecution(true)} variant={'secondary'}>
          Run
        </Button>
      </ButtonGroup>

      {isExecution && <PipelineExecution />}

      {!isExecution && (
        <>
          <PipelineEdit
            customCreateSVGPath={props => {
              const { id, path /*, pathLength, targetNode*/ } = props
              // TODO
              const pathStyle = ` stroke="hsl(var(--canary-border-03))"`
              const staticPath = `<path d="${path}" id="${id}" fill="none" ${pathStyle} />`
              return { level1: staticPath, level2: '' }
            }}
            portComponent={CustomPort}
            edgesConfig={{ radius: 10, parallelNodeOffset: 10, serialNodeOffset: 10 }}
            yamlRevision={yamlRevision}
            onYamlRevisionChange={setYamlRevision}
            view={view}
            selectedPath={selectedPath}
            contentNodeFactory={contentNodeFactory}
            serialContainerConfig={serialContainerConfig}
            parallelContainerConfig={parallelContainerConfig}
            getStepIcon={getIconBasedOnStep}
            onErrorChange={data => {
              setErrorData(data)
            }}
            onAddIntention={(nodeData, position, yamlEntityTypeToAdd) => {
              console.log('onAddIntention')
              processAddIntention(nodeData, position, yamlEntityTypeToAdd)
            }}
            onDeleteIntention={data => {
              console.log('onDeleteIntention')
              const updatedYaml = deleteItemInArray(yamlRevision.yaml, { path: data.yamlPath })
              setYamlRevision({ yaml: updatedYaml })
            }}
            onEditIntention={() => {
              console.log('onEditIntention')
            }}
            onSelectIntention={data => {
              console.log('onSelectIntention')
              setSelectedPath(data.yamlPath)
            }}
            onRevealInYaml={() => {
              console.log('onSelectIntention')
            }}
          />
        </>
      )}
    </div>
  )
}

export default PipelineStudioWrapper
