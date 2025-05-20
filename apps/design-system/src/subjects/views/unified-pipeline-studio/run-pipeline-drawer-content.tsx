import { useState } from 'react'

import { InputFactory } from '@harnessio/forms'
import {
  BooleanFormInput,
  NumberFormInput,
  RunPipelineDrawerContent as RunPipelineDrawerContentView,
  TextFormInput,
  VisualYamlValue
} from '@harnessio/ui/views'
import { YamlRevision } from '@harnessio/yaml-editor'

const inputComponentFactory = new InputFactory()
inputComponentFactory.registerComponent(new TextFormInput())
inputComponentFactory.registerComponent(new BooleanFormInput())
inputComponentFactory.registerComponent(new NumberFormInput())

const pipelineInputs = {
  stringRequired: { type: 'string', required: true },
  stringPattern: { type: 'string', pattern: '^[A-Z]*$' },
  stringRequiredPattern: { type: 'string', required: true, pattern: '^[A-Z]*$' },
  stringEnum: { type: 'string', enum: ['Option 1', 'Option 2', 'Option 3'] },
  stringEnumDefault: { type: 'string', enum: ['Option 1', 'Option 2', 'Option 3'], default: 'Option 2' },
  stringDefault: { type: 'string', default: 'Default value 1' },
  stringRequiredDefault: { type: 'string', required: true, default: 'Default value 2' },
  boolean: { type: 'boolean' },
  booleanDefaultTrue: { type: 'boolean', default: true },
  booleanDefaultFalse: { type: 'boolean', default: false }
}

export interface RunPipelineFormProps {
  onClose: () => void
}

export default function RunPipelineDrawerContent({ onClose }: RunPipelineFormProps) {
  const [yamlRevision, setYamlRevision] = useState<YamlRevision>({ yaml: '' })
  const [view, setView] = useState<VisualYamlValue>('visual')
  const [isLoadingPipeline] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState<{ message?: string } | undefined>()

  return (
    <RunPipelineDrawerContentView
      isValid={isValid}
      onValidationChange={setIsValid}
      view={view}
      onViewChange={setView}
      isLoadingPipeline={isLoadingPipeline}
      yamlRevision={yamlRevision}
      onYamlRevisionChange={setYamlRevision}
      onCancel={onClose}
      onRun={() => setError({ message: 'Pipeline execution failed. Error message ...' })}
      pipelineInputs={pipelineInputs}
      inputComponentFactory={inputComponentFactory}
      theme={'dark'}
      error={error}
      isExecutingPipeline={false}
    />
  )
}
