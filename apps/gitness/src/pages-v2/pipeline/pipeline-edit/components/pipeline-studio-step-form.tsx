import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { get } from 'lodash-es'
import { parse } from 'yaml'

import { listTemplates } from '@harnessio/code-service-client'
import {
  getTransformers,
  IFormDefinition,
  inputTransformValues,
  outputTransformValues,
  RenderForm,
  RootForm,
  useZodValidationResolver
} from '@harnessio/forms'
import { Button, Icon } from '@harnessio/ui/components'
import {
  getHarnessStepDefinition,
  getHarnessStepIdentifier,
  GROUP_IDENTIFIER,
  inputComponentFactory,
  InputType,
  PARALLEL_IDENTIFIER,
  StepForm,
  StepFormSection,
  TEMPLATE_STEP_IDENTIFIER
} from '@harnessio/views'

import { PathParams } from '../../../../RouteDefinitions'
import { StepSource } from '../context/data-store/types'
import { usePipelineDataContext } from '../context/PipelineStudioDataProvider'
import { StepDefinitionType } from '../types/api-types'
import { addNameInput, apiInput2IInputDefinition } from '../utils/step-form-utils'

interface PipelineStudioStepFormProps {
  requestClose: () => void
}

export const PipelineStudioStepForm = (props: PipelineStudioStepFormProps): JSX.Element => {
  const { requestClose } = props
  const {
    state: { yamlRevision, formStep, addStepIntention, editStepIntention },
    requestYamlModifications,
    setFormStep
  } = usePipelineDataContext()
  const { spaceId } = useParams<PathParams>()

  const [defaultStepValues, setDefaultStepValues] = useState({})

  useEffect(() => {
    if (editStepIntention) {
      const yamlJson = parse(yamlRevision.yaml)
      const step = get(yamlJson, editStepIntention.path)

      const harnessStepIdentifier = getHarnessStepIdentifier(step)

      // process harness step
      if (harnessStepIdentifier) {
        const stepDefinition = getHarnessStepDefinition(harnessStepIdentifier)
        if (stepDefinition) {
          const transformers = getTransformers(stepDefinition?.formDefinition ?? { inputs: [] })
          const stepValue = inputTransformValues(step, transformers)
          setDefaultStepValues(stepValue)
          setFormStep({
            stepSource: StepSource.Harness,
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
        listTemplates({ space_ref: spaceId || '', queryParams: { query: step.template.uses } }).then(response => {
          const editStep = response.body.find(plugin => plugin.identifier === step.template.uses)
          setFormStep(editStep ? { stepSource: StepSource.Templates, data: editStep } : null)
        })
      } else if (step[GROUP_IDENTIFIER] || step[PARALLEL_IDENTIFIER]) {
        setDefaultStepValues(step)
        setFormStep({
          stepSource: StepSource.Harness,
          data: {
            identifier: step[GROUP_IDENTIFIER] ? GROUP_IDENTIFIER : PARALLEL_IDENTIFIER
          }
        })
      }
    }
  }, [editStepIntention])

  const formDefinition: IFormDefinition = useMemo(() => {
    if (formStep?.stepSource === StepSource.Harness) {
      const harnessStepDefinition = getHarnessStepDefinition(formStep.data.identifier)
      if (harnessStepDefinition) {
        return {
          ...harnessStepDefinition.formDefinition,
          inputs: addNameInput(harnessStepDefinition.formDefinition.inputs, 'name')
        }
      }
    } else if (formStep?.stepSource === StepSource.Templates) {
      const stepData = JSON.parse(formStep?.data?.data ?? '{}') as StepDefinitionType
      const inputs = stepData.template.inputs

      const formInputs: IFormDefinition['inputs'] = Object.keys(inputs).map(inputName => {
        return apiInput2IInputDefinition(inputName, inputs[inputName], 'template.with')
      })

      return { inputs: addNameInput(formInputs, 'name') }
    }

    return { inputs: [] }
  }, [formStep])

  const resolver = useZodValidationResolver(formDefinition, {
    validationConfig: {
      requiredMessage: 'Required input',
      requiredMessagePerInput: { [InputType.select]: 'Selection is required' }
    }
  })

  return (
    <RootForm
      autoFocusPath={formDefinition.inputs[0]?.path}
      defaultValues={defaultStepValues}
      resolver={resolver}
      mode="onSubmit"
      onSubmit={values => {
        const transformers = getTransformers(formDefinition)
        let stepValue = outputTransformValues(values, transformers)

        if (formStep?.stepSource === StepSource.Templates) {
          // NOTE: add 'uses' for template step
          stepValue = {
            ...stepValue,
            template: {
              uses: formStep?.data.identifier,
              ...stepValue.template
            }
          }
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
      validateAfterFirstSubmit={true}
    >
      {rootForm => (
        <StepForm.Root>
          <StepForm.Header>
            <StepForm.Title>{editStepIntention ? 'Edit' : 'Add'} Step</StepForm.Title>
            <StepForm.Description>{formStep?.data.description}</StepForm.Description>
            {/* <StepForm.Actions>
              <AIButton label="AI Autofill" />
            </StepForm.Actions> */}
          </StepForm.Header>
          <StepFormSection.Root>
            {/* <StepFormSection.Header> */}
            {/* <StepFormSection.Title>General</StepFormSection.Title> */}
            {/* <StepFormSection.Description>Read documentation to learn more.</StepFormSection.Description> */}
            {/* </StepFormSection.Header> */}
            <StepFormSection.Form>
              <RenderForm className="space-y-4" factory={inputComponentFactory} inputs={formDefinition} />
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
                }}
              >
                <Icon name="trash" />
              </Button>
            )}
          </StepForm.Footer>
        </StepForm.Root>
      )}
    </RootForm>
  )
}
