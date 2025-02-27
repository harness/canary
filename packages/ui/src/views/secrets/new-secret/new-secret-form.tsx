import { useForm, type SubmitHandler } from 'react-hook-form'

import {
  Accordion,
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
  password: z.string().min(1, { message: 'Please provide a password' }),
  description: z.string().optional(),
  tags: z.string().optional()
})

export type NewSecretFormFields = z.infer<typeof newSecretformSchema> // Automatically generate a type from the schema

interface NewSecretPageProps {
  onFormSubmit: (data: NewSecretFormFields) => void
  onFormCancel: () => void
  useTranslationStore: () => TranslationStore
  isLoading: boolean
}

export function NewSecretPage({
  onFormSubmit,
  onFormCancel,
  useTranslationStore,
  isLoading = false
}: NewSecretPageProps) {
  const { t: _t } = useTranslationStore()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<NewSecretFormFields>({
    resolver: zodResolver(newSecretformSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      password: '',
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
    <SandboxLayout.Content className="px-0 pt-0">
      <Spacer size={5} />
      <FormWrapper className="gap-y-7" onSubmit={handleSubmit(onSubmit)}>
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
            id="password"
            {...register('password')}
            type="password"
            label="Secret Value"
            placeholder="Add your secret value"
            size="md"
            error={errors.password?.message?.toString()}
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
        {/* SUBMIT BUTTONS */}
        <Fieldset className="mt-auto">
          <ControlGroup>
            <ButtonGroup className="mt-auto flex flex-row justify-between">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || isLoading}>
                {!isLoading ? 'Save' : 'Saving...'}
              </Button>
            </ButtonGroup>
          </ControlGroup>
        </Fieldset>
      </FormWrapper>
    </SandboxLayout.Content>
  )
}
