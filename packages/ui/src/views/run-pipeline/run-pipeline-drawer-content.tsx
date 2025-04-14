import { useRef, useState } from 'react'

import { Button, Drawer, Spacer } from '@components/index'

import { InputFactory } from '@harnessio/forms'
import { YamlRevision } from '@harnessio/yaml-editor'

import { VisualYamlToggle, VisualYamlValue } from '..'
import RunPipelineFormInputs from './run-pipeline-from-inputs'

export interface RunPipelineDrawerProps {
  isValid: boolean
  onValidationChange: (valid: boolean) => void
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
    isValid,
    onValidationChange,
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

  const rootFormRef = useRef<{
    submitForm: () => void
  }>()

  const [isYamlSyntaxValid, setIsYamlSyntaxValid] = useState(true)
  const [allowDisableRun, setAllowDisableRun] = useState(false)

  return (
    <Drawer.Content
      //TODO: fix h/w. maxHeight, scrolling...
      style={{ width: '500px' }}
      className="flex flex-col"
      // style={{ maxHeight: '70vh', minHeight: '60vh' }}
      // className="max-w-[700px] border-cn-borders-1 bg-primary-background"
    >
      <Drawer.Header>
        <Drawer.Title>Run Pipeline</Drawer.Title>
      </Drawer.Header>
      <Drawer.Description className="flex grow flex-col">
        <Spacer size={6} />
        <div>
          <VisualYamlToggle
            isYamlValid={isYamlSyntaxValid}
            view={view}
            setView={view => {
              onViewChange(view)
              setAllowDisableRun(false)
            }}
          />
        </div>
        <Spacer size={6} />
        {loading ? (
          'Loading ...'
        ) : (
          <div className="flex grow flex-col">
            <RunPipelineFormInputs
              onValidationChange={formState => {
                onValidationChange(formState.isValid)
              }}
              onYamlSyntaxValidationChange={isValid => {
                setIsYamlSyntaxValid(isValid)
                onValidationChange(isValid)
              }}
              rootFormRef={rootFormRef}
              onFormSubmit={_values => {
                // NOTE: latest values are passed with onYamlRevisionChange
                onRun()
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
          </div>
        )}
      </Drawer.Description>
      <Spacer size={6} />
      <Drawer.Footer>
        {error?.message && <p className="text-destructive text-xs">{error.message}</p>}
        <div className="flex gap-4">
          <Button onClick={onCancel} className="text-primary" variant="outline" disabled={isExecutingPipeline}>
            Cancel
          </Button>
          <Button
            disabled={(allowDisableRun && !isValid) || !isYamlSyntaxValid}
            loading={isExecutingPipeline}
            onClick={() => {
              if (view === 'visual') {
                setAllowDisableRun(true)
                rootFormRef.current?.submitForm()
              } else {
                onRun()
              }
            }}
          >
            Run pipeline
          </Button>
        </div>
      </Drawer.Footer>
    </Drawer.Content>
  )
}
