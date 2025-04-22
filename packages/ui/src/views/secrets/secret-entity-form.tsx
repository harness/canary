import { useMemo } from 'react'

import { EntityIntent, TranslationStore } from '@/views'
import { Alert } from '@components/alert'
import { Button } from '@components/button'
import { EntityFormLayout } from '@views/unified-pipeline-studio/components/entity-form/entity-form-layout'
import { EntityFormSectionLayout } from '@views/unified-pipeline-studio/components/entity-form/entity-form-section-layout'

import { InputFactory, RenderForm, RootForm, useZodValidationResolver } from '@harnessio/forms'

import { AnySecretDefinition, onSubmitSecretProps } from './types'

interface SecretEntityFormProps {
  onFormSubmit?: (values: onSubmitSecretProps) => void
  getSecretDefinition?: () => AnySecretDefinition
  onBack?: () => void
  useTranslationStore: () => TranslationStore
  inputComponentFactory: InputFactory
  apiError?: string | null
  intent: EntityIntent
}

export const SecretEntityForm = (props: SecretEntityFormProps): JSX.Element => {
  const {
    apiError = null,
    onFormSubmit,
    getSecretDefinition,
    onBack,
    useTranslationStore,
    inputComponentFactory,
    intent
  } = props
  const { t: _t } = useTranslationStore()

  const onSubmit = (data: onSubmitSecretProps) => {
    onFormSubmit?.(data)
  }

  const formDefinition = useMemo(() => {
    const secretDefinition = getSecretDefinition?.()
    if (secretDefinition) {
      const formDef = {
        ...secretDefinition.formDefinition
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
  }, [getSecretDefinition])

  const resolver = useZodValidationResolver(formDefinition, {
    validationConfig: {
      requiredMessage: 'Required input',
      requiredMessagePerInput: { ['select']: 'Selection is required' }
    }
  })

  return (
    <RootForm
      autoFocusPath={formDefinition.inputs[0]?.path}
      resolver={resolver}
      mode="onSubmit"
      onSubmit={values => {
        onSubmit({ values, intent })
      }}
      validateAfterFirstSubmit={true}
    >
      {rootForm => (
        <EntityFormLayout.Root>
          <EntityFormSectionLayout.Root>
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
