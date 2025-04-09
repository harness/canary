import { Button, Drawer, Spacer } from '@components/index'

import { InputFactory } from '@harnessio/forms'
import { YamlRevision } from '@harnessio/yaml-editor'

import { VisualYamlToggle, VisualYamlValue } from '..'
import RunPipelineFormInputs from './run-pipeline-from-inputs'

export interface RunPipelineDrawerProps {
  isYamlValid: boolean
  onYamlValidChange: (valid: boolean) => void
  view: VisualYamlValue
  onViewChange: (view: VisualYamlValue) => void
  isLoadingPipeline: boolean
  isExecutingPipeline?: boolean
  yamlRevision: YamlRevision
  onYamlRevisionChange: (yamlRevision: YamlRevision) => void
  onCancel: () => void
  onClose?: () => void
  onRun: () => void
  pipelineInputs: Record<string, unknown>
  inputComponentFactory: InputFactory
  theme: 'light' | 'dark'
  error?: { message?: string }
}

export function RunPipelineDrawerContent(props: RunPipelineDrawerProps) {
  const {
    isYamlValid,
    onYamlValidChange,
    view,
    isLoadingPipeline: loading,
    onViewChange,
    onYamlRevisionChange,
    isExecutingPipeline,
    onCancel,
    onRun,
    pipelineInputs,
    yamlRevision,
    inputComponentFactory,
    theme,
    error
  } = props

  return (
    <Drawer.Content
      //TODO: fix h/w. maxHeight, scrolling...
      style={{ width: '500px' }}
      className="flex flex-col"
      // style={{ maxHeight: '70vh', minHeight: '60vh' }}
      // className="max-w-[700px] border-border bg-primary-background"
    >
      <Drawer.Header>
        <Drawer.Title>Run Pipeline</Drawer.Title>
      </Drawer.Header>
      <Drawer.Description className="grow">
        <Spacer size={6} />
        <VisualYamlToggle isYamlValid={isYamlValid} view={view} setView={onViewChange} />
        <Spacer size={6} />
        {loading ? (
          'Loading ...'
        ) : (
          <RunPipelineFormInputs
            onYamlSyntaxValidChange={isValid => {
              onYamlValidChange(isValid)
            }}
            onYamlRevisionChange={revision => {
              onYamlRevisionChange(revision)
            }}
            view={view}
            pipelineInputs={pipelineInputs}
            yamlRevision={yamlRevision}
            inputComponentFactory={inputComponentFactory}
            theme={theme}
          />
        )}
      </Drawer.Description>
      <Spacer size={6} />
      <Drawer.Footer>
        {error?.message && <p className="text-destructive text-xs">{error.message}</p>}
        <div className="flex gap-4">
          <Button onClick={onCancel} className="text-primary" variant="outline" disabled={isExecutingPipeline}>
            Cancel
          </Button>
          <Button loading={isExecutingPipeline} onClick={onRun}>
            Run pipeline
          </Button>
        </div>
      </Drawer.Footer>
    </Drawer.Content>
  )
}
