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
  Option,
  Select,
  Spacer,
  Text
} from '@/components'
import { SandboxLayout } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { ProviderOptionsEnum } from './types'

const formSchema = z
  .object({
    hostUrl: z.string().optional(),
    pipelines: z.boolean().optional(),
    repositories: z.boolean().optional(),
    provider: z.nativeEnum(ProviderOptionsEnum, { message: 'Please select a provider' }),
    password: z.string().optional(),
    organization: z.string().optional(),
    group: z.string().optional(),
    username: z.string().optional(),
    workspace: z.string().optional(),
    project: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (
      [
        ProviderOptionsEnum.GITHUB,
        ProviderOptionsEnum.GITHUB_ENTERPRISE,
        ProviderOptionsEnum.GITEA,
        ProviderOptionsEnum.GOGS,
        ProviderOptionsEnum.AZURE_DEVOPS
      ].includes(data.provider) &&
      !data.organization?.trim()
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['organization'],
        message: 'Please enter an organization'
      })
    }

    if (data.provider === ProviderOptionsEnum.BITBUCKET && !data.workspace?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['workspace'],
        message: 'Please enter a Workspace'
      })
    }

    if (
      [ProviderOptionsEnum.GITLAB, ProviderOptionsEnum.GITLAB_SELF_HOSTED].includes(data.provider) &&
      !data.group?.trim()
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['group'],
        message: 'Please enter a Group'
      })
    }

    if (
      [
        ProviderOptionsEnum.GITHUB_ENTERPRISE,
        ProviderOptionsEnum.GITLAB_SELF_HOSTED,
        ProviderOptionsEnum.BITBUCKET_SERVER,
        ProviderOptionsEnum.GITEA,
        ProviderOptionsEnum.GOGS
      ].includes(data.provider) &&
      !data.hostUrl?.trim()
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['hostUrl'],
        message: 'Please enter a Host URL'
      })
    }

    if (
      [ProviderOptionsEnum.BITBUCKET_SERVER, ProviderOptionsEnum.AZURE_DEVOPS].includes(data.provider) &&
      !data.project?.trim()
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['project'],
        message: 'Please enter a Project'
      })
    }
  })

export type ImportMultipleReposFormFields = z.infer<typeof formSchema>

interface RepoImportMultiplePageProps {
  onFormSubmit: (data: ImportMultipleReposFormFields) => void
  onFormCancel: () => void
  isLoading: boolean
  apiErrorsValue?: string
}

export function RepoImportMultiplePage({
  onFormSubmit,
  onFormCancel,
  isLoading,
  apiErrorsValue
}: RepoImportMultiplePageProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<ImportMultipleReposFormFields>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      pipelines: false,
      repositories: true,
      provider: ProviderOptionsEnum.GITHUB
    }
  })

  const providerValue = watch('provider')

  const handleSelectChange = (fieldName: keyof ImportMultipleReposFormFields, value: string) => {
    if (fieldName === 'provider') {
      reset({ provider: value as ProviderOptionsEnum, repositories: true, pipelines: false })
    } else {
      setValue(fieldName, value, { shouldValidate: true })
    }
  }

  const onSubmit: SubmitHandler<ImportMultipleReposFormFields> = data => {
    onFormSubmit(data)
  }

  const handleCancel = () => {
    onFormCancel()
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content key={providerValue} paddingClassName="w-[570px] sdfsdfsdfdsf mx-auto pt-11 pb-20">
        <Spacer size={5} />
        <Text className="tracking-tight" size={5} weight="medium">
          Import Repositories
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
                        <Select.Item key={option} value={option}>
                          {option}
                        </Select.Item>
                      )
                    })}
                </Select.Content>
              </Select.Root>
            </ControlGroup>
          </Fieldset>

          {[
            ProviderOptionsEnum.GITHUB_ENTERPRISE,
            ProviderOptionsEnum.GITLAB_SELF_HOSTED,
            ProviderOptionsEnum.BITBUCKET_SERVER,
            ProviderOptionsEnum.GITEA,
            ProviderOptionsEnum.GOGS
          ].includes(watch('provider')) && (
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

          {[ProviderOptionsEnum.BITBUCKET, ProviderOptionsEnum.AZURE_DEVOPS].includes(watch('provider')) && (
            <Fieldset>
              <ControlGroup>
                <Input
                  id="username"
                  label="Username"
                  {...register('username')}
                  placeholder="Enter your Username"
                  size="md"
                  error={errors.password?.message?.toString()}
                />
              </ControlGroup>
            </Fieldset>
          )}

          {/* token */}
          <Fieldset>
            <ControlGroup>
              <Input
                type="password"
                id="password"
                label={
                  [ProviderOptionsEnum.BITBUCKET, ProviderOptionsEnum.AZURE_DEVOPS].includes(watch('provider'))
                    ? 'Password'
                    : 'Token'
                }
                {...register('password')}
                placeholder={
                  [ProviderOptionsEnum.BITBUCKET, ProviderOptionsEnum.AZURE_DEVOPS].includes(watch('provider'))
                    ? 'Enter your password'
                    : 'Enter your access token'
                }
                size="md"
                error={errors.password?.message?.toString()}
              />
            </ControlGroup>
          </Fieldset>

          <FormSeparator />

          {[ProviderOptionsEnum.GITLAB, ProviderOptionsEnum.GITLAB_SELF_HOSTED].includes(watch('provider')) && (
            <Fieldset className="mt-4">
              <Input
                id="group"
                label="Group"
                {...register('group')}
                placeholder="Enter the group name"
                size="md"
                error={errors.group?.message?.toString()}
              />
            </Fieldset>
          )}

          {watch('provider') === ProviderOptionsEnum.BITBUCKET && (
            <Fieldset className="mt-4">
              <Input
                id="workspace"
                label="Workspace"
                {...register('workspace')}
                placeholder="Enter the workspace name"
                size="md"
                error={errors.workspace?.message?.toString()}
              />
            </Fieldset>
          )}

          {/* organization */}
          {[
            ProviderOptionsEnum.GITHUB,
            ProviderOptionsEnum.GITHUB_ENTERPRISE,
            ProviderOptionsEnum.GITEA,
            ProviderOptionsEnum.GOGS,
            ProviderOptionsEnum.AZURE_DEVOPS
          ].includes(watch('provider')) && (
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
          )}

          {/* Project */}
          {[ProviderOptionsEnum.BITBUCKET_SERVER, ProviderOptionsEnum.AZURE_DEVOPS].includes(watch('provider')) && (
            <Fieldset className="mt-4">
              <Input
                id="project"
                label="Project"
                {...register('project')}
                placeholder="Enter the project name"
                size="md"
                error={errors.project?.message?.toString()}
              />
            </Fieldset>
          )}

          {/* authorization - pipelines */}
          <Fieldset>
            <ControlGroup className="flex flex-row gap-5">
              <Option
                control={<Checkbox {...register('repositories')} id="authorization" checked={true} disabled />}
                id="authorization"
                label="Repositories"
                className="mt-0 flex min-h-8 items-center"
              />
              <Option
                control={
                  <Checkbox
                    {...register('pipelines')}
                    id="pipelines"
                    checked={watch('pipelines')}
                    onCheckedChange={(checked: boolean) => setValue('pipelines', checked)}
                  />
                }
                id="pipelines"
                label="Pipelines"
                className="mt-0 flex min-h-8 items-center"
              />
            </ControlGroup>
          </Fieldset>

          {!!apiErrorsValue && <span className="text-xs text-cn-foreground-danger">{apiErrorsValue}</span>}
          {/* SUBMIT BUTTONS */}
          <Fieldset>
            <ControlGroup>
              <ButtonGroup>
                {/* TODO: Improve loading state to avoid flickering */}
                <Button type="submit" disabled={isLoading}>
                  {!isLoading ? 'Import repositories' : 'Importing repositories...'}
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
