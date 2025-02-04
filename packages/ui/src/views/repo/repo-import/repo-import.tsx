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
  Option,
  Select,
  SelectContent,
  SelectItem,
  Spacer,
  Text,
  Textarea
} from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { ProviderOptionsEnum } from './types'

const formSchema = z
  .object({
    identifier: z.string(),
    hostUrl: z.string().optional(),
    description: z.string(),
    pipelines: z.boolean().optional(),
    authorization: z.boolean().optional(),
    provider: z.string().min(1, { message: 'Please select a provider' }),
    password: z.string().optional(),
    organization: z.string().optional(),
    repository: z.string().min(1, { message: 'Please enter a repository' }),
    group: z.string().optional(),
    workspace: z.string().optional(),
    project: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (
      (data.provider === 'Github' && !data.organization) ||
      (data.provider === 'Github Enterprise' && !data.organization) ||
      (data.provider === 'Gitea' && !data.organization) ||
      (data.provider === 'Gogs' && !data.organization)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['organization'],
        message: 'Please enter a organization'
      })
    }
    if (
      (data.provider === 'Github Enterprise' && !data.hostUrl) ||
      (data.provider === 'Gitlab Self Hosted' && !data.hostUrl) ||
      (data.provider === 'Bitbucket Server' && !data.hostUrl) ||
      (data.provider === 'Gitea' && !data.hostUrl) ||
      (data.provider === 'Gogs' && !data.hostUrl)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['hostUrl'],
        message: 'Repository URL is required'
      })
    }
    if (data.provider === 'Gitlab' && !data.group) {
      ctx.addIssue({
        code: 'custom',
        path: ['group'],
        message: 'Group is required'
      })
    }
    if (data.provider === 'Bitbucket' && !data.workspace) {
      ctx.addIssue({
        code: 'custom',
        path: ['workspace'],
        message: 'Workspace is required'
      })
    }
    if (
      (data.provider === 'Bitbucket Server' && !data.project) ||
      (data.provider === 'Azure DevOps' && !data.project)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['project'],
        message: 'Project is required'
      })
    }
  })

export type ImportRepoFormFields = z.infer<typeof formSchema>

interface RepoImportPageProps {
  onFormSubmit: (data: ImportRepoFormFields) => void
  onFormCancel: () => void
  isLoading: boolean
  apiErrorsValue?: string
  useTranslationStore: () => TranslationStore
}

export function RepoImportPage({
  onFormSubmit,
  onFormCancel,
  isLoading,
  apiErrorsValue,
  useTranslationStore
}: RepoImportPageProps) {
  const { t } = useTranslationStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ImportRepoFormFields>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      description: '',
      pipelines: false,
      authorization: false,
      provider: 'Github',
      password: '',
      organization: '',
      repository: '',
      group: ''
    }
  })

  const providerValue = watch('provider')
  const repositoryValue = watch('repository')

  useEffect(() => {
    setValue('identifier', repositoryValue)
  }, [repositoryValue, setValue])

  const handleSelectChange = (fieldName: keyof ImportRepoFormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  const onSubmit: SubmitHandler<ImportRepoFormFields> = data => {
    onFormSubmit(data)
  }

  const handleCancel = () => {
    onFormCancel()
  }
  console.log(errors)
  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content paddingClassName="w-[570px] mx-auto pt-11 pb-20">
        <Spacer size={5} />
        <Text className="tracking-tight" size={5} weight="medium">
          {t('views:repos.importRepo', 'Import a repository')}
        </Text>
        <Spacer size={10} />
        <FormWrapper className="gap-y-7" onSubmit={handleSubmit(onSubmit)}>
          {/* provider */}
          <Fieldset>
            <ControlGroup>
              <Select
                name="provider"
                value={providerValue}
                onValueChange={value => handleSelectChange('provider', value)}
                placeholder="Select"
                label="Provider"
              >
                <SelectContent>
                  {ProviderOptionsEnum &&
                    Object.values(ProviderOptionsEnum)?.map(option => {
                      return (
                        <SelectItem
                          key={option}
                          value={option}
                          // disabled={
                          //   option !== ProviderOptionsEnum.GITHUB && option !== ProviderOptionsEnum.GITHUB_ENTERPRISE
                          // }
                        >
                          {option}
                        </SelectItem>
                      )
                    })}
                </SelectContent>
              </Select>
            </ControlGroup>
          </Fieldset>

          {(watch('provider') === ProviderOptionsEnum.GITHUB_ENTERPRISE ||
            watch('provider') === ProviderOptionsEnum.GITLAB_SELF_HOSTED ||
            watch('provider') === ProviderOptionsEnum.BITBUCKET_SERVER ||
            watch('provider') === ProviderOptionsEnum.GITEA ||
            watch('provider') === ProviderOptionsEnum.GOGS) && (
            <Fieldset className="mt-4">
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
          {(watch('provider') === ProviderOptionsEnum.GITLAB ||
            watch('provider') === ProviderOptionsEnum.GITLAB_SELF_HOSTED) && (
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
          {(watch('provider') === ProviderOptionsEnum.GITHUB ||
            watch('provider') === ProviderOptionsEnum.GITHUB_ENTERPRISE ||
            watch('provider') === ProviderOptionsEnum.GITEA ||
            watch('provider') === ProviderOptionsEnum.GOGS ||
            watch('provider') === ProviderOptionsEnum.AZURE_DEVOPS) && (
            <Fieldset className="mt-4">
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
          {(watch('provider') === ProviderOptionsEnum.BITBUCKET_SERVER ||
            watch('provider') === ProviderOptionsEnum.AZURE_DEVOPS) && (
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
          {/* repository */}
          <Fieldset className="mt-4">
            <Input
              id="repository"
              label="Repository"
              {...register('repository')}
              placeholder="Enter the repository name"
              size="md"
              error={errors.repository?.message?.toString()}
            />
          </Fieldset>

          {/* authorization - pipelines */}
          <Fieldset className="mt-4">
            <ControlGroup className="flex flex-row gap-5">
              <Option
                control={
                  <Checkbox
                    {...register('authorization')}
                    id="authorization"
                    checked={watch('authorization')}
                    onCheckedChange={(checked: boolean) => setValue('authorization', checked)}
                  />
                }
                id="authorization"
                label="Requires Authorization"
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
                label="Import Pipelines"
                className="mt-0 flex min-h-8 items-center"
              />
            </ControlGroup>
          </Fieldset>

          {/* token */}
          {watch('authorization') && (
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
          )}

          <FormSeparator />

          {/* repo identifier */}
          <Fieldset className="mt-4">
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
          <Fieldset className="mt-4">
            <ControlGroup>
              <Textarea
                id="description"
                label="Description"
                {...register('description')}
                placeholder="Enter a description"
                error={errors.description?.message?.toString()}
                optional
              />
            </ControlGroup>
          </Fieldset>

          {!!apiErrorsValue && <span className="text-xs text-destructive">{apiErrorsValue}</span>}

          {/* SUBMIT BUTTONS */}
          <Fieldset className="mt-6">
            <ControlGroup>
              <ButtonGroup>
                {/* TODO: Improve loading state to avoid flickering */}
                <Button type="submit" disabled={isLoading}>
                  {!isLoading ? 'Import repository' : 'Importing repository...'}
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
