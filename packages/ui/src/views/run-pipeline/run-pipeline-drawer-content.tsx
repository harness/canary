import { useRef, useState } from 'react'

import { Button, Drawer, SkeletonList } from '@/components'
import { cn } from '@/utils'

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
      //TODO: width
      style={{ width: '500px' }}
    >
      <Drawer.Header>
        <Drawer.Title>Run Pipeline</Drawer.Title>
        <VisualYamlToggle
          className="self-start"
          isYamlValid={isYamlSyntaxValid}
          view={view}
          setView={view => {
            onViewChange(view)
            setAllowDisableRun(false)
          }}
        />
      </Drawer.Header>

      <Drawer.Inner viewportClassName={cn({ 'p-0 [&>div]:h-full': view === 'yaml' })}>
        {loading ? (
          <SkeletonList className="p-5" />
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
        {!!error?.message && <p className="text-sm text-cn-foreground-danger">{error.message}</p>}
      </Drawer.Inner>

      <Drawer.Footer>
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
        <Button onClick={onCancel} variant="secondary" disabled={isExecutingPipeline}>
          Cancel
        </Button>
      </Drawer.Footer>
    </Drawer.Content>
  )
}
