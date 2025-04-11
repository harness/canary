import { useState } from 'react'

import { noop } from 'lodash-es'

import { InputFactory } from '@harnessio/forms'
import {
  BooleanInput,
  NumberInput,
  RunPipelineDrawerContent as RunPipelineDrawerContentView,
  TextInput,
  VisualYamlValue
} from '@harnessio/ui/views'
import { YamlRevision } from '@harnessio/yaml-editor'

const inputComponentFactory = new InputFactory()
inputComponentFactory.registerComponent(new TextInput())
inputComponentFactory.registerComponent(new BooleanInput())
inputComponentFactory.registerComponent(new NumberInput())

export interface RunPipelineFormProps {
  onClose: () => void
}

export default function RunPipelineDrawerContent({ onClose }: RunPipelineFormProps) {
  const [yamlRevision, setYamlRevision] = useState<YamlRevision>({ yaml: '' })
  const [view, setView] = useState<VisualYamlValue>('visual')
  const [isLoadingPipeline] = useState(false)
  const [isYamlValid, setIsYamlValid] = useState(true)

  const pipelineInputs = { input1String: { type: 'string' }, input2Boolean: { type: 'boolean' } }

  return (
    <RunPipelineDrawerContentView
      isYamlValid={isYamlValid}
      onYamlValidChange={setIsYamlValid}
      view={view}
      onViewChange={setView}
      isLoadingPipeline={isLoadingPipeline}
      yamlRevision={yamlRevision}
      onYamlRevisionChange={setYamlRevision}
      onCancel={onClose}
      onRun={noop}
      pipelineInputs={pipelineInputs}
      inputComponentFactory={inputComponentFactory}
      theme={'dark'}
      error={undefined}
      isExecutingPipeline={false}
    />
  )
}
