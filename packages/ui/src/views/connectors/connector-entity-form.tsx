import { ElementType, FC, Fragment, useEffect, useMemo, useState } from 'react'

import { Alert, Button, ButtonGroup, Drawer, EntityFormLayout } from '@/components'
import { TranslationStore } from '@/views'
import { addNameInput } from '@views/unified-pipeline-studio/utils/entity-form-utils'

import {
  getDefaultValuesFromFormDefinition,
  getTransformers,
  InputFactory,
  inputTransformValues,
  outputTransformValues,
  RenderForm,
  RootForm,
  unsetHiddenInputsValues,
  useZodValidationResolver
} from '@harnessio/forms'

import { AnyConnectorDefinition, ConnectorEntity, EntityIntent, onSubmitConnectorProps } from './types'

const componentsMap: Record<
  'true' | 'false',
  {
    Content: ElementType
    Header: ElementType
    Title: ElementType
    Body: ElementType
    Footer: ElementType
  }
> = {
  true: {
    Content: Fragment,
    Header: Drawer.Header,
    Title: Drawer.Title,
    Body: Drawer.Body,
    Footer: Drawer.Footer
  },
  false: {
    Content: 'div',
    Header: EntityFormLayout.Header,
    Title: EntityFormLayout.Title,
    Body: Fragment,
    Footer: EntityFormLayout.Footer
  }
}

interface ConnectorEntityFormProps {
  connector: ConnectorEntity
  onFormSubmit?: (values: onSubmitConnectorProps) => void
  getConnectorDefinition: (type: string) => AnyConnectorDefinition | undefined
  onBack?: () => void
  useTranslationStore: () => TranslationStore
  inputComponentFactory: InputFactory
  apiError?: string | null
  intent: EntityIntent
  isDrawer?: boolean
}

export const ConnectorEntityForm: FC<ConnectorEntityFormProps> = ({
  connector,
  apiError = null,
  onFormSubmit,
  getConnectorDefinition,
  onBack,
  useTranslationStore,
  inputComponentFactory,
  intent,
  isDrawer = false
}) => {
  const { t: _t } = useTranslationStore()
  const [connectorEditValues, setConnectorEditValues] = useState({})
  const { Content, Header, Title, Body, Footer } = componentsMap[isDrawer ? 'true' : 'false']
  const isCreate = intent === EntityIntent.CREATE

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

  const resolver = useZodValidationResolver(formDefinition)

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
        const definition = getConnectorDefinition(connector.type)
        const transformers = definition ? getTransformers(definition?.formDefinition) : undefined
        const transformedValues = transformers?.length ? outputTransformValues(values, transformers) : values
        const formattedValues = definition
          ? unsetHiddenInputsValues(definition.formDefinition, transformedValues)
          : transformedValues
        onSubmit({ values: formattedValues, connector, intent })
      }}
      validateAfterFirstSubmit={true}
    >
      {rootForm => (
        <Content>
          {isCreate && (
            <Header>
              <Title>Connect to {connector.name}</Title>
            </Header>
          )}
          <Body>
            <EntityFormLayout.Form>
              <RenderForm className="space-y-6" factory={inputComponentFactory} inputs={formDefinition} />
              {apiError && (
                <Alert.Root theme="danger">
                  <Alert.Description>{apiError.toString()}</Alert.Description>
                </Alert.Root>
              )}
            </EntityFormLayout.Form>
          </Body>
          <Footer>
            <ButtonGroup>
              {isCreate && !!onBack && (
                <Button variant="outline" onClick={() => onBack?.()}>
                  Back
                </Button>
              )}
              <Button onClick={() => rootForm.submitForm()}>{isCreate ? 'Submit' : 'Apply changes'}</Button>
            </ButtonGroup>
          </Footer>
        </Content>
      )}
    </RootForm>
  )
}
