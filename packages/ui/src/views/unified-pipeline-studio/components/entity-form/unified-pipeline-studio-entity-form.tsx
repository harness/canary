import { useEffect, useState } from 'react'

import { Button } from '@components/button'
import { Icon } from '@components/icon'
import { SkeletonList } from '@components/index'
import { addNameInput } from '@views/unified-pipeline-studio/utils/entity-form-utils'
import { get, isEmpty, isUndefined, omit, omitBy } from 'lodash-es'
import { parse } from 'yaml'

import {
  getTransformers,
  IFormDefinition,
  inputTransformValues,
  outputTransformValues,
  RenderForm,
  RootForm,
  useZodValidationResolver
} from '@harnessio/forms'

import { useUnifiedPipelineStudioContext } from '../../../unified-pipeline-studio/context/unified-pipeline-studio-context'
import { getHarnessSteOrGroupIdentifier, getHarnessStepOrGroupDefinition, isHarnessGroup } from '../steps/harness-steps'
import { TEMPLATE_STEP_IDENTIFIER } from '../steps/types'
import { EntityFormLayout } from './entity-form-layout'
import { EntityFormSectionLayout } from './entity-form-section-layout'

interface UnifiedPipelineStudioEntityFormProps {
  requestClose: () => void
}

export const UnifiedPipelineStudioEntityForm = (props: UnifiedPipelineStudioEntityFormProps) => {
  const { requestClose } = props
  const {
    yamlRevision,
    addStepIntention,
    editStepIntention,
    requestYamlModifications,
    setFormEntity,
    formEntity,
    useTemplateListStore,
    inputComponentFactory,
    stepsDefinitions
  } = useUnifiedPipelineStudioContext()

  const { getTemplateFormDefinition } = useTemplateListStore()

  const [defaultStepValues, setDefaultStepValues] = useState<Record<string, any>>({})

  const [externalLoading, setExternalLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {
    if (editStepIntention) {
      const yamlJson = parse(yamlRevision.yaml)
      const step = get(yamlJson, editStepIntention.path)

      const harnessStepIdentifier = getHarnessSteOrGroupIdentifier(step)

      // process harness step
      if (harnessStepIdentifier) {
        const stepDefinition = getHarnessStepOrGroupDefinition(harnessStepIdentifier, stepsDefinitions)

        if (stepDefinition) {
          const transformers = getTransformers(stepDefinition?.formDefinition ?? { inputs: [] })
          const stepValue = inputTransformValues(step, transformers)
          setDefaultStepValues(stepValue)
          setFormEntity({
            source: 'embedded',
            type: 'step',
            data: {
              identifier: stepDefinition.identifier,
              description: stepDefinition.description
            }
          })
        }
      }
      // process templates step
      else if (step[TEMPLATE_STEP_IDENTIFIER]) {
        setDefaultStepValues(step)
        setExternalLoading(true)
        getTemplateFormDefinition(step.template.uses)
          .then(templateFormDefinition => {
            return setFormDefinition({ inputs: addNameInput(templateFormDefinition.inputs, 'name') })
          })
          .catch(err => {
            setError(err)
          })
          .finally(() => {
            setExternalLoading(false)
          })
      }
    }
  }, [editStepIntention])

  const [formDefinition, setFormDefinition] = useState<IFormDefinition | null>(null)

  useEffect(() => {
    if (formEntity?.source === 'embedded') {
      const harnessStepDefinition = getHarnessStepOrGroupDefinition(formEntity.data.identifier, stepsDefinitions)
      if (harnessStepDefinition) {
        setFormDefinition({
          ...harnessStepDefinition.formDefinition,
          inputs: addNameInput(harnessStepDefinition.formDefinition.inputs, 'name')
        })
      }
    } else if (formEntity?.source === 'external') {
      setExternalLoading(true)

      getTemplateFormDefinition(`${formEntity.data.identifier}@${formEntity.data.version}`)
        .then(templateFormDefinition => {
          return setFormDefinition({ inputs: addNameInput(templateFormDefinition.inputs, 'name') })
        })
        .catch(err => {
          setError(err)
        })
        .finally(() => {
          setExternalLoading(false)
        })
    } else {
      setFormDefinition({ inputs: [] })
    }
  }, [formEntity])

  const resolver = useZodValidationResolver(formDefinition ?? { inputs: [] }, {
    validationConfig: {
      requiredMessage: 'Required input',
      requiredMessagePerInput: { ['select']: 'Selection is required' }
    }
  })

  const loading = !formDefinition || externalLoading

  return (
    <RootForm
      autoFocusPath={formDefinition?.inputs?.[0]?.path}
      defaultValues={defaultStepValues}
      resolver={resolver}
      mode="onSubmit"
      onSubmit={values => {
        // TODO: improve handling logic for add/update step or template (in the future we could add more entities)

        if (!formDefinition) return

        const transformers = getTransformers(formDefinition)
        let stepValue = outputTransformValues(values, transformers)

        // TODO:move transform logic outside for "external"
        if (formEntity?.source === 'external') {
          // remove "with" if its a empty object
          const cleanWith = omitBy(stepValue.template.with, isUndefined)

          // add 'uses' for template step
          stepValue = {
            ...omit(stepValue, 'template'),
            template: {
              uses: `${formEntity.data.identifier}@${formEntity.data.version}`,
              ...(isEmpty(cleanWith) ? {} : { with: cleanWith })
            }
          }
        }

        if (addStepIntention) {
          // step group
          if (formEntity?.data?.identifier && isHarnessGroup({ [formEntity.data.identifier]: true })) {
            requestYamlModifications.injectInArray({
              path: addStepIntention.path,
              position: addStepIntention.position,
              item: { [formEntity.data.identifier]: { ...stepValue, steps: [] } }
            })
          }
          // step
          else {
            requestYamlModifications.injectInArray({
              path: addStepIntention.path,
              position: addStepIntention.position,
              item: stepValue
            })
          }
        } else if (editStepIntention) {
          if (formEntity?.source === 'external') {
            const cleanWith = omitBy(stepValue.template.with, isUndefined)

            // remove "with" if its a empty object
            if (stepValue.template && isEmpty(cleanWith)) {
              delete stepValue.template.with
            }
          }

          requestYamlModifications.updateInArray({
            path: editStepIntention.path,
            item: stepValue
          })
        }

        requestClose()
      }}
      validateAfterFirstSubmit={true}
    >
      {rootForm => (
        <EntityFormLayout.Root>
          <EntityFormLayout.Header>
            <EntityFormLayout.Title>
              {editStepIntention ? 'Edit' : 'Add'} Step :{' '}
              {formEntity?.data?.identifier ?? defaultStepValues.template?.uses}
            </EntityFormLayout.Title>
            <EntityFormLayout.Description>{formEntity?.data.description}</EntityFormLayout.Description>
            {/* <EntityFormLayout.Actions>
              <AIButton label="AI Autofill" />
            </EntityFormLayout.Actions> */}
          </EntityFormLayout.Header>
          <EntityFormSectionLayout.Root>
            {/* <StepFormSection.Header> */}
            {/* <StepFormSection.Title>General</StepFormSection.Title> */}
            {/* <StepFormSection.Description>Read documentation to learn more.</StepFormSection.Description> */}
            {/* </StepFormSection.Header> */}
            <EntityFormSectionLayout.Form>
              {error?.message ? (
                <p className="text-sm text-cn-foreground-danger">{error.message}</p>
              ) : loading ? (
                <SkeletonList className="p-5" />
              ) : (
                <>
                  <RenderForm className="space-y-5 p-5" factory={inputComponentFactory} inputs={formDefinition} />
                </>
              )}
            </EntityFormSectionLayout.Form>
          </EntityFormSectionLayout.Root>
          <EntityFormLayout.Footer>
            <div className="flex gap-x-3">
              <Button disabled={loading || !!error?.message} onClick={() => rootForm.submitForm()}>
                Submit
              </Button>
              <Button variant="soft" theme="muted" onClick={requestClose}>
                Cancel
              </Button>
            </div>
            {editStepIntention && (
              <Button
                variant="soft"
                theme="muted"
                iconOnly
                onClick={() => {
                  requestYamlModifications.deleteInArray({ path: editStepIntention.path })
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
