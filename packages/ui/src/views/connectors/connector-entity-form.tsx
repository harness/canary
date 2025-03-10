import { useMemo, useState } from 'react'

import { Button } from '@components/button'
import { EntityFormLayout } from '@views/unified-pipeline-studio/components/entity-form/entity-form-layout'
import { EntityFormSectionLayout } from '@views/unified-pipeline-studio/components/entity-form/entity-form-section-layout'
import { inputComponentFactory } from '@views/unified-pipeline-studio/components/form-inputs/factory/factory'
import { InputType } from '@views/unified-pipeline-studio/components/form-inputs/types'
import { addNameInput } from '@views/unified-pipeline-studio/utils/entity-form-utils'

import { IFormDefinition, RenderForm, RootForm, useZodValidationResolver } from '@harnessio/forms'

import { awsKmsConnectorPayloadBuilder } from './AwsKmsConnectorPayload'
import { getHarnessConnectorDefinition } from './connector-utils'
import { awsKmsConnectorPayloadConverter } from './harness-connectors/aws-kms-connector'
import {
  AWS_KMS_CONNECTOR_IDENTIFIER,
  ConnectorFormEntityType,
  ConnectorPayloadConverter,
  HARNESS_CONNECTOR_IDENTIFIER
} from './types'

// Registry of connector payload converters
const connectorPayloadConverters: Partial<Record<HARNESS_CONNECTOR_IDENTIFIER, ConnectorPayloadConverter>> = {
  [AWS_KMS_CONNECTOR_IDENTIFIER]: awsKmsConnectorPayloadConverter
}

interface ConnectorEntityFormProps {
  formEntity: ConnectorFormEntityType
  requestClose: () => void
}

export const ConnectorEntityForm = (props: ConnectorEntityFormProps): JSX.Element => {
  const { formEntity, requestClose } = props

  // Initialize form with converted payload if editing an existing connector
  const initialFormData = useMemo(() => {
    if (formEntity.data.payload) {
      const converter = connectorPayloadConverters[formEntity.data.identifier as HARNESS_CONNECTOR_IDENTIFIER]
      return converter ? converter.convertToFormData(formEntity.data.payload) : {}
    }
    return {}
  }, [formEntity.data])

  const [defaultConnectorValues, setDefaultConnectorValues] = useState(initialFormData)

  const formDefinition: IFormDefinition = useMemo(() => {
    const harnessConnectorDefinition = getHarnessConnectorDefinition(formEntity.data.identifier)
    if (harnessConnectorDefinition) {
      return {
        ...harnessConnectorDefinition.formDefinition,
        inputs: addNameInput(harnessConnectorDefinition.formDefinition.inputs, 'name')
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
        if (formEntity.data.identifier === AWS_KMS_CONNECTOR_IDENTIFIER) {
          const { connector } = awsKmsConnectorPayloadBuilder.buildPayload(values)
          console.log('AWS KMS payload:', connector)

          const converter = connectorPayloadConverters[formEntity.data.identifier as HARNESS_CONNECTOR_IDENTIFIER]
          console.log('converted to form: ', converter ? converter.convertToFormData(connector) : {})
          // TODO: Handle the AWS KMS payload
        }
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
