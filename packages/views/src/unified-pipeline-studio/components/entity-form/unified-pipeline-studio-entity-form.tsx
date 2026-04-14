import { useEffect, useMemo, useState } from 'react'

import { useUnifiedPipelineStudioContext } from '@views/unified-pipeline-studio/context/unified-pipeline-studio-context'
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
import { Button, ButtonLayout, Drawer, IconV2, Skeleton, Text } from '@harnessio/ui/components'

import { getHarnessSteOrGroupIdentifier, getHarnessStepOrGroupDefinition, isHarnessGroup } from '../steps/harness-steps'
import { TEMPLATE_CD_STEP_IDENTIFIER, TEMPLATE_CI_STEP_IDENTIFIER } from '../steps/types'

interface UnifiedPipelineStudioEntityFormProps {
  requestClose: () => void
  isDirtyRef: { current?: boolean }
}

export const UnifiedPipelineStudioEntityForm = (props: UnifiedPipelineStudioEntityFormProps) => {
  const { requestClose, isDirtyRef } = props
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
      else if (step[TEMPLATE_CI_STEP_IDENTIFIER] || step[TEMPLATE_CD_STEP_IDENTIFIER]) {
        setDefaultStepValues(step)
        setExternalLoading(true)
        const identifier = step[TEMPLATE_CI_STEP_IDENTIFIER]?.uses ?? step[TEMPLATE_CD_STEP_IDENTIFIER]?.uses ?? ''
        getTemplateFormDefinition(identifier)
          .then(templateFormDefinition => {
            return setFormDefinition({
              inputs: addNameInput(templateFormDefinition.inputs, 'name'),
              metadata: templateFormDefinition.metadata
            })
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
          return setFormDefinition({
            inputs: addNameInput(templateFormDefinition.inputs, 'name'),
            metadata: templateFormDefinition.metadata
          })
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
    // TODO: remove validationConfig
    validationConfig: {
      requiredMessage: 'Required input',
      requiredMessagePerInput: { ['select']: 'Selection is required' }
    }
  })

  const loading = !formDefinition || externalLoading

  const stepDrawerTitle = useMemo(() => {
    const stepDrawerRaw =
      formEntity?.data?.identifier ??
      defaultStepValues[TEMPLATE_CI_STEP_IDENTIFIER]?.uses ??
      defaultStepValues[TEMPLATE_CD_STEP_IDENTIFIER]?.uses ??
      ''
    const harnessDef =
      stepDrawerRaw && !stepDrawerRaw.includes('@') && !stepDrawerRaw.includes('/')
        ? getHarnessStepOrGroupDefinition(stepDrawerRaw, stepsDefinitions)
        : undefined
    return harnessDef?.name ?? stepDrawerRaw
  }, [defaultStepValues, formEntity, stepsDefinitions])

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
          const cleanWith = omitBy(stepValue.template?.with, isUndefined)
          const alias = String(get(formDefinition.metadata, 'alias', ''))
          /**
           * "alias" will be used directly as the "templateKey" once TEMPLATE_CI_STEP_IDENTIFIER changes from "template" to "build"
           */
          const templateKey = alias === 'deploy' ? alias : TEMPLATE_CI_STEP_IDENTIFIER

          stepValue = {
            ...omit(stepValue, templateKey),
            [templateKey]: {
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
      {rootForm => {
        isDirtyRef.current = rootForm.formState.isDirty

        return (
          <>
            <Drawer.Header>
              <Drawer.Tagline>{editStepIntention ? 'Edit step' : 'Add step'}</Drawer.Tagline>
              <Drawer.Title>{stepDrawerTitle}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              {/* <StepFormSection.Header> */}
              {/* <StepFormSection.Title>General</StepFormSection.Title> */}
              {/* <StepFormSection.Description>Read documentation to learn more.</StepFormSection.Description> */}
              {/* </StepFormSection.Header> */}
              {error?.message ? (
                <Text color="danger">{error.message}</Text>
              ) : loading ? (
                <Skeleton.List />
              ) : (
                <RenderForm className="space-y-cn-xl" factory={inputComponentFactory} inputs={formDefinition} />
              )}
            </Drawer.Body>
            <Drawer.Footer>
              <ButtonLayout.Root>
                <ButtonLayout.Primary className="gap-x-cn-sm flex">
                  <Button disabled={loading || !!error?.message} onClick={() => rootForm.submitForm()}>
                    {editStepIntention ? 'Update step' : 'Add step'}
                  </Button>
                </ButtonLayout.Primary>
                {!!editStepIntention && (
                  <ButtonLayout.Secondary>
                    <Button
                      variant="secondary"
                      iconOnly
                      onClick={() => {
                        requestYamlModifications.deleteInArray({ path: editStepIntention.path })
                        requestClose()
                      }}
                      aria-label="Remove Step"
                      tooltipProps={{ content: 'Remove Step' }}
                    >
                      <IconV2 name="trash" />
                    </Button>
                  </ButtonLayout.Secondary>
                )}
              </ButtonLayout.Root>
            </Drawer.Footer>
          </>
        )
      }}
    </RootForm>
  )
}
