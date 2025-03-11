import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'

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
  toast
} from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { ProviderOptionsEnum } from './types'

const checkProvider = (provider: ProviderOptionsEnum) => ({
  isOrganizationRequired: [
    ProviderOptionsEnum.GITHUB,
    ProviderOptionsEnum.GITHUB_ENTERPRISE,
    ProviderOptionsEnum.GITEA,
    ProviderOptionsEnum.GOGS,
    ProviderOptionsEnum.AZURE_DEVOPS
  ].includes(provider),
  isGitlab: [ProviderOptionsEnum.GITLAB, ProviderOptionsEnum.GITLAB_SELF_HOSTED].includes(provider),
  isBitbucket: [ProviderOptionsEnum.BITBUCKET].includes(provider),
  isHostUrlRequired: [
    ProviderOptionsEnum.GITHUB_ENTERPRISE,
    ProviderOptionsEnum.GITLAB_SELF_HOSTED,
    ProviderOptionsEnum.BITBUCKET_SERVER,
    ProviderOptionsEnum.GITEA,
    ProviderOptionsEnum.GOGS
  ].includes(provider),
  isProjectRequired: [ProviderOptionsEnum.BITBUCKET_SERVER, ProviderOptionsEnum.AZURE_DEVOPS].includes(provider),
  isAuthorizationRequired: [ProviderOptionsEnum.BITBUCKET, ProviderOptionsEnum.AZURE_DEVOPS].includes(provider)
})

const makeImportMultipleReposFormSchema = (t: TranslationStore['t']) =>
  z
    .object({
      hostUrl: z.string().trim().optional(),
      pipelines: z.boolean().optional(),
      repositories: z.boolean().optional(),
      provider: z.nativeEnum(ProviderOptionsEnum, {
        message: t('views:repos.importRepo.validation.providerNoEmpty', 'Please select a provider')
      }),
      password: z.string().trim().optional(),
      organization: z.string().trim().optional(),
      group: z.string().trim().optional(),
      username: z.string().trim().optional(),
      workspace: z.string().trim().optional(),
      project: z.string().trim().optional()
    })
    .superRefine(({ hostUrl, provider, organization, group, workspace, project }, ctx) => {
      const { isGitlab, isBitbucket, isHostUrlRequired, isProjectRequired, isOrganizationRequired } =
        checkProvider(provider)

      if (isOrganizationRequired && !organization) {
        ctx.addIssue({
          code: 'custom',
          path: ['organization'],
          message: t('views:repos.importRepo.validation.organizationNoEmpty', 'Please enter an organization name')
        })
      }

      if (isBitbucket && !workspace) {
        ctx.addIssue({
          code: 'custom',
          path: ['workspace'],
          message: t('views:repos.importRepo.validation.workspaceNoEmpty', 'Please enter a Workspace')
        })
      }

      if (isGitlab && !group) {
        ctx.addIssue({
          code: 'custom',
          path: ['group'],
          message: t('views:repos.importRepo.validation.groupNoEmpty', 'Please enter a Group')
        })
      }

      if (isHostUrlRequired) {
        if (!hostUrl) {
          ctx.addIssue({
            code: 'custom',
            path: ['hostUrl'],
            message: t('views:repos.importRepo.validation.hostUrlNoEmpty', 'Please enter a Host URL')
          })
        } else {
          try {
            new URL(hostUrl)
          } catch (error) {
            ctx.addIssue({
              code: 'custom',
              path: ['hostUrl'],
              message: t('views:repos.importRepo.validation.hostUrlInvalid', 'Invalid URL')
            })
          }
        }
      }

      if (isProjectRequired && !project) {
        ctx.addIssue({
          code: 'custom',
          path: ['project'],
          message: t('views:repos.importRepo.validation.projectNoEmpty', 'Please enter a Project')
        })
      }
    })

export type ImportMultipleReposFormFields = z.infer<ReturnType<typeof makeImportMultipleReposFormSchema>>

interface RepoImportMultiplePageProps {
  onFormSubmit: (data: ImportMultipleReposFormFields) => void
  onFormCancel: () => void
  isLoading: boolean
  apiErrorsValue?: string
  useTranslationStore: () => TranslationStore
}

export function RepoImportMultiplePage({
  onFormSubmit,
  onFormCancel,
  isLoading,
  apiErrorsValue,
  useTranslationStore
}: RepoImportMultiplePageProps) {
  const { t } = useTranslationStore()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<ImportMultipleReposFormFields>({
    resolver: zodResolver(makeImportMultipleReposFormSchema(t)),
    mode: 'onChange',
    defaultValues: {
      pipelines: false,
      repositories: true,
      provider: ProviderOptionsEnum.GITHUB
    }
  })

  const providerValue = watch('provider')
  const {
    isGitlab,
    isBitbucket,
    isHostUrlRequired,
    isProjectRequired,
    isOrganizationRequired,
    isAuthorizationRequired
  } = useMemo(() => checkProvider(providerValue), [providerValue])

  const handleSelectChange = (fieldName: keyof ImportMultipleReposFormFields, value: string) => {
    if (fieldName === 'provider') {
      reset({ provider: value as ProviderOptionsEnum, repositories: true, pipelines: false })
    } else {
      setValue(fieldName, value, { shouldValidate: true })
    }
  }

  /**
   * Show an unexpected server error message
   * Ensure that validation errors are handled by the react-hook-form
   */
  useEffect(() => {
    if (!apiErrorsValue) return

    toast({ title: apiErrorsValue, variant: 'destructive' })
  }, [apiErrorsValue])

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content key={providerValue} paddingClassName="w-[570px] mx-auto pt-11 pb-20">
        <h1 className="text-24 text-foreground-1 mb-10 font-medium">
          {t('views:repos.importRepo.importMultipleTitle', 'Import Repositories')}
        </h1>

        <FormWrapper onSubmit={handleSubmit(onFormSubmit)}>
          <ControlGroup>
            <Select.Root
              name="provider"
              value={providerValue}
              onValueChange={value => handleSelectChange('provider', value)}
              placeholder={t('views:repos.importRepo.providerPlaceholder', 'Select')}
              label={t('views:repos.importRepo.providerLabel', 'Git provider')}
            >
              <Select.Content>
                {Object.values(ProviderOptionsEnum).map(option => (
                  <Select.Item key={option} value={option}>
                    {option}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </ControlGroup>

          {isHostUrlRequired && (
            <Input
              id="host"
              label={t('views:repos.importRepo.hostLabel', 'Host URL')}
              {...register('hostUrl')}
              placeholder={t('views:repos.importRepo.hostPlaceholder', 'Enter the host URL')}
              size="md"
              error={errors.hostUrl?.message?.toString()}
            />
          )}

          {isAuthorizationRequired && (
            <Input
              id="username"
              label={t('views:repos.importRepo.usernameLabel', 'Username')}
              {...register('username')}
              placeholder={t('views:repos.importRepo.usernamePlaceholder', 'Enter your username')}
              size="md"
              error={errors.password?.message?.toString()}
            />
          )}

          <Input
            type="password"
            id="password"
            label={
              isAuthorizationRequired
                ? t('views:repos.importRepo.accessInput.passwordLabel', 'Password')
                : t('views:repos.importRepo.accessInput.tokenLabel', 'Token')
            }
            {...register('password')}
            placeholder={
              isAuthorizationRequired
                ? t('views:repos.importRepo.accessInput.passwordPlaceholder', 'Enter your password')
                : t('views:repos.importRepo.accessInput.tokenPlaceholder', 'Enter your access token')
            }
            size="md"
            error={errors.password?.message?.toString()}
          />

          <FormSeparator />

          {isGitlab && (
            <Input
              className="mt-4"
              id="group"
              label={t('views:repos.importRepo.groupLabel', 'Group')}
              {...register('group')}
              placeholder={t('views:repos.importRepo.groupPlaceholder', 'Enter the group name')}
              size="md"
              error={errors.group?.message?.toString()}
            />
          )}

          {isBitbucket && (
            <Input
              className="mt-4"
              id="workspace"
              label={t('views:repos.importRepo.workspaceLabel', 'Workspace')}
              {...register('workspace')}
              placeholder={t('views:repos.importRepo.workspacePlaceholder', 'Enter the workspace name')}
              size="md"
              error={errors.workspace?.message?.toString()}
            />
          )}

          {isOrganizationRequired && (
            <Input
              id="organization"
              label={t('views:repos.importRepo.organizationLabel', 'Organization')}
              {...register('organization')}
              placeholder={t('views:repos.importRepo.organizationPlaceholder', 'Enter the organization name')}
              size="md"
              error={errors.organization?.message?.toString()}
            />
          )}

          {isProjectRequired && (
            <Input
              className="mt-4"
              id="project"
              label={t('views:repos.importRepo.projectLabel', 'Project')}
              {...register('project')}
              placeholder={t('views:repos.importRepo.projectPlaceholder', 'Enter the project name')}
              size="md"
              error={errors.project?.message?.toString()}
            />
          )}

          <Fieldset className="flex-row gap-5" legend="What do you want to import?">
            <Option
              control={<Checkbox {...register('repositories')} id="authorization" checked={true} disabled />}
              id="authorization"
              label={t('views:repos.importRepo.repositoriesOption', 'Repositories')}
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
              label={t('views:repos.importRepo.pipelinesOption', 'Pipelines')}
              className="mt-0 flex min-h-8 items-center"
            />
          </Fieldset>

          <ButtonGroup className="mt-6">
            <Button type="submit" disabled={isLoading}>
              {!isLoading
                ? t('views:repos.importRepo.importMultipleButton.import', 'Import repositories')
                : t('views:repos.importRepo.importMultipleButton.importing', 'Importing repositories...')}
            </Button>
            <Button type="button" variant="outline" onClick={onFormCancel}>
              {t('views:repos.importRepo.cancelButton', 'Cancel')}
            </Button>
          </ButtonGroup>
        </FormWrapper>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
