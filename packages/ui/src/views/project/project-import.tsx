import { useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'

import {
  Button,
  ButtonGroup,
  Checkbox,
  ControlGroup,
  Fieldset,
  FormSeparator,
  FormWrapper,
  Input,
  Select,
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

interface ImportProjectPageProps {
  onFormSubmit: (data: ImportProjectFormFields) => void
  onFormCancel: () => void
  isLoading: boolean
  apiErrorsValue?: string
}

export function ImportProjectPage({ onFormSubmit, onFormCancel, isLoading, apiErrorsValue }: ImportProjectPageProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ImportProjectFormFields>({
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

  const providerValue = watch('provider')
  const orgValue = watch('organization')

  useEffect(() => {
    setValue('identifier', orgValue)
  }, [orgValue, setValue])

  const handleSelectChange = (fieldName: keyof ImportProjectFormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  const onSubmit: SubmitHandler<ImportProjectFormFields> = data => {
    onFormSubmit(data)
  }

  const handleCancel = () => {
    onFormCancel()
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className="mx-auto w-[570px] pb-20 pt-11">
        <Spacer size={5} />
        <Text className="tracking-tight" size={5} weight="medium">
          Import a Project
        </Text>
        <Spacer size={10} />
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          {/* provider */}
          <Fieldset>
            <ControlGroup>
              <Select.Root
                name="provider"
                value={providerValue}
                onValueChange={value => handleSelectChange('provider', value)}
                placeholder="Select"
                label="Git provider"
              >
                <Select.Content>
                  {ProviderOptionsEnum &&
                    Object.values(ProviderOptionsEnum)?.map(option => {
                      return (
                        <Select.Item
                          key={option}
                          value={option}
                          disabled={
                            option !== ProviderOptionsEnum.GITHUB && option !== ProviderOptionsEnum.GITHUB_ENTERPRISE
                          }
                        >
                          {option}
                        </Select.Item>
                      )
                    })}
                </Select.Content>
              </Select.Root>
            </ControlGroup>
          </Fieldset>
          {watch('provider') === ProviderOptionsEnum.GITHUB_ENTERPRISE && (
            <Fieldset>
              <Input
                id="host"
                label="Host URL"
                {...register('hostUrl')}
                placeholder="Enter the host URL"
                size="md"
                error={errors.hostUrl?.message?.toString()}
              />
            </Fieldset>
          )}

          {/* token */}
          <Fieldset>
            <ControlGroup>
              <Input
                type="password"
                id="password"
                label="Token"
                {...register('password')}
                placeholder="Enter your access token"
                size="md"
                error={errors.password?.message?.toString()}
              />
            </ControlGroup>
          </Fieldset>

          <FormSeparator />

          {/* organization */}
          <Fieldset>
            <Input
              id="organization"
              label="Organization"
              {...register('organization')}
              placeholder="Enter the organization name"
              size="md"
              error={errors.organization?.message?.toString()}
            />
          </Fieldset>

          {/* authorization - pipelines */}
          <Fieldset>
            <ControlGroup className="flex flex-row gap-5">
              <Checkbox {...register('repositories')} id="authorization" checked={true} disabled label="Repositories" />
              <Checkbox
                {...register('pipelines')}
                id="pipelines"
                checked={watch('pipelines')}
                onCheckedChange={(checked: boolean) => setValue('pipelines', checked)}
                label="Import Pipelines"
              />
            </ControlGroup>
          </Fieldset>

          <FormSeparator />

          {/* project identifier */}
          <Fieldset>
            <ControlGroup>
              <Input
                id="identifier"
                label="Name"
                {...register('identifier')}
                placeholder="Enter repository name"
                size="md"
                error={errors.identifier?.message?.toString()}
              />
            </ControlGroup>
          </Fieldset>

          {/* description */}
          <Fieldset>
            <ControlGroup>
              <Input
                id="description"
                label="Description"
                {...register('description')}
                placeholder="Enter a description"
                size="md"
                error={errors.description?.message?.toString()}
              />
            </ControlGroup>
          </Fieldset>

          {!!apiErrorsValue && <span className="text-2 text-cn-foreground-danger">{apiErrorsValue}</span>}
          {/* SUBMIT BUTTONS */}
          <Fieldset>
            <ControlGroup>
              <ButtonGroup>
                <Button type="submit" disabled={isLoading}>
                  {!isLoading ? 'Import project' : 'Importing project...'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </ButtonGroup>
            </ControlGroup>
          </Fieldset>
        </FormWrapper>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
