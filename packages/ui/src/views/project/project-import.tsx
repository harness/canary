import { useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'

import {
  Button,
  ButtonLayout,
  ControlGroup,
  Fieldset,
  FormInput,
  FormSeparator,
  FormWrapper,
  Spacer,
  Text
} from '@/components'
import { SandboxLayout } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProviderOptionsEnum } from '@views/repo/repo-import/types'
import { z } from 'zod'

const formSchema = z
  .object({
    identifier: z.string(),
    description: z.string(),
    hostUrl: z.string().optional(),
    pipelines: z.boolean().optional(),
    repositories: z.boolean().optional(),
    provider: z.string().min(1, { message: 'Please select a provider' }),
    password: z.string().optional(),
    organization: z.string().min(1, { message: 'Please enter an organization' })
  })
  .superRefine((data, ctx) => {
    if (data.provider === 'Github Enterprise' && !data.hostUrl) {
      ctx.addIssue({
        code: 'custom',
        path: ['hostUrl'],
        message: 'Repository URL is required'
      })
    }
  })

export type ImportProjectFormFields = z.infer<typeof formSchema>

const providerOptions = Object.values(ProviderOptionsEnum).map(option => ({
  value: option,
  label: option,
  disabled: option !== ProviderOptionsEnum.GITHUB && option !== ProviderOptionsEnum.GITHUB_ENTERPRISE
}))

interface ImportProjectPageProps {
  onFormSubmit: (data: ImportProjectFormFields) => void
  onFormCancel: () => void
  isLoading: boolean
  apiErrorsValue?: string
}

export function ImportProjectPage({ onFormSubmit, onFormCancel, isLoading, apiErrorsValue }: ImportProjectPageProps) {
  const formMethods = useForm<ImportProjectFormFields>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      description: '',
      pipelines: false,
      repositories: true,
      provider: 'Github',
      password: '',
      organization: ''
    }
  })

  const { register, handleSubmit, setValue, watch } = formMethods

  const orgValue = watch('organization')

  useEffect(() => {
    setValue('identifier', orgValue)
  }, [orgValue, setValue])

  const onSubmit: SubmitHandler<ImportProjectFormFields> = data => {
    onFormSubmit(data)
  }

  const handleCancel = () => {
    onFormCancel()
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className="settings-form-width mx-auto">
        <Spacer size={5} />
        <Text variant="heading-section">Import a Project</Text>
        <Spacer size={10} />
        <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
          {/* provider */}
          <FormInput.Select
            options={providerOptions}
            placeholder="Select"
            label="Git provider"
            {...register('provider')}
          />

          {watch('provider') === ProviderOptionsEnum.GITHUB_ENTERPRISE && (
            <FormInput.Text id="host" label="Host URL" {...register('hostUrl')} placeholder="Enter the host URL" />
          )}

          {/* token */}
          <FormInput.Text
            type="password"
            id="password"
            label="Token"
            {...register('password')}
            placeholder="Enter your access token"
          />

          <FormSeparator />

          {/* organization */}
          <Fieldset>
            <FormInput.Text
              id="organization"
              label="Organization"
              {...register('organization')}
              placeholder="Enter the organization name"
            />
          </Fieldset>

          {/* authorization - pipelines */}
          <Fieldset>
            <ControlGroup className="flex flex-row gap-cn-lg">
              <FormInput.Checkbox
                {...register('repositories')}
                id="authorization"
                checked={true}
                disabled
                label="Repositories"
              />
              <FormInput.Checkbox
                {...register('pipelines')}
                id="pipelines"
                // onCheckedChange={(checked: boolean) => setValue('pipelines', checked)}
                label="Import Pipelines"
              />
            </ControlGroup>
          </Fieldset>

          <FormSeparator />

          {/* project identifier */}
          <Fieldset>
            <ControlGroup>
              <FormInput.Text
                id="identifier"
                label="Name"
                {...register('identifier')}
                placeholder="Enter repository name"
              />
            </ControlGroup>
          </Fieldset>

          {/* description */}
          <Fieldset>
            <ControlGroup>
              <FormInput.Text
                id="description"
                label="Description"
                {...register('description')}
                placeholder="Enter a description"
              />
            </ControlGroup>
          </Fieldset>

          {!!apiErrorsValue && (
            <Text as="span" color="danger">
              {apiErrorsValue}
            </Text>
          )}
          {/* SUBMIT BUTTONS */}
          <Fieldset>
            <ControlGroup>
              <ButtonLayout horizontalAlign="start">
                <Button type="submit" disabled={isLoading}>
                  {!isLoading ? 'Import project' : 'Importing project...'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </ButtonLayout>
            </ControlGroup>
          </Fieldset>
        </FormWrapper>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
