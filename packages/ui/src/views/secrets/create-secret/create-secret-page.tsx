import { ChangeEvent, useRef } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'

import {
  Accordion,
  Alert,
  Button,
  ButtonGroup,
  ControlGroup,
  Fieldset,
  FormWrapper,
  Input,
  Spacer,
  Textarea
} from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const newSecretFormSchema = z
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

export type NewSecretFormFields = z.infer<typeof newSecretFormSchema>

interface CreateSecretPageProps {
  onFormSubmit: (data: NewSecretFormFields) => void
  onFormCancel: () => void
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  apiError: string | null
}

export function CreateSecretPage({
  onFormSubmit,
  onFormCancel,
  useTranslationStore,
  isLoading = false,
  apiError = null
}: CreateSecretPageProps) {
  const { t: _t } = useTranslationStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm<NewSecretFormFields>({
    resolver: zodResolver(newSecretFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      value: '',
      description: '',
      tags: ''
    }
  })

  const selectedFile = watch('file')
  // const secretValue = watch('value')

  const onSubmit: SubmitHandler<NewSecretFormFields> = data => {
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
    <SandboxLayout.Content className="px-0 pt-0 h-full">
      <Spacer size={5} />
      <FormWrapper className="flex h-full flex-col" onSubmit={handleSubmit(onSubmit)}>
        {/* NAME */}
        <Fieldset className="mb-0">
          <Input
            id="name"
            label="Secret Name"
            {...register('name')}
            placeholder="Enter secret name"
            size="md"
            error={errors.name?.message?.toString()}
            autoFocus
          />

          <Input
            id="value"
            {...register('value', {
              onChange: () => {
                trigger()
              }
            })}
            type="password"
            label="Secret Value"
            placeholder="Add your secret value"
            size="md"
            error={errors.value?.message?.toString()}
          />

          <div>
            <label htmlFor="secret-file-input" className="text-foreground-2 mb-2.5 block text-sm font-medium">
              Secret File
            </label>
            <div
              className="border-2 border-dashed border-borders-2 p-4 rounded-md"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center">
                {!selectedFile ? (
                  <>
                    <p className="mb-2 text-foreground-2 text-sm">Drag and drop your file here or click to browse</p>
                    <Button type="button" variant="outline" onClick={openFileInput}>
                      Browse Files
                    </Button>
                  </>
                ) : (
                  <div className="w-full flex flex-col">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground-2">
                        Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                      </span>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={openFileInput}>
                          Change
                        </Button>
                        <Button type="button" variant="destructive" size="sm" onClick={removeFile}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {errors.file && <div className="text-destructive text-sm mt-1">{errors.file.message?.toString()}</div>}
          </div>
          <Accordion.Root type="single" collapsible>
            <Accordion.Item value="secret-details">
              <Accordion.Trigger>Metadata</Accordion.Trigger>
              <Accordion.Content>
                <Fieldset className="rounded-md border-2 p-4">
                  {/* DESCRIPTION */}
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Enter a description of this secret"
                    label="Description"
                    error={errors.description?.message?.toString()}
                    optional
                  />
                  {/* TAGS */}
                  <Input
                    id="tags"
                    {...register('tags')}
                    label="Tags"
                    placeholder="Enter tags"
                    size="md"
                    error={errors.tags?.message?.toString()}
                    optional
                  />
                </Fieldset>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </Fieldset>

        {apiError && (
          <Alert.Container variant="destructive" className="mb-8">
            <Alert.Description>{apiError?.toString()}</Alert.Description>
          </Alert.Container>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-background-2 p-4 shadow-md">
          <ControlGroup>
            <ButtonGroup className="flex flex-row justify-between">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {!isLoading ? 'Save' : 'Saving...'}
              </Button>
            </ButtonGroup>
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
        accept=".txt,.json,.yaml,.yml,.env,.key,.pem,.crt,.cer,.pub"
      />
    </SandboxLayout.Content>
  )
}
