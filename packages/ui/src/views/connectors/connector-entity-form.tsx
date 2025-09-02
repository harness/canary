import { ElementType, FC, Fragment, useEffect, useMemo, useState } from 'react'

import { Alert, Button, ButtonLayout, Drawer, EntityFormLayout } from '@/components'
import { useTranslation } from '@/context'
import { addNameInput } from '@views/unified-pipeline-studio/utils/entity-form-utils'

import {
  getDefaultValuesFromFormDefinition,
  getTransformers,
  InputFactory,
  inputTransformValues,
  outputTransformValues,
  removeTemporaryFieldsValue,
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
  isLoading?: boolean
  onFormSubmit?: (values: onSubmitConnectorProps) => void
  getConnectorDefinition: (type: string) => AnyConnectorDefinition | undefined
  onBack?: () => void
  inputComponentFactory: InputFactory
  apiError?: string | null
  intent: EntityIntent
  isDrawer?: boolean
}

export const ConnectorEntityForm: FC<ConnectorEntityFormProps> = ({
  connector,
  apiError = null,
  isLoading = false,
  onFormSubmit,
  getConnectorDefinition,
  onBack,
  inputComponentFactory,
  intent,
  isDrawer = false
}) => {
  const { t: _t } = useTranslation()
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
        inputs: addNameInput(connectorDefinition.formDefinition.inputs, 'connectorMeta.name', {
          required: true,
          inputConfig: {
            allowedValueTypes: ['fixed']
          }
        })
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
            connectorMeta: {
              name: connector.name,
              type: connector.type,
              ...(connector?.description && { description: connector?.description }),
              ...(connector?.tags && { tags: connector?.tags })
            }
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
        const unsetValues = definition?.formDefinition
          ? unsetHiddenInputsValues(definition.formDefinition, values)
          : values
        const transformers = definition?.formDefinition ? getTransformers(definition.formDefinition) : []
        const transformedValues = transformers.length ? outputTransformValues(unsetValues, transformers) : unsetValues
        const formattedValues = removeTemporaryFieldsValue(transformedValues)
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
            <ButtonLayout.Root>
              {isCreate && !!onBack && (
                <ButtonLayout.Secondary>
                  <Button variant="outline" onClick={onBack}>
                    Back
                  </Button>
                </ButtonLayout.Secondary>
              )}
              <ButtonLayout.Primary>
                <Button loading={isLoading} onClick={() => rootForm.submitForm()}>
                  {isCreate ? 'Submit' : 'Apply changes'}
                </Button>
              </ButtonLayout.Primary>
            </ButtonLayout.Root>
          </Footer>
        </Content>
      )}
    </RootForm>
  )
}
