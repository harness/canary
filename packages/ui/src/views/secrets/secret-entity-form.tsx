import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

import { Alert, Button, ButtonLayout } from '@/components'
import { useTranslation } from '@/context'
import { EntityIntent, SecretListItem } from '@/views'

import {
  getDefaultValuesFromFormDefinition,
  IFormDefinition,
  InputFactory,
  RenderForm,
  RootForm,
  useZodValidationResolver
} from '@harnessio/forms'

import { onSubmitSecretProps } from './types'

export type SecretEntityFormHandle = {
  submitForm: () => void
}

interface SecretWrapper extends SecretListItem {
  secretManagerRef?: any
}

interface SecretEntityFormProps {
  onFormSubmit?: (values: onSubmitSecretProps) => void
  initialSecretValues?: SecretWrapper
  secretsFormDefinition?: IFormDefinition
  onBack?: () => void
  inputComponentFactory: InputFactory
  apiError?: string | null
  intent: EntityIntent
  isDrawer?: boolean
}

export const SecretEntityForm = forwardRef<SecretEntityFormHandle, SecretEntityFormProps>(
  (
    {
      apiError = null,
      onFormSubmit,
      secretsFormDefinition,
      onBack,
      inputComponentFactory,
      intent,
      isDrawer = false,
      initialSecretValues
    },
    ref
  ) => {
    const { t: _t } = useTranslation()
    const formRef = useRef<SecretEntityFormHandle | null>(null)
    const [secretEditValues, setSecretEditValues] = useState({})

    useImperativeHandle(ref, () => ({
      submitForm: () => formRef.current?.submitForm?.()
    }))

    const onSubmit = (data: onSubmitSecretProps) => {
      onFormSubmit?.(data)
    }

    const resolver = useZodValidationResolver(secretsFormDefinition ?? { inputs: [] })

    const defaultSecretValues = useMemo(() => {
      const defaultValues = getDefaultValuesFromFormDefinition(secretsFormDefinition ?? { inputs: [] })
      const connectorIdentifier = initialSecretValues?.secretManagerRef?.connector?.identifier
      const initialType = initialSecretValues?.type

      return {
        ...defaultValues,
        secret: defaultValues.secret
          ? {
              ...defaultValues.secret,
              type: initialType,
              spec: {
                ...(defaultValues.secret.spec || {}),
                secretManagerIdentifier: connectorIdentifier
              }
            }
          : undefined,
        secretManagerRef: initialSecretValues?.secretManagerRef,
        intent: EntityIntent.CREATE
      }
    }, [secretsFormDefinition, initialSecretValues?.secretManagerRef, initialSecretValues?.type])

    useEffect(() => {
      if (intent === EntityIntent.EDIT && initialSecretValues) {
        const mappedValues = {
          secret: {
            name: initialSecretValues.name || '',
            identifier: initialSecretValues.identifier,
            spec: {
              ...initialSecretValues.spec,
              secretManagerIdentifier: initialSecretValues.spec?.secretManagerIdentifier
            },
            description: initialSecretValues.description,
            tags: initialSecretValues.tags
              ? Object.keys(initialSecretValues.tags).map(key => ({
                  key,
                  value: initialSecretValues.tags?.[key] || '',
                  id: key
                }))
              : [],
            type: initialSecretValues.type
          },
          secretManagerRef: initialSecretValues?.secretManagerRef,
          intent: EntityIntent.EDIT
        }

        setSecretEditValues(mappedValues)
      }
    }, [initialSecretValues, secretsFormDefinition, intent])

    return (
      <RootForm
        defaultValues={intent === EntityIntent.EDIT ? secretEditValues : defaultSecretValues}
        autoFocusPath={secretsFormDefinition?.inputs[0]?.path}
        resolver={resolver}
        mode="onSubmit"
        onSubmit={values => {
          onSubmit({ values, intent })
        }}
        validateAfterFirstSubmit={true}
      >
        {rootForm => {
          formRef.current = rootForm

          return (
            <>
              <RenderForm
                className="max-w-xl space-y-cn-xl"
                factory={inputComponentFactory}
                inputs={secretsFormDefinition ?? { inputs: [] }}
              />
              {apiError && (
                <Alert.Root theme="danger" className="my-8">
                  <Alert.Description>{apiError.toString()}</Alert.Description>
                </Alert.Root>
              )}
              {!isDrawer && (
                <ButtonLayout horizontalAlign="start">
                  <Button variant="outline" onClick={() => onBack?.()}>
                    Back
                  </Button>
                  <Button onClick={() => rootForm.submitForm()}>Submit</Button>
                </ButtonLayout>
              )}
            </>
          )
        }}
      </RootForm>
    )
  }
)
SecretEntityForm.displayName = 'SecretEntityForm'
