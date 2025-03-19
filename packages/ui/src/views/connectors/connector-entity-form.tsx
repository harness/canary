import { useMemo } from 'react'

import { TranslationStore } from '@/views'
import { Button } from '@components/button'
import { Icon } from '@components/icon'
import { EntityFormLayout } from '@views/unified-pipeline-studio/components/entity-form/entity-form-layout'
import { EntityFormSectionLayout } from '@views/unified-pipeline-studio/components/entity-form/entity-form-section-layout'
import { inputComponentFactory } from '@views/unified-pipeline-studio/components/form-inputs/factory/factory'
import { InputType } from '@views/unified-pipeline-studio/components/form-inputs/types'
import { addNameInput } from '@views/unified-pipeline-studio/utils/entity-form-utils'

import { getDefaultValuesFromFormDefinition, RenderForm, RootForm, useZodValidationResolver } from '@harnessio/forms'

import { AnyConnectorDefinition, ConnectorFormEntityType, ConnectorRightDrawer, onSubmitProps } from './types'

interface ConnectorEntityFormProps {
  formEntity: ConnectorFormEntityType
  requestClose: () => void
  onFormSubmit?: (values: onSubmitProps) => void
  getConnectorDefinition: (type: string) => AnyConnectorDefinition | undefined
  setRightDrawer: (value: ConnectorRightDrawer) => void
  useTranslationStore: () => TranslationStore
  openSecretDrawer?: () => void
}

export const ConnectorEntityForm = (props: ConnectorEntityFormProps): JSX.Element => {
  const {
    formEntity,
    requestClose,
    onFormSubmit,
    getConnectorDefinition,
    setRightDrawer,
    useTranslationStore,
    openSecretDrawer
  } = props
  const { t: _t } = useTranslationStore()

  const onSubmit = (data: onSubmitProps) => {
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

      if (openSecretDrawer) {
        formDef.inputs = formDef.inputs.map(input => {
          if (input.inputType === InputType.secretSelect) {
            return {
              ...input,
              onSecretClick: openSecretDrawer?.()
            }
          }
          return input
        })
      }

      return formDef
    }
    return { inputs: [] }
  }, [formEntity.data.type, getConnectorDefinition, openSecretDrawer])

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
              <EntityFormSectionLayout.Title className="!my-0">
                Connect to {formEntity.data.name}
              </EntityFormSectionLayout.Title>
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
            <div className="absolute inset-x-0 bottom-0 flex justify-between gap-x-3 bg-background-2 p-4 shadow-md">
              <Button variant="secondary" onClick={requestClose}>
                Cancel
              </Button>
              <Button onClick={() => rootForm.submitForm()}>Submit</Button>
            </div>
          </EntityFormLayout.Footer>
        </EntityFormLayout.Root>
      )}
    </RootForm>
  )
}
