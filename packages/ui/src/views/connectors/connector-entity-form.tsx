import { useEffect, useMemo, useState } from 'react'

import { TranslationStore } from '@/views'
import { Alert } from '@components/alert'
import { Button } from '@components/button'
import { EntityFormLayout } from '@views/unified-pipeline-studio/components/entity-form/entity-form-layout'
import { EntityFormSectionLayout } from '@views/unified-pipeline-studio/components/entity-form/entity-form-section-layout'
import { addNameInput } from '@views/unified-pipeline-studio/utils/entity-form-utils'

import {
  getDefaultValuesFromFormDefinition,
  getTransformers,
  InputFactory,
  inputTransformValues,
  RenderForm,
  RootForm,
  useZodValidationResolver
} from '@harnessio/forms'

import { AnyConnectorDefinition, ConnectorEntity, EntityIntent, onSubmitConnectorProps } from './types'

interface ConnectorEntityFormProps {
  connector: ConnectorEntity
  onFormSubmit?: (values: onSubmitConnectorProps) => void
  getConnectorDefinition: (type: string) => AnyConnectorDefinition | undefined
  onBack?: () => void
  useTranslationStore: () => TranslationStore
  inputComponentFactory: InputFactory
  apiError?: string | null
  intent: EntityIntent
}

export const ConnectorEntityForm = (props: ConnectorEntityFormProps): JSX.Element => {
  const {
    connector,
    apiError = null,
    onFormSubmit,
    getConnectorDefinition,
    onBack,
    useTranslationStore,
    inputComponentFactory,
    intent
  } = props
  const { t: _t } = useTranslationStore()
  const [connectorEditValues, setConnectorEditValues] = useState({})

  const onSubmit = (data: onSubmitConnectorProps) => {
    onFormSubmit?.(data)
  }
  const defaultConnectorValues = useMemo(() => {
    const connectorDefinition = getConnectorDefinition(connector.type)
    if (!connectorDefinition) return {}
    return getDefaultValuesFromFormDefinition(connectorDefinition.formDefinition)
  }, [connector.type, getConnectorDefinition])

  const formDefinition = useMemo(() => {
    const connectorDefinition = getConnectorDefinition(connector.type)
    if (connectorDefinition) {
      const formDef = {
        ...connectorDefinition.formDefinition,
        inputs: addNameInput(connectorDefinition.formDefinition.inputs, 'name')
      }

      formDef.inputs = formDef.inputs.map(input => {
        if (input.inputType === 'secretSelect') {
          return {
            ...input
          }
        }
        return input
      })

      return formDef
    }
    return { inputs: [] }
  }, [connector.type, getConnectorDefinition])

  const resolver = useZodValidationResolver(formDefinition, {
    validationConfig: {
      requiredMessage: 'Required input',
      requiredMessagePerInput: { ['select']: 'Selection is required' }
    }
  })

  useEffect(() => {
    if (intent === EntityIntent.EDIT && connector?.spec) {
      const definition = getConnectorDefinition(connector.type)
      if (definition) {
        const transformers = getTransformers(definition?.formDefinition)
        const connectorValues = inputTransformValues(
          {
            ...connector?.spec,
            name: connector.name,
            type: connector.type,
            ...(connector?.description && { description: connector?.description }),
            ...(connector?.tags && { tags: connector?.tags })
          },
          transformers
        )
        setConnectorEditValues(connectorValues)
      }
    }
  }, [
    intent,
    connector.name,
    connector?.spec,
    connector.type,
    getConnectorDefinition,
    connector?.description,
    connector?.tags
  ])

  return (
    <RootForm
      autoFocusPath={formDefinition.inputs[0]?.path}
      defaultValues={intent === EntityIntent.CREATE ? defaultConnectorValues : connectorEditValues}
      resolver={resolver}
      mode="onSubmit"
      onSubmit={values => {
        onSubmit({ values, connector, intent })
      }}
      validateAfterFirstSubmit={true}
    >
      {rootForm => (
        <EntityFormLayout.Root>
          <EntityFormSectionLayout.Root>
            {intent === EntityIntent.CREATE && (
              <EntityFormSectionLayout.Header className="px-0">
                <EntityFormSectionLayout.Title className="!my-0">
                  Connect to {connector.name}
                </EntityFormSectionLayout.Title>
              </EntityFormSectionLayout.Header>
            )}
            <EntityFormSectionLayout.Form className="px-0">
              <RenderForm className="space-y-4 max-w-xl" factory={inputComponentFactory} inputs={formDefinition} />
              {apiError && (
                <Alert.Container variant="destructive" className="my-8">
                  <Alert.Description>{apiError.toString()}</Alert.Description>
                </Alert.Container>
              )}
            </EntityFormSectionLayout.Form>
          </EntityFormSectionLayout.Root>
          {intent === EntityIntent.CREATE ? (
            <EntityFormLayout.Footer className="border-none">
              <div className="bg-cn-background-2 absolute inset-x-0 bottom-0 flex justify-between gap-x-3 p-4 shadow-md">
                <Button variant="secondary" onClick={() => onBack?.()}>
                  Back
                </Button>
                <Button onClick={() => rootForm.submitForm()}>Submit</Button>
              </div>
            </EntityFormLayout.Footer>
          ) : (
            <div className="border-cn-borders-3 mt-5 flex flex-row justify-end border-t pt-5">
              <Button onClick={() => rootForm.submitForm()}>Apply changes</Button>
            </div>
          )}
        </EntityFormLayout.Root>
      )}
    </RootForm>
  )
}
