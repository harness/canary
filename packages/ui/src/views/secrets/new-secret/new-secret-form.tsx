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

const newSecretformSchema = z.object({
  name: z.string().min(1, { message: 'Please provide a name' }),
  value: z.string().min(1, { message: 'Please provide a value' }),
  description: z.string().optional(),
  tags: z.string().optional()
})

export type NewSecretFormFields = z.infer<typeof newSecretformSchema> // Automatically generate a type from the schema

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<NewSecretFormFields>({
    resolver: zodResolver(newSecretformSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      value: '',
      description: '',
      tags: ''
    }
  })

  const onSubmit: SubmitHandler<NewSecretFormFields> = data => {
    onFormSubmit(data)
    reset()
  }

  const handleCancel = () => {
    onFormCancel()
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

          <Input
            id="value"
            {...register('value')}
            type="password"
            label="Secret Value"
            placeholder="Add your secret value"
            size="md"
            error={errors.value?.message?.toString()}
          />
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
              <Button type="submit" disabled={isLoading}>
                {!isLoading ? 'Save' : 'Saving...'}
              </Button>
            </ButtonGroup>
          </ControlGroup>
        </div>

        <div className="pb-16"></div>
      </FormWrapper>
    </SandboxLayout.Content>
  )
}
