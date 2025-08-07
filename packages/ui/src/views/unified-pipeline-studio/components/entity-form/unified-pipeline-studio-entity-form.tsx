import { ElementType, useEffect, useState } from 'react'

import { Button, ButtonLayout, Drawer, EntityFormLayout, IconV2, Skeleton, Text } from '@/components'
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

import { getHarnessSteOrGroupIdentifier, getHarnessStepOrGroupDefinition, isHarnessGroup } from '../steps/harness-steps'
import { TEMPLATE_CD_STEP_IDENTIFIER, TEMPLATE_CI_STEP_IDENTIFIER } from '../steps/types'

const componentsMap: Record<
  'true' | 'false',
  {
    Header: ElementType
    Title: ElementType
    Description: ElementType
    Body: ElementType
    Footer: ElementType
  }
> = {
  true: {
    Header: Drawer.Header,
    Title: Drawer.Title,
    Description: Drawer.Description,
    Body: Drawer.Body,
    Footer: Drawer.Footer
  },
  false: {
    Header: EntityFormLayout.Header,
    Title: EntityFormLayout.Title,
    Description: EntityFormLayout.Description,
    Body: 'div',
    Footer: EntityFormLayout.Footer
  }
}

interface UnifiedPipelineStudioEntityFormProps {
  requestClose: () => void
  isDrawer?: boolean
  isDirtyRef: { current?: boolean }
}

export const UnifiedPipelineStudioEntityForm = (props: UnifiedPipelineStudioEntityFormProps) => {
  const { requestClose, isDrawer = false, isDirtyRef } = props
  const { Header, Title, Description, Body, Footer } = componentsMap[isDrawer ? 'true' : 'false']
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
            <Header>
              <Title>
                {editStepIntention ? 'Edit' : 'Add'} Step :{' '}
                {formEntity?.data?.identifier ??
                  defaultStepValues[TEMPLATE_CI_STEP_IDENTIFIER]?.uses ??
                  defaultStepValues[TEMPLATE_CD_STEP_IDENTIFIER]?.uses}
              </Title>
              <Description>{formEntity?.data.description}</Description>
              {/*<AIButton label="AI Autofill" />*/}
            </Header>
            <Body>
              {/* <StepFormSection.Header> */}
              {/* <StepFormSection.Title>General</StepFormSection.Title> */}
              {/* <StepFormSection.Description>Read documentation to learn more.</StepFormSection.Description> */}
              {/* </StepFormSection.Header> */}
              <EntityFormLayout.Form>
                {error?.message ? (
                  <Text color="danger">{error.message}</Text>
                ) : loading ? (
                  <Skeleton.List />
                ) : (
                  <RenderForm className="space-y-5" factory={inputComponentFactory} inputs={formDefinition} />
                )}
              </EntityFormLayout.Form>
            </Body>
            <Footer>
              <ButtonLayout.Root>
                <ButtonLayout.Primary className="flex gap-x-3">
                  <Button disabled={loading || !!error?.message} onClick={() => rootForm.submitForm()}>
                    Submit
                  </Button>
                  <Button variant="secondary" onClick={requestClose}>
                    Cancel
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
                    >
                      <IconV2 name="trash" />
                    </Button>
                  </ButtonLayout.Secondary>
                )}
              </ButtonLayout.Root>
            </Footer>
          </>
        )
      }}
    </RootForm>
  )
}
