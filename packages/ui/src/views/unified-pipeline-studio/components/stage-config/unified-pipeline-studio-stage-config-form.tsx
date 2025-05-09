import { useEffect, useState } from 'react'

import { Button } from '@components/button'
import { Icon } from '@components/icon'
import { get } from 'lodash-es'
import { parse } from 'yaml'

import {
  getTransformers,
  inputTransformValues,
  outputTransformValues,
  RenderForm,
  RootForm,
  useZodValidationResolver
} from '@harnessio/forms'

import { useUnifiedPipelineStudioContext } from '../../context/unified-pipeline-studio-context'
import { EntityFormLayout } from '../entity-form/entity-form-layout'
import { EntityFormSectionLayout } from '../entity-form/entity-form-section-layout'
import { basicStageFormDefinition } from './form-definition/stage-form-definition'

interface UnifiedPipelineStudioStageConfigFormProps {
  requestClose: () => void
}

export const UnifiedPipelineStudioStageConfigForm = (props: UnifiedPipelineStudioStageConfigFormProps) => {
  const { requestClose } = props

  const {
    addStageIntention,
    editStageIntention,
    requestYamlModifications,
    inputComponentFactory,
    yamlRevision,
    stageFormDefinition: stageFormDefinitionFromProps
  } = useUnifiedPipelineStudioContext()

  const stageFormDefinition = stageFormDefinitionFromProps ?? basicStageFormDefinition
  const [defaultStageValues, setDefaultStageValues] = useState<Record<string, any>>()

  useEffect(() => {
    if (editStageIntention) {
      const yamlJson = parse(yamlRevision.yaml)
      const step = get(yamlJson, editStageIntention.path)

      const transformers = getTransformers(stageFormDefinition ?? { inputs: [] })
      const stageValue = inputTransformValues(step, transformers)

      setDefaultStageValues(stageValue)
    }
  }, [editStageIntention, yamlRevision])

  const resolver = useZodValidationResolver(stageFormDefinition ?? { inputs: [] })

  return (
    <RootForm
      autoFocusPath={stageFormDefinition?.inputs?.[0]?.path}
      defaultValues={defaultStageValues}
      resolver={resolver}
      mode="onSubmit"
      onSubmit={values => {
        const transformers = getTransformers(stageFormDefinition)
        const stageValue = outputTransformValues(values, transformers)

        if (addStageIntention) {
          requestYamlModifications.injectInArray({
            path: addStageIntention.path,
            position: addStageIntention.position,
            item: { ...stageValue, steps: [] }
          })
        } else if (editStageIntention) {
          requestYamlModifications.updateInArray({
            path: editStageIntention.path,
            item: stageValue
          })
        }

        requestClose()
      }}
      validateAfterFirstSubmit={true}
    >
      {rootForm => (
        <EntityFormLayout.Root>
          <EntityFormLayout.Header>
            <EntityFormLayout.Title>{editStageIntention ? 'Edit' : 'Add'} Stage</EntityFormLayout.Title>
            <EntityFormLayout.Description>
              Configure a stage for your pipeline. Stages are logical groupings of steps that execute together.
            </EntityFormLayout.Description>
            <EntityFormLayout.Actions>
              <Button variant={'ai'}> AI Autofill</Button>
              <Button variant={'outline'}> Use Template</Button>
            </EntityFormLayout.Actions>
          </EntityFormLayout.Header>
          <EntityFormSectionLayout.Root>
            <EntityFormSectionLayout.Form>
              <RenderForm className="space-y-5 p-5" factory={inputComponentFactory} inputs={stageFormDefinition} />
            </EntityFormSectionLayout.Form>
          </EntityFormSectionLayout.Root>
          <EntityFormLayout.Footer>
            <div className="flex gap-x-3">
              <Button onClick={() => rootForm.submitForm()}>Submit</Button>
              <Button variant="secondary" onClick={requestClose}>
                Cancel
              </Button>
            </div>
            {editStageIntention && (
              <Button
                variant="secondary"
                iconOnly
                onClick={() => {
                  requestYamlModifications.deleteInArray({ path: editStageIntention.path })
                  requestClose()
                }}
              >
                <Icon name="trash" />
              </Button>
            )}
          </EntityFormLayout.Footer>
        </EntityFormLayout.Root>
      )}
    </RootForm>
  )
}
