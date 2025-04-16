import { useRef, useState } from 'react'

import { Button, Drawer, Spacer } from '@components/index'
import { EntityFormLayout } from '@views/unified-pipeline-studio/components/entity-form/entity-form-layout'
import { EntityFormSectionLayout } from '@views/unified-pipeline-studio/components/entity-form/entity-form-section-layout'

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
      className="flex flex-col p-0"
    >
      <EntityFormLayout.Root>
        <EntityFormLayout.Header>
          <EntityFormLayout.Title>Run Pipeline</EntityFormLayout.Title>
          <EntityFormLayout.Actions>
            <VisualYamlToggle
              isYamlValid={isYamlSyntaxValid}
              view={view}
              setView={view => {
                onViewChange(view)
                setAllowDisableRun(false)
              }}
            />
          </EntityFormLayout.Actions>
        </EntityFormLayout.Header>

        <EntityFormSectionLayout.Root>
          <EntityFormSectionLayout.Form>
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
          </EntityFormSectionLayout.Form>
        </EntityFormSectionLayout.Root>

        <EntityFormLayout.Footer className="flex-col gap-4">
          {error?.message && <p className="text-destructive text-xs">{error.message}</p>}
          <div className="flex gap-4">
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
            <Button onClick={onCancel} className="text-primary" variant="outline" disabled={isExecutingPipeline}>
              Cancel
            </Button>
          </div>
        </EntityFormLayout.Footer>
      </EntityFormLayout.Root>
    </Drawer.Content>
  )
}
