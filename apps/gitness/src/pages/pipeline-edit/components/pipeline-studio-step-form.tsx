import { useEffect, useMemo, useRef, useState } from 'react'
import { parse } from 'yaml'
import { get, pick, set } from 'lodash-es'
import { Button } from '@harnessio/canary'
import {
  IFormDefinition,
  RenderForm,
  RootForm,
  getTransformers,
  inputTransformValues,
  outputTransformValues,
  useZodValidationResolver
} from '@harnessio/forms'
import { Icon } from '@harnessio/canary'
import { useListPluginsQuery } from '@harnessio/code-service-client'
import {
  StepForm,
  StepFormSection,
  inputComponentFactory,
  TEMPLATE_STEP_IDENTIFIER,
  getHarnessStepDefinition,
  InputType,
  getHarnessStepIdentifier
} from '@harnessio/playground'
import { usePipelineDataContext } from '../context/PipelineStudioDataProvider'
import { ApiInputs, addNameInput, apiInput2IInputDefinition } from '../utils/step-form-utils'

interface PipelineStudioStepFormProps {
  requestClose: () => void
}

export const PipelineStudioStepForm = (props: PipelineStudioStepFormProps): JSX.Element => {
  const { requestClose } = props
  const {
    state: { yamlRevision, currentStepFormDefinition, addStepIntention, editStepIntention },
    requestYamlModifications,
    setCurrentStepFormDefinition
  } = usePipelineDataContext()

  const [defaultStepValues, setDefaultStepValues] = useState({})

  // TODO: only 100 items
  const { data: pluginsResponse } = useListPluginsQuery(
    { queryParams: { limit: 100, page: 1 } },
    { enabled: !!editStepIntention }
  )

  const plugins = useMemo(() => {
    // TODO: Do not parse all plugins in advance
    // TODO: duplicated code
    try {
      return pluginsResponse?.map(d => ({ ...d, spec: JSON.parse(d.spec ?? '') })) ?? []
    } catch (_ex) {
      // TODO
    }
  }, [pluginsResponse])

  // process harness step
  useEffect(() => {
    if (editStepIntention) {
      const yamlJson = parse(yamlRevision.yaml)
      const step = get(yamlJson, editStepIntention.path)

      const harnessStepIdentifier = getHarnessStepIdentifier(step)

      if (harnessStepIdentifier) {
        const stepDefinition = getHarnessStepDefinition(harnessStepIdentifier)
        const transformers = getTransformers(stepDefinition?.formDefinition ?? { inputs: [] })

        const stepValue = inputTransformValues(step, transformers)
        setDefaultStepValues(stepValue)

        setCurrentStepFormDefinition({
          ...pick(stepDefinition, 'identifier', 'description'),
          type: 'step' // TODO: this may be not needed
        })
      }
    }
  }, [editStepIntention, plugins])

  // process template step
  useEffect(() => {
    if (editStepIntention && plugins) {
      const yamlJson = parse(yamlRevision.yaml)
      const step = get(yamlJson, editStepIntention.path)

      if (step[TEMPLATE_STEP_IDENTIFIER]) {
        setDefaultStepValues(step)
        const editStep = plugins.find(plugin => plugin.identifier === step.template.uses)
        setCurrentStepFormDefinition(editStep ?? null)
      }
    }
  }, [editStepIntention, plugins])

  const formDefinition: IFormDefinition = useMemo(() => {
    if (currentStepFormDefinition?.identifier) {
      const harnessStepDefinition = getHarnessStepDefinition(currentStepFormDefinition.identifier)
      if (harnessStepDefinition) {
        return {
          ...harnessStepDefinition.formDefinition,
          inputs: addNameInput(harnessStepDefinition.formDefinition.inputs, 'name')
        }
      } else {
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        const inputs = (currentStepFormDefinition?.spec as any)?.spec?.inputs as ApiInputs

        const formInputs: IFormDefinition['inputs'] = Object.keys(inputs ?? {}).map(inputName => {
          return apiInput2IInputDefinition(inputName, inputs[inputName], 'template.with')
        })

        return { inputs: addNameInput(formInputs, 'name') }
      }
    }

    return { inputs: [] }
  }, [currentStepFormDefinition])

  const formRef = useRef<HTMLDivElement | null>(null)
  // NOTE: custom focus implementation to select first field in the form
  useEffect(() => {
    if (formRef.current && formDefinition.inputs.length > 0) {
      const firstEl = formRef.current?.querySelector(
        `input[name="${formDefinition.inputs[0].path}"]`
      ) as HTMLInputElement | null
      firstEl?.focus()
    }
  }, [formRef, formDefinition])

  const resolver = useZodValidationResolver(formDefinition, {
    validationConfig: {
      requiredMessage: 'Required input',
      requiredMessagePerInput: { [InputType.select]: 'Selection is required' }
    }
  })

  return (
    <RootForm
      defaultValues={defaultStepValues}
      resolver={resolver}
      mode="onSubmit"
      onSubmit={values => {
        const transformers = getTransformers(formDefinition)
        const stepValue = outputTransformValues(values, transformers)

        if (currentStepFormDefinition?.identifier === TEMPLATE_STEP_IDENTIFIER) {
          set(stepValue, 'template.uses', currentStepFormDefinition?.identifier)
        }

        if (addStepIntention) {
          requestYamlModifications.injectInArray({
            path: addStepIntention.path,
            position: addStepIntention.position,
            item: stepValue
          })
        } else if (editStepIntention) {
          requestYamlModifications.updateInArray({
            path: editStepIntention.path,
            item: stepValue
          })
        }

        requestClose()
      }}
      validateAfterFirstSubmit={true}>
      {rootForm => (
        <StepForm.Root>
          <StepForm.Header>
            {/* {<StepBreadcrumb title="Deploy to Dev" subTitle="Run" />} */}
            <StepForm.Title>
              {/* <Button
                className="px-2 mr-2"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setStepDrawerOpen(StepDrawer.Collection)
                }}>
                <Icon name="arrow-long" className="rotate-180" />
              </Button> */}
              {editStepIntention ? 'Edit' : 'Add'} Step
            </StepForm.Title>
            <StepForm.Description>{currentStepFormDefinition?.description}</StepForm.Description>
            {/* <StepForm.Actions>
              <AIButton label="AI Autofill" />
            </StepForm.Actions> */}
          </StepForm.Header>
          <StepFormSection.Root>
            <StepFormSection.Header>
              <StepFormSection.Title>General</StepFormSection.Title>
              {/* <StepFormSection.Description>Read documentation to learn more.</StepFormSection.Description> */}
            </StepFormSection.Header>
            <StepFormSection.Form>
              <RenderForm ref={formRef} className="space-y-4" factory={inputComponentFactory} inputs={formDefinition} />
            </StepFormSection.Form>
          </StepFormSection.Root>
          <StepForm.Footer>
            <div className="flex gap-x-3">
              <Button onClick={() => rootForm.submitForm()}>Submit</Button>
              <Button variant="secondary" onClick={requestClose}>
                Cancel
              </Button>
            </div>
            {editStepIntention && (
              <Button
                variant="secondary"
                onClick={() => {
                  requestYamlModifications.deleteInArray({ path: editStepIntention.path })
                  requestClose()
                }}>
                <Icon name="trash" />
              </Button>
            )}
          </StepForm.Footer>
        </StepForm.Root>
      )}
    </RootForm>
  )
}
