import { useEffect, useMemo, useRef, useState } from 'react'
import { parse } from 'yaml'
import { get, set } from 'lodash-es'
import { Button } from '@harnessio/canary'
import {
  IFormDefinition,
  RenderForm,
  RootForm,
  getTransformers,
  inputTransformValues,
  outputTransformValues
} from '@harnessio/forms'
import { Icon } from '@harnessio/canary'
import { ListPluginsOkResponse, useListPluginsQuery } from '@harnessio/code-service-client'
import {
  StepForm,
  StepFormSection,
  inputComponentFactory,
  runStepFormDefinition,
  RUN_STEP_DESCRIPTION,
  RUN_STEP_IDENTIFIER
} from '@harnessio/playground'
import { usePipelineDataContext } from '../context/PipelineStudioDataProvider'
import { ApiInputs, addNameInput, apiInput2IInputDefinition } from '../utils/step-form-utils'

interface PipelineStudioStepFormProps {
  requestClose: () => void
}

export const PipelineStudioStepForm = (props: PipelineStudioStepFormProps): JSX.Element => {
  const { requestClose } = props
  const {
    yamlRevision,
    requestYamlModifications,
    currentStepFormDefinition,
    addStepIntention,
    editStepIntention,
    setCurrentStepFormDefinition
  } = usePipelineDataContext()

  const [defaultStepValues, setDefaultStepValues] = useState({})

  // TODO: only 100 items
  const { data: pluginsResponseRaw } = useListPluginsQuery(
    { queryParams: { limit: 100, page: 1 } },
    { enabled: !!editStepIntention }
  )
  // TODO: response type
  const pluginsResponse = useMemo(
    () => (pluginsResponseRaw as unknown as { content: ListPluginsOkResponse | undefined })?.content,
    [pluginsResponseRaw]
  )
  // TODO
  const plugins = useMemo(() => {
    // TODO: Do not parse all plugins in advance  - check if its not needed (wrap inside try...catch)
    // TODO: duplicated code

    return pluginsResponse?.map(d => ({ ...d, spec: JSON.parse(d.spec ?? '') })) ?? []
  }, [pluginsResponse])

  useEffect(() => {
    if (editStepIntention && plugins) {
      const yamlJson = parse(yamlRevision.yaml)
      const step = get(yamlJson, editStepIntention.path)

      // TODO: abstract this
      if (step[RUN_STEP_IDENTIFIER]) {
        // transform step value for form value
        const transformers = getTransformers(runStepFormDefinition)

        const stepValue = inputTransformValues(step, transformers)
        setDefaultStepValues(stepValue)

        setCurrentStepFormDefinition({
          identifier: RUN_STEP_IDENTIFIER,
          description: RUN_STEP_DESCRIPTION,
          type: 'step'
        })
      } else {
        setDefaultStepValues(step)
        const editStep = plugins.find(plugin => plugin.identifier === step?.spec?.name)
        setCurrentStepFormDefinition(editStep ?? null)
      }
    }
  }, [editStepIntention, plugins])

  // const title = currentStepFormDefinition?.identifier
  // const description = currentStepFormDefinition?.description

  let formDefinition: IFormDefinition = { inputs: [] }

  if (currentStepFormDefinition?.identifier) {
    // TODO: abstract this
    if (currentStepFormDefinition?.identifier === RUN_STEP_IDENTIFIER) {
      formDefinition = runStepFormDefinition
    } else {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      const inputs = (currentStepFormDefinition?.spec as any)?.spec?.inputs as ApiInputs

      const formInputs: IFormDefinition['inputs'] = Object.keys(inputs ?? {}).map(inputName => {
        return apiInput2IInputDefinition(inputName, inputs[inputName], 'spec.inputs')
      })

      formDefinition = { inputs: addNameInput(formInputs, 'name') }
    }
  }

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

  return (
    <RootForm
      defaultValues={defaultStepValues}
      // resolver={useZodValidationResolver(formDefinition)}
      resolver={data => ({
        values: data,
        errors: {}
      })}
      mode="onSubmit"
      onSubmit={values => {
        let stepValue = values
        // TODO: abstract this
        if (currentStepFormDefinition?.identifier !== RUN_STEP_IDENTIFIER) {
          set(stepValue, 'type', 'plugin')
          set(stepValue, 'spec.name', currentStepFormDefinition?.identifier)
        } else {
          const transformers = getTransformers(runStepFormDefinition)
          stepValue = outputTransformValues(values, transformers)
        }

        if (addStepIntention) {
          requestYamlModifications.injectInArray({
            path: addStepIntention?.path,
            position: addStepIntention?.position,
            item: stepValue
          })
        } else if (editStepIntention) {
          requestYamlModifications.updateInArray({
            path: editStepIntention?.path,
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
              Run Step
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
