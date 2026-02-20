import { useRef, useState } from 'react'

import { Button, ButtonLayout, Drawer, Skeleton, Text } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/utils'

import { InputFactory } from '@harnessio/forms'
import { YamlRevision } from '@harnessio/yaml-editor'

import { PipelineInputDefinition, VisualYamlToggle, VisualYamlValue } from '..'
import RunPipelineFormInputs from './run-pipeline-from-inputs'
import { type InputLayout } from './utils/types'

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
  pipelineInputs: Record<string, PipelineInputDefinition>
  inputComponentFactory: InputFactory
  theme: 'light' | 'dark'
  error?: { message?: string }
  pipelineInputLayout?: InputLayout
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
    error,
    pipelineInputLayout
  } = props

  const rootFormRef = useRef<{
    submitForm: () => void
  }>()

  const [isYamlSyntaxValid, setIsYamlSyntaxValid] = useState(true)
  const [allowDisableRun, setAllowDisableRun] = useState(false)

  return (
    <Drawer.Content>
      <Drawer.Header>
        <Drawer.Title>Run Pipeline</Drawer.Title>
        <VisualYamlToggle
          isYamlValid={isYamlSyntaxValid}
          view={view}
          setView={view => {
            onViewChange(view)
            setAllowDisableRun(false)
          }}
        />
      </Drawer.Header>

      <Drawer.Body className={cn({ 'p-0 [&>div]:h-full': view === 'yaml' })}>
        {loading ? (
          <Skeleton.List className="p-cn-lg" />
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
              pipelineInputLayout={pipelineInputLayout}
            />
          </div>
        )}
        {!!error?.message && <Text color="danger">{error.message}</Text>}
      </Drawer.Body>

      <Drawer.Footer>
        <ButtonLayout.Root>
          <ButtonLayout.Primary>
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
          </ButtonLayout.Primary>
          <ButtonLayout.Secondary>
            <Button onClick={onCancel} variant="secondary" disabled={isExecutingPipeline}>
              Cancel
            </Button>
          </ButtonLayout.Secondary>
        </ButtonLayout.Root>
      </Drawer.Footer>
    </Drawer.Content>
  )
}
