import { useEffect, useMemo } from 'react'

import { Accordion, Alert, Button, ButtonGroup, ControlGroup, Fieldset, FormWrapper, Spacer } from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  getDefaultValuesFromFormDefinition,
  IFormDefinition,
  InputFactory,
  RenderForm,
  RootForm,
  useZodValidationResolver
} from '@harnessio/forms'

import { SecretCreationType, SecretDataType } from '../types'

// Define the form schema
const createSecretFormSchema = z
  .object({
    name: z.string().min(1, { message: 'Please provide a name' }),
    value: z.string().optional(),
    file: z.instanceof(File).optional(),
    description: z.string().optional(),
    tags: z.string().optional()
  })
  .superRefine((data, ctx) => {
    // Check if either value or file is provided
    if (!data.value && !data.file) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide a Secret Value or a Secret File',
        path: ['file']
      })
    }

    // Check if both value and file are provided
    if (data.value && data.file) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide either a Secret Value or a Secret File',
        path: ['file']
      })
    }
  })

export type CreateSecretFormFields = z.infer<typeof createSecretFormSchema>

interface CreateSecretProps {
  prefilledFormData?: SecretDataType
  onFormSubmit: (data: CreateSecretFormFields) => void
  onFormCancel: () => void
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  apiError: string | null
  connectorInput: React.ReactElement
  inputComponentFactory: InputFactory
}

export function CreateSecretPage({
  onFormSubmit,
  onFormCancel,
  useTranslationStore,
  isLoading = false,
  apiError = null,
  prefilledFormData,
  connectorInput,
  inputComponentFactory
}: CreateSecretProps) {
  const { t: _t } = useTranslationStore()

  // Create form definition for the forms framework
  const formDefinition = useMemo<IFormDefinition>(() => {
    const inputs = [
      {
        inputType: 'text',
        path: 'name',
        label: 'Secret Name',
        placeholder: 'Enter secret name',
        required: true
      }
    ]

    // Add value or file input based on prefilled data
    if (!prefilledFormData || prefilledFormData.type === SecretCreationType.SECRET_TEXT) {
      inputs.push({
        inputType: 'password',
        path: 'value',
        label: 'Secret Value',
        placeholder: prefilledFormData ? 'Encrypted' : 'Add your secret value',
        required: true
      })
    }

    if (!prefilledFormData || prefilledFormData.type === SecretCreationType.SECRET_FILE) {
      inputs.push({
        inputType: 'file',
        path: 'file',
        label: 'Secret File',
        placeholder: 'Add your secret file',
        required: true
      })
    }

    // Add metadata inputs
    inputs.push({
      inputType: 'textarea',
      path: 'description',
      label: 'Description',
      placeholder: 'Enter a description of this secret',
      required: false
    })

    inputs.push({
      inputType: 'text',
      path: 'tags',
      label: 'Tags',
      placeholder: 'Enter tags',
      required: false
    })

    return {
      inputs
    }
  }, [prefilledFormData])

  // Get default values
  const defaultValues = useMemo(() => {
    const values = getDefaultValuesFromFormDefinition(formDefinition)

    // Add prefilled data if available
    if (prefilledFormData) {
      return {
        ...values,
        name: prefilledFormData.identifier || '',
        description: prefilledFormData.description || '',
        tags: prefilledFormData.tags || ''
      }
    }

    return values
  }, [formDefinition, prefilledFormData])

  // Create resolver for validation
  const resolver = useZodValidationResolver(formDefinition, {
    validationConfig: {
      requiredMessage: 'This field is required',
      requiredSchema: createSecretFormSchema
    }
  })

  const handleSubmit = (data: CreateSecretFormFields) => {
    onFormSubmit(data)
  }

  return (
    <SandboxLayout.Content className="h-full px-0 pt-0">
      <Spacer size={5} />

      <RootForm defaultValues={defaultValues} onSubmit={handleSubmit} resolver={resolver} mode="onChange">
        <div className="flex h-full flex-col">
          <RenderForm className="flex-1 px-4" factory={inputComponentFactory} inputs={formDefinition} />

          <Accordion.Root type="single" collapsible className="px-4 mb-4">
            <Accordion.Item value="secret-manager">
              <Accordion.Trigger>Storage</Accordion.Trigger>
              <Accordion.Content>{connectorInput}</Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>

          {apiError && (
            <Alert.Container variant="destructive" className="mb-8 mx-4">
              <Alert.Description>{apiError?.toString()}</Alert.Description>
            </Alert.Container>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-cn-background-2 p-4 shadow-md">
            <ControlGroup>
              <ButtonGroup className="flex flex-row justify-between">
                <Button type="button" variant="outline" onClick={onFormCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {!isLoading ? 'Save' : 'Saving...'}
                </Button>
              </ButtonGroup>
            </ControlGroup>
          </div>

          <div className="pb-16"></div>
        </div>
      </RootForm>
    </SandboxLayout.Content>
  )
}
