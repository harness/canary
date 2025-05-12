import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'

import { Alert, Button, ButtonGroup } from '@/components'
import { EntityIntent, InputConfigType, TranslationStore } from '@/views'

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

interface SecretEntityFormProps {
  onFormSubmit?: (values: onSubmitSecretProps) => void
  secretsFormDefinition?: IFormDefinition<InputConfigType>
  onBack?: () => void
  useTranslationStore: () => TranslationStore
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
      useTranslationStore,
      inputComponentFactory,
      intent,
      isDrawer = false
    },
    ref
  ) => {
    const { t: _t } = useTranslationStore()
    const formRef = useRef<SecretEntityFormHandle | null>(null)

    useImperativeHandle(ref, () => ({
      submitForm: () => formRef.current?.submitForm?.()
    }))

    const onSubmit = (data: onSubmitSecretProps) => {
      onFormSubmit?.(data)
    }

    const resolver = useZodValidationResolver(secretsFormDefinition ?? { inputs: [] })

    const defaultSecretValues = useMemo(() => {
      return getDefaultValuesFromFormDefinition(secretsFormDefinition ?? { inputs: [] })
    }, [secretsFormDefinition])

    return (
      <RootForm
        defaultValues={defaultSecretValues}
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
                className="max-w-xl space-y-4"
                factory={inputComponentFactory}
                inputs={secretsFormDefinition ?? { inputs: [] }}
              />
              {apiError && (
                <Alert.Container variant="destructive" className="my-8">
                  <Alert.Description>{apiError.toString()}</Alert.Description>
                </Alert.Container>
              )}
              {!isDrawer && (
                <ButtonGroup>
                  <Button variant="outline" onClick={() => onBack?.()}>
                    Back
                  </Button>
                  <Button onClick={() => rootForm.submitForm()}>Submit</Button>
                </ButtonGroup>
              )}
            </>
          )
        }}
      </RootForm>
    )
  }
)
SecretEntityForm.displayName = 'SecretEntityForm'
