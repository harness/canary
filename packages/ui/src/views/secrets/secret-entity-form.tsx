import { useMemo } from 'react'

import { Alert, Button, ScrollArea } from '@/components'
import { EntityIntent, InputConfigType, TranslationStore } from '@/views'
import { EntityFormLayout } from '@views/unified-pipeline-studio/components/entity-form/entity-form-layout'
import { EntityFormSectionLayout } from '@views/unified-pipeline-studio/components/entity-form/entity-form-section-layout'

import {
  getDefaultValuesFromFormDefinition,
  IFormDefinition,
  InputFactory,
  RenderForm,
  RootForm,
  useZodValidationResolver
} from '@harnessio/forms'

import { onSubmitSecretProps } from './types'

interface SecretEntityFormProps {
  onFormSubmit?: (values: onSubmitSecretProps) => void
  secretsFormDefinition?: IFormDefinition<InputConfigType>
  onBack?: () => void
  useTranslationStore: () => TranslationStore
  inputComponentFactory: InputFactory
  apiError?: string | null
  intent: EntityIntent
  hasHeader?: boolean
}

export const SecretEntityForm = (props: SecretEntityFormProps): JSX.Element => {
  const {
    apiError = null,
    onFormSubmit,
    secretsFormDefinition,
    onBack,
    useTranslationStore,
    inputComponentFactory,
    intent,
    hasHeader = true
  } = props
  const { t: _t } = useTranslationStore()

  const onSubmit = (data: onSubmitSecretProps) => {
    onFormSubmit?.(data)
  }

  const resolver = useZodValidationResolver(secretsFormDefinition ?? { inputs: [] }, {
    validationConfig: {
      requiredMessage: 'Required input',
      requiredMessagePerInput: { ['select']: 'Selection is required' }
    }
  })

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
      {rootForm => (
        <EntityFormLayout.Root>
          <EntityFormSectionLayout.Root>
            <EntityFormSectionLayout.Form className="px-0">
              <div className="flex-1">
                <ScrollArea
                  className={hasHeader ? 'h-[calc(100vh-350px)]' : 'h-[calc(100vh-150px)]'}
                  viewportClassName="pb-6"
                  orientation="both"
                >
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
                </ScrollArea>
              </div>
            </EntityFormSectionLayout.Form>
          </EntityFormSectionLayout.Root>
          <EntityFormLayout.Footer className="border-none">
            <div className="absolute inset-x-0 bottom-0 flex justify-between gap-x-3 bg-cn-background-2 p-4 shadow-md">
              <Button variant="ghost" onClick={() => onBack?.()}>
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
