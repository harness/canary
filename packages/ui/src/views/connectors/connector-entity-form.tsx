import { useMemo } from 'react'

import { Button } from '@components/button'
import { Icon } from '@components/icon'
import { EntityFormLayout } from '@views/unified-pipeline-studio/components/entity-form/entity-form-layout'
import { EntityFormSectionLayout } from '@views/unified-pipeline-studio/components/entity-form/entity-form-section-layout'
import { inputComponentFactory } from '@views/unified-pipeline-studio/components/form-inputs/factory/factory'
import { InputType } from '@views/unified-pipeline-studio/components/form-inputs/types'
import { addNameInput } from '@views/unified-pipeline-studio/utils/entity-form-utils'

import {
  getDefaultValuesFromFormDefinition,
  IFormDefinition,
  RenderForm,
  RootForm,
  useZodValidationResolver
} from '@harnessio/forms'

import { AnyConnectorDefinition, ConnectorFormEntityType, ConnectorRightDrawer } from './types'

interface ConnectorEntityFormProps {
  formEntity: ConnectorFormEntityType
  requestClose: () => void
  onFormSubmit?: (values: any) => void // TODO: TYPE this properly
  getConnectorDefinition: (identifier: string) => AnyConnectorDefinition | undefined
  setRightDrawer: (value: ConnectorRightDrawer) => void
}

export const ConnectorEntityForm = (props: ConnectorEntityFormProps): JSX.Element => {
  const { formEntity, requestClose, onFormSubmit, getConnectorDefinition, setRightDrawer } = props
  // TODO: type this properly , Handle form submit for create/edit
  const onSubmit = (data: any) => {
    onFormSubmit?.(data)
  }
  const defaultConnectorValues = useMemo(() => {
    const connectorDefinition = getConnectorDefinition(formEntity.data.identifier)
    if (!connectorDefinition) return {}
    console.log(getDefaultValuesFromFormDefinition(connectorDefinition.formDefinition))
    return getDefaultValuesFromFormDefinition(connectorDefinition.formDefinition)
  }, [formEntity.data.identifier, getConnectorDefinition])

  const formDefinition: IFormDefinition = useMemo(() => {
    const connectorDefinition = getConnectorDefinition(formEntity.data.identifier)
    if (connectorDefinition) {
      return {
        ...connectorDefinition.formDefinition,
        inputs: addNameInput(connectorDefinition.formDefinition.inputs, 'name')
      }
    }
    return { inputs: [] }
  }, [])

  const resolver = useZodValidationResolver(formDefinition, {
    validationConfig: {
      requiredMessage: 'Required input',
      requiredMessagePerInput: { [InputType.select]: 'Selection is required' }
    }
  })

  return (
    <RootForm
      autoFocusPath={formDefinition.inputs[0]?.path}
      defaultValues={defaultConnectorValues}
      resolver={resolver}
      mode="onSubmit"
      onSubmit={values => {
        onSubmit({ values, formEntity })
      }}
      validateAfterFirstSubmit={true}
    >
      {rootForm => (
        <EntityFormLayout.Root>
          <EntityFormSectionLayout.Root>
            <EntityFormSectionLayout.Header>
              Connect to {formEntity.data.name}
              <div className="pt-2">
                <Button variant="ghost" onClick={() => setRightDrawer(ConnectorRightDrawer.Collection)}>
                  <Icon name="arrow-long" className="rotate-180" size={12} />
                  <span>Back</span>
                </Button>
              </div>
            </EntityFormSectionLayout.Header>
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
          </EntityFormLayout.Footer>
        </EntityFormLayout.Root>
      )}
    </RootForm>
  )
}
