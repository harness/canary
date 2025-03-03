import { ChangeEvent, useRef, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'

import {
  Accordion,
  Alert,
  Button,
  ButtonGroup,
  ControlGroup,
  Dialog,
  Fieldset,
  FormWrapper,
  Input,
  Spacer,
  Textarea
} from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const existingSecretFormSchema = z.object({
  name: z.string().min(1, { message: 'Please provide a name' }),
  file: z.instanceof(File, { message: 'Please upload a file' }),
  description: z.string().optional(),
  tags: z.string().optional()
})

export type ExistingSecretFormFields = z.infer<typeof existingSecretFormSchema>

interface ExistingSecretPageProps {
  onFormSubmit: (data: ExistingSecretFormFields) => void
  onFormCancel: () => void
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  apiError: string | null
}

export function ExistingSecretPage({
  onFormSubmit,
  onFormCancel,
  useTranslationStore,
  isLoading = false,
  apiError = null
}: ExistingSecretPageProps) {
  const { t: _t } = useTranslationStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ExistingSecretFormFields>({
    resolver: zodResolver(existingSecretFormSchema),
    mode: 'onChange'
  })

  const selectedFile = watch('file')

  const onSubmit: SubmitHandler<ExistingSecretFormFields> = data => {
    onFormSubmit(data)
    reset()
  }

  const handleCancel = () => {
    onFormCancel()
    reset()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue('file', e.target.files[0], { shouldValidate: true })
      setIsDialogOpen(false)
    }
  }

  const openFileDialog = () => {
    setIsDialogOpen(true)
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <SandboxLayout.Content className="px-0 pt-0 h-full">
      <Spacer size={5} />
      <FormWrapper className="flex h-full flex-col" onSubmit={handleSubmit(onSubmit)}>
        {/* NAME */}
        <Fieldset>
          <Input
            id="name"
            label="Secret Name"
            {...register('name')}
            placeholder="Enter secret name"
            size="md"
            error={errors.name?.message?.toString()}
            autoFocus
          />

          <div className="mb-4">
            <label htmlFor="secret-file-input" className="text-foreground-2 mb-2.5 block text-sm font-medium">
              Secret File
            </label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={openFileDialog}>
                {selectedFile ? 'Change File' : 'Upload Secret File'}
              </Button>
              {selectedFile && (
                <span className="text-sm text-foreground-2">
                  Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </span>
              )}
            </div>
            {errors.file && <div className="text-destructive text-sm mt-1">{errors.file.message?.toString()}</div>}
          </div>
        </Fieldset>
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
              <Button type="submit" disabled={isLoading || !selectedFile}>
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

      {/* File Upload Dialog */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content className="max-w-md">
          <Dialog.Header>
            <Dialog.Title>Upload Secret File</Dialog.Title>
          </Dialog.Header>
          <Dialog.Description>
            Select a file containing your secret. Supported formats include text files, JSON, YAML, environment files,
            and certificates.
          </Dialog.Description>

          <div className="mt-4 flex flex-col items-center justify-center border-2 border-dashed border-borders-2 p-8 rounded-md">
            <div className="text-center">
              <p className="mb-4 text-foreground-2">Drag and drop your file here or click to browse</p>
              <Button type="button" onClick={triggerFileInput}>
                Browse Files
              </Button>
            </div>
          </div>

          <Dialog.Footer>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </SandboxLayout.Content>
  )
}
