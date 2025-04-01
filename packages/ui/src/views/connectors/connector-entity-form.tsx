import { useMemo } from 'react'

import { SecretItem, TranslationStore } from '@/views'
import { Alert } from '@components/alert'
import { Button } from '@components/button'
import { EntityFormLayout } from '@views/unified-pipeline-studio/components/entity-form/entity-form-layout'
import { EntityFormSectionLayout } from '@views/unified-pipeline-studio/components/entity-form/entity-form-section-layout'
import { addNameInput } from '@views/unified-pipeline-studio/utils/entity-form-utils'

import {
  getDefaultValuesFromFormDefinition,
  InputFactory,
  RenderForm,
  RootForm,
  useZodValidationResolver
} from '@harnessio/forms'

import { AnyConnectorDefinition, ConnectorFormEntityType, onSubmitConnectorProps } from './types'

interface ConnectorEntityFormProps {
  formEntity: ConnectorFormEntityType
  requestClose: () => void
  onFormSubmit?: (values: onSubmitConnectorProps) => void
  getConnectorDefinition: (type: string) => AnyConnectorDefinition | undefined
  onBack: () => void
  useTranslationStore: () => TranslationStore
  inputComponentFactory: InputFactory
  openSecretDrawer?: () => void
  apiError?: string | null
  selectedSecret?: SecretItem
}

export const ConnectorEntityForm = (props: ConnectorEntityFormProps): JSX.Element => {
  const {
    formEntity,
    apiError = null,
    onFormSubmit,
    getConnectorDefinition,
    onBack,
    useTranslationStore,
    openSecretDrawer,
    selectedSecret,
    inputComponentFactory
  } = props
  const { t: _t } = useTranslationStore()

  const onSubmit = (data: onSubmitConnectorProps) => {
    onFormSubmit?.(data)
  }
  const defaultConnectorValues = useMemo(() => {
    const connectorDefinition = getConnectorDefinition(formEntity.data.type)
    if (!connectorDefinition) return {}
    return getDefaultValuesFromFormDefinition(connectorDefinition.formDefinition)
  }, [formEntity.data.type, getConnectorDefinition])

  const formDefinition = useMemo(() => {
    const connectorDefinition = getConnectorDefinition(formEntity.data.type)
    if (connectorDefinition) {
      const formDef = {
        ...connectorDefinition.formDefinition,
        inputs: addNameInput(connectorDefinition.formDefinition.inputs, 'name')
      }

      formDef.inputs = formDef.inputs.map(input => {
        if (input.inputType === 'secretSelect') {
          return {
            ...input
            // ...(openSecretDrawer && { onSecretClick: openSecretDrawer }),
            // ...(selectedSecret && { selectedSecretData: selectedSecret })
          }
        }
        return input
      })

      return formDef
    }
    return { inputs: [] }
  }, [formEntity.data.type, getConnectorDefinition, openSecretDrawer, selectedSecret])

  const resolver = useZodValidationResolver(formDefinition, {
    validationConfig: {
      requiredMessage: 'Required input',
      requiredMessagePerInput: { ['select']: 'Selection is required' }
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
              <EntityFormSectionLayout.Title className="!my-0">
                Connect to {formEntity.data.name}
              </EntityFormSectionLayout.Title>
            </EntityFormSectionLayout.Header>
            <EntityFormSectionLayout.Form>
              <RenderForm className="space-y-4" factory={inputComponentFactory} inputs={formDefinition} />
              {apiError && (
                <Alert.Container variant="destructive" className="my-8">
                  <Alert.Description>{apiError.toString()}</Alert.Description>
                </Alert.Container>
              )}
            </EntityFormSectionLayout.Form>
          </EntityFormSectionLayout.Root>
          <EntityFormLayout.Footer>
            <div className="absolute inset-x-0 bottom-0 flex justify-between gap-x-3 bg-background-2 p-4 shadow-md">
              <Button variant="secondary" onClick={onBack}>
                Back
              </Button>
              <Button onClick={() => rootForm.submitForm()}>Submit</Button>
            </div>
          </EntityFormLayout.Footer>
        </EntityFormLayout.Root>
      )}
    </RootForm>
  )
}
