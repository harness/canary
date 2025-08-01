import { ChangeEvent, useEffect, useRef } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'

import {
  Accordion,
  Alert,
  Button,
  ButtonLayout,
  ControlGroup,
  Fieldset,
  FormInput,
  FormWrapper,
  Input,
  Spacer,
  Text
} from '@/components'
import { useTranslation } from '@/context'
import { SandboxLayout } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { SecretCreationType, SecretDataType } from '../types'

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
  isLoading: boolean
  apiError: string | null
  connectorInput: React.ReactElement
}

export function CreateSecretPage({
  onFormSubmit,
  onFormCancel,
  isLoading = false,
  apiError = null,
  prefilledFormData,
  connectorInput
}: CreateSecretProps) {
  const { t: _t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formMethods = useForm<CreateSecretFormFields>({
    resolver: zodResolver(createSecretFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: prefilledFormData?.name ?? '',
      description: prefilledFormData?.description ?? '',
      tags: prefilledFormData?.tags ?? ''
    }
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = formMethods

  useEffect(() => {
    if (prefilledFormData) {
      reset({
        name: prefilledFormData.identifier,
        description: prefilledFormData.description,
        tags: prefilledFormData.tags
      })
    }
  }, [prefilledFormData])

  const selectedFile = watch('file')

  const onSubmit: SubmitHandler<CreateSecretFormFields> = data => {
    onFormSubmit(data)
    reset()
  }

  const handleCancel = () => {
    onFormCancel()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue('file', e.target.files[0], { shouldValidate: true })
      trigger()
    }
  }

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const removeFile = () => {
    setValue('file', undefined, { shouldValidate: true })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    trigger()
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setValue('file', e.dataTransfer.files[0], { shouldValidate: true })
      trigger()
    }
  }

  return (
    <SandboxLayout.Content className="h-full px-0 pt-0">
      <Spacer size={5} />
      <FormWrapper {...formMethods} className="flex h-full flex-col" onSubmit={handleSubmit(onSubmit)}>
        {/* NAME */}
        <Fieldset className="mb-0">
          <FormInput.Text
            id="name"
            label="Secret Name"
            {...register('name')}
            placeholder="Enter secret name"
            autoFocus
          />
          {(!prefilledFormData || prefilledFormData.type === SecretCreationType.SECRET_TEXT) && (
            <FormInput.Text
              id="value"
              {...register('value', {
                onChange: () => {
                  trigger()
                }
              })}
              type="password"
              label="Secret Value"
              placeholder={prefilledFormData ? 'Encryped' : 'Add your secret value'}
            />
          )}
          {(!prefilledFormData || prefilledFormData.type === SecretCreationType.SECRET_FILE) && (
            <div>
              <Text<'label'> as="label" htmlFor="secret-file-input" className="mb-2.5 block" variant="body-strong">
                Secret File
              </Text>
              <div
                className="rounded-md border-2 border-dashed border-cn-borders-2 p-4"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center">
                  {!selectedFile ? (
                    <>
                      <Text className="mb-2">Drag and drop your file here or click to browse</Text>
                      <Button type="button" variant="outline" onClick={openFileInput}>
                        Browse Files
                      </Button>
                    </>
                  ) : (
                    <div className="flex w-full flex-col">
                      <div className="flex items-center justify-between">
                        <Text as="span">
                          Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                        </Text>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={openFileInput}>
                            Change
                          </Button>
                          <Button type="button" variant="primary" theme="danger" size="sm" onClick={removeFile}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {errors.file && (
                <Text color="danger" className="mt-1">
                  {errors.file.message?.toString()}
                </Text>
              )}
            </div>
          )}
          <Accordion.Root type="single" collapsible>
            <Accordion.Item value="secret-details">
              <Accordion.Trigger>Metadata</Accordion.Trigger>
              <Accordion.Content>
                <Fieldset className="rounded-md border p-4">
                  {/* DESCRIPTION */}
                  <FormInput.Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Enter a description of this secret"
                    label="Description"
                    optional
                  />
                  {/* TAGS */}
                  <FormInput.Text id="tags" {...register('tags')} label="Tags" placeholder="Enter tags" optional />
                </Fieldset>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>

          <Accordion.Root type="single" collapsible>
            <Accordion.Item value="secret-manager">
              <Accordion.Trigger>Storage</Accordion.Trigger>
              <Accordion.Content>{connectorInput}</Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </Fieldset>

        {apiError && (
          <Alert.Root theme="danger" className="mb-8">
            <Alert.Description>{apiError?.toString()}</Alert.Description>
          </Alert.Root>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-cn-background-2 p-4 shadow-md">
          <ControlGroup>
            <ButtonLayout.Root>
              <ButtonLayout.Primary>
                <Button type="submit" disabled={isLoading}>
                  {!isLoading ? 'Save' : 'Saving...'}
                </Button>
              </ButtonLayout.Primary>
              <ButtonLayout.Secondary>
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </ButtonLayout.Secondary>
            </ButtonLayout.Root>
          </ControlGroup>
        </div>

        <div className="pb-16"></div>
      </FormWrapper>

      {/* Hidden file input */}
      <Input
        id="secret-file-input"
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </SandboxLayout.Content>
  )
}
