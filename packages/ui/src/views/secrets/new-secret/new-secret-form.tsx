// import { useEffect } from 'react'

import { useForm, type SubmitHandler } from 'react-hook-form'

import { Button, ButtonGroup, ControlGroup, Fieldset, FormWrapper, Input, Spacer, Text, Textarea } from '@/components'
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
    <SandboxLayout.Content paddingClassName="w-[480px] mx-auto">
      <Spacer size={5} />
      <FormWrapper className="gap-y-7" onSubmit={handleSubmit(onSubmit)}>
        {/* NAME */}
        <Fieldset>
          <Input
            id="name"
            label="Name"
            {...register('name')}
            placeholder="Enter github-token"
            size="md"
            error={errors.name?.message?.toString()}
            autoFocus
          />

          <Input
            id="password"
            {...register('password')}
            type="password"
            label="Enter the secret text"
            placeholder="Enter password"
            size="md"
            error={errors.password?.message?.toString()}
          />
        </Fieldset>

        <Fieldset>
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

        {/* SUBMIT BUTTONS */}
        <Fieldset className="mt-6">
          <ControlGroup>
            <ButtonGroup>
              <Button type="submit" disabled={!isValid || isLoading}>
                {!isLoading ? 'Save' : 'Saving...'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </ButtonGroup>
          </ControlGroup>
        </Fieldset>
      </FormWrapper>
    </SandboxLayout.Content>
  )
}
