import { useState } from 'react'

import { Button, ButtonGroup, Icon, IconProps } from '@harnessio/ui/components'
import {
  CommonNodeDataType,
  deleteItemInArray,
  ErrorDataType,
  injectItemInArray,
  PipelineEdit,
  YamlEntityType
} from '@harnessio/ui/views'

import { pipelineYaml1 } from './mocks/pipelineYaml1'

const PipelineStudioWrapper = () => {
  const [yamlRevision, setYamlRevision] = useState({ yaml: pipelineYaml1 })
  const [view, setView] = useState<'graph' | 'yaml'>('graph')
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
        <Button onClick={() => setView('graph')} variant={'secondary'} disabled={isYamlInvalid}>
          {isYamlInvalid ? <Icon name="triangle-warning" /> : null}
          Visual
        </Button>
        <Button onClick={() => setView('yaml')} variant={'secondary'}>
          Yaml
        </Button>
      </ButtonGroup>

      <PipelineEdit
        yamlRevision={yamlRevision}
        onYamlRevisionChange={setYamlRevision}
        view={view}
        selectedPath={selectedPath}
        getStepIcon={step => {
          console.log(step)
          const iconsNames: IconProps['name'][] = ['run', 'run-test', 'branch', 'artifacts']
          const randomIconName = Math.floor(Math.random() * iconsNames.length)
          return <Icon name={iconsNames[randomIconName]} size={48} className="p-2" />
        }}
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
    </div>
  )
}

export default PipelineStudioWrapper
