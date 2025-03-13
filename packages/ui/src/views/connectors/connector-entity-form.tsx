import { useMemo, useState } from 'react'

import { Button } from '@components/button'
import { EntityFormLayout } from '@views/unified-pipeline-studio/components/entity-form/entity-form-layout'
import { EntityFormSectionLayout } from '@views/unified-pipeline-studio/components/entity-form/entity-form-section-layout'
import { inputComponentFactory } from '@views/unified-pipeline-studio/components/form-inputs/factory/factory'
import { InputType } from '@views/unified-pipeline-studio/components/form-inputs/types'
import { addNameInput } from '@views/unified-pipeline-studio/utils/entity-form-utils'

import { IFormDefinition, RenderForm, RootForm, useZodValidationResolver } from '@harnessio/forms'

import { getHarnessConnectorDefinition } from './connector-utils'
import { AnyConnectorDefinition, ConnectorFormEntityType } from './types'

interface ConnectorEntityFormProps {
  formEntity: ConnectorFormEntityType
  requestClose: () => void
  onFormSubmit?: (values: any) => void // TODO: TYPE this properly
  getConnectorDefinition: (identifier: string) => AnyConnectorDefinition | undefined
}

export const ConnectorEntityForm = (props: ConnectorEntityFormProps): JSX.Element => {
  const { formEntity, requestClose, onFormSubmit, getConnectorDefinition } = props
  // TODO: type this properly , Handle form submit for create/edit
  const onSubmit = (data: any) => {
    onFormSubmit?.(data)
  }

  const [defaultConnectorValues, setDefaultConnectorValues] = useState({})

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
        // TODO: handle form submit for create/edit
        console.log('values', values)
        onSubmit(values)
        // TODO: hande form submit for create/edit
        // if (formEntity.data.identifier === AWS_KMS_CONNECTOR_IDENTIFIER) {
        //   const { connector: payload } = awsKmsBuilder.buildPayload(values)
        //   console.log('AWS KMS payload:', payload)
        //   const converter = connectorPayloadConverters[formEntity.data.identifier as HARNESS_CONNECTOR_IDENTIFIER]
        //   console.log('converted to form: ', converter ? converter.convertToFormData(payload) : {})
        //   // TODO: Handle the AWS KMS payload

        // }
      }}
      validateAfterFirstSubmit={true}
    >
      {rootForm => (
        <EntityFormLayout.Root>
          <EntityFormLayout.Header>
            <EntityFormLayout.Title>Add Connector</EntityFormLayout.Title>
            <EntityFormLayout.Description>{formEntity?.data.description}</EntityFormLayout.Description>
          </EntityFormLayout.Header>
          <EntityFormSectionLayout.Root>
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
