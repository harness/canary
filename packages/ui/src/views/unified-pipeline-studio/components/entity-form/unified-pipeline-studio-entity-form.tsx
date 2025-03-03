import { useEffect, useMemo, useState } from 'react'

import { Button } from '@components/button'
import { Icon } from '@components/icon'
import { addNameInput } from '@views/unified-pipeline-studio/utils/entity-form-utils'
import { get } from 'lodash-es'
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
import { inputComponentFactory } from '../form-inputs/factory/factory'
import { InputType } from '../form-inputs/types'
import { getHarnessSteOrGroupIdentifier, getHarnessStepOrGroupDefinition, isHarnessGroup } from '../steps/harness-steps'
import { EntityFormLayout } from './entity-form-layout'
import { EntityFormSectionLayout } from './entity-form-section-layout'

interface UnifiedPipelineStudioEntityFormProps {
  requestClose: () => void
}

export const UnifiedPipelineStudioEntityForm = (props: UnifiedPipelineStudioEntityFormProps): JSX.Element => {
  const { requestClose } = props
  const { yamlRevision, addStepIntention, editStepIntention, requestYamlModifications, setFormEntity, formEntity } =
    useUnifiedPipelineStudioContext()

  const [defaultStepValues, setDefaultStepValues] = useState({})

  useEffect(() => {
    if (editStepIntention) {
      const yamlJson = parse(yamlRevision.yaml)
      const step = get(yamlJson, editStepIntention.path)

      const harnessStepIdentifier = getHarnessSteOrGroupIdentifier(step)

      // process harness step
      if (harnessStepIdentifier) {
        const stepDefinition = getHarnessStepOrGroupDefinition(harnessStepIdentifier)

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
      // TODO
      // else if (step[TEMPLATE_STEP_IDENTIFIER]) {
      //   setDefaultStepValues(step)
      //   listTemplates({ space_ref: spaceId || '', queryParams: { query: step.template.uses } }).then(response => {
      //     const editStep = response.body.find(plugin => plugin.identifier === step.template.uses)
      //     setFormStep(editStep ? { stepSource: StepSource.Templates, data: editStep } : null)
      //   })
      // } else if (step[GROUP_IDENTIFIER] || step[PARALLEL_IDENTIFIER]) {
      //   setDefaultStepValues(step)
      //   setFormStep({
      //     stepSource: StepSource.Harness,
      //     data: {
      //       identifier: step[GROUP_IDENTIFIER] ? GROUP_IDENTIFIER : PARALLEL_IDENTIFIER
      //     }
      //   })
      // }
    }
  }, [editStepIntention])

  const formDefinition: IFormDefinition = useMemo(() => {
    if (formEntity?.source === 'embedded') {
      const harnessStepDefinition = getHarnessStepOrGroupDefinition(formEntity.data.identifier)
      if (harnessStepDefinition) {
        return {
          ...harnessStepDefinition.formDefinition,
          inputs: addNameInput(harnessStepDefinition.formDefinition.inputs, 'name')
        }
      }
    } else if (formEntity?.source === 'external') {
      // TODO
      // const stepData = JSON.parse(formStep?.data?.data ?? '{}') as StepDefinitionType
      // const inputs = stepData.template.inputs
      // const formInputs: IFormDefinition['inputs'] = Object.keys(inputs).map(inputName => {
      //   return apiInput2IInputDefinition(inputName, inputs[inputName], 'template.with')
      // })
      // return { inputs: addNameInput(formInputs, 'name') }
    }

    return { inputs: [] }
  }, [formEntity])

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
        const stepValue = outputTransformValues(values, transformers)

        // TODO: "external"
        // if (formStep?.stepSource === StepSource.Templates) {
        //   // NOTE: add 'uses' for template step
        //   stepValue = {
        //     ...stepValue,
        //     template: {
        //       uses: formStep?.data.identifier,
        //       ...stepValue.template
        //     }
        //   }
        // }

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
            <EntityFormLayout.Title>{editStepIntention ? 'Edit' : 'Add'} Step</EntityFormLayout.Title>
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
              <RenderForm className="space-y-4" factory={inputComponentFactory} inputs={formDefinition} />
            </EntityFormSectionLayout.Form>
          </EntityFormSectionLayout.Root>
          <EntityFormLayout.Footer>
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
          </EntityFormLayout.Footer>
        </EntityFormLayout.Root>
      )}
    </RootForm>
  )
}
