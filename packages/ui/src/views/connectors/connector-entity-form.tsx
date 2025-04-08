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
  autoExpandGroup?: boolean
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
    intent,
    autoExpandGroup
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
  }, [intent, connector.name, connector.spec, connector.type, getConnectorDefinition])

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
              <EntityFormSectionLayout.Header className="!px-0">
                <EntityFormSectionLayout.Title className="!my-0">
                  Connect to {connector.name}
                </EntityFormSectionLayout.Title>
              </EntityFormSectionLayout.Header>
            )}
            <EntityFormSectionLayout.Form className="!px-0">
              <RenderForm
                className="space-y-4 max-w-xl"
                factory={inputComponentFactory}
                inputs={formDefinition}
                autoExpandGroup={!!autoExpandGroup}
              />
              {apiError && (
                <Alert.Container variant="destructive" className="my-8">
                  <Alert.Description>{apiError.toString()}</Alert.Description>
                </Alert.Container>
              )}
            </EntityFormSectionLayout.Form>
          </EntityFormSectionLayout.Root>
          <EntityFormLayout.Footer className="border-none">
            <div className="absolute inset-x-0 bottom-0 flex justify-between gap-x-3 bg-cn-background-2 p-4 shadow-md">
              {intent === EntityIntent.CREATE && (
                <Button variant="secondary" onClick={() => onBack?.()}>
                  Back
                </Button>
              )}
              <Button onClick={() => rootForm.submitForm()}>
                {intent === EntityIntent.CREATE ? 'Submit' : 'Apply changes'}
              </Button>
            </div>
          </EntityFormLayout.Footer>
        </EntityFormLayout.Root>
      )}
    </RootForm>
  )
}
