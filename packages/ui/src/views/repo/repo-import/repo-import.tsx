import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import {
  Alert,
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
  Textarea
} from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { makeFloatValidationUtils, makeValidationUtils } from '@utils/validation'
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
  isProjectRequired: [ProviderOptionsEnum.BITBUCKET_SERVER, ProviderOptionsEnum.AZURE_DEVOPS].includes(provider)
})

const makeImportRepoFormSchema = (t: TranslationStore['t']) => {
  const { required, maxLength, specialSymbols, noSpaces } = makeValidationUtils(t)

  const getRepositoryValidation = (name: string) =>
    z
      .string()
      .trim()
      .nonempty(required(name))
      .max(...maxLength(100, name))
      .regex(...specialSymbols(name))
      .refine(...noSpaces(name))

  return z
    .object({
      identifier: getRepositoryValidation(t('views:repos.importRepo.repositoryNameLabel')),
      hostUrl: z.string().trim().optional(),
      description: z.string().trim().optional(),
      pipelines: z.boolean().optional(),
      authorization: z.boolean().optional(),
      provider: z.nativeEnum(ProviderOptionsEnum, { message: required(t('views:repos.importRepo.providerLabel')) }),
      password: z.string().trim().optional(),
      organization: z.string().optional(),
      repository: getRepositoryValidation(t('views:repos.importRepo.repositoryLabel')),
      group: z.string().trim().optional(),
      workspace: z.string().trim().optional(),
      project: z.string().trim().optional()
    })
    .superRefine(({ hostUrl, provider, organization, group, workspace, project }, ctx) => {
      const { isGitlab, isBitbucket, isHostUrlRequired, isProjectRequired, isOrganizationRequired } =
        checkProvider(provider)

      const makeValidators = makeFloatValidationUtils(t, ctx)

      if (isOrganizationRequired) {
        const { noSpacesFloat, requiredFloat } = makeValidators({
          value: organization,
          path: 'organization',
          name: t('views:repos.importRepo.organizationLabel')
        })
        requiredFloat()
        noSpacesFloat()
      }

      if (isHostUrlRequired) {
        const { requiredFloat, urlFloat } = makeValidators({
          value: hostUrl,
          path: 'hostUrl',
          name: t('views:repos.importRepo.hostLabel')
        })
        requiredFloat()
        urlFloat()
      }

      if (isBitbucket) {
        const { requiredFloat, noSpacesFloat } = makeValidators({
          value: workspace,
          path: 'workspace',
          name: t('views:repos.importRepo.workspaceLabel')
        })
        requiredFloat()
        noSpacesFloat()
      }

      if (isGitlab) {
        const { requiredFloat, noSpacesFloat } = makeValidators({
          value: group,
          path: 'group',
          name: t('views:repos.importRepo.groupLabel')
        })
        requiredFloat()
        noSpacesFloat()
      }

      if (isProjectRequired) {
        const { requiredFloat, noSpacesFloat } = makeValidators({
          value: project,
          path: 'project',
          name: t('views:repos.importRepo.projectLabel')
        })
        requiredFloat()
        noSpacesFloat()
      }
    })
}

export type ImportRepoFormFields = z.infer<ReturnType<typeof makeImportRepoFormSchema>>

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
    trigger,
    formState: { errors }
  } = useForm<ImportRepoFormFields>({
    resolver: zodResolver(makeImportRepoFormSchema(t)),
    mode: 'onChange',
    defaultValues: {
      pipelines: false,
      authorization: false,
      provider: ProviderOptionsEnum.GITHUB
    }
  })

  const providerValue = watch('provider')
  const pipelinesValue = watch('pipelines')
  const repositoryValue = watch('repository')
  const authorizationValue = watch('authorization')
  const { isGitlab, isBitbucket, isHostUrlRequired, isProjectRequired, isOrganizationRequired } = useMemo(
    () => checkProvider(providerValue),
    [providerValue]
  )

  useEffect(() => {
    setValue('identifier', repositoryValue)

    if (!errors.repository) return

    trigger('identifier')
  }, [repositoryValue, trigger, errors.repository])

  const handleSelectChange = (fieldName: keyof ImportRepoFormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content paddingClassName="w-[570px] mx-auto pt-11 pb-20">
        <h1 className="text-24 text-foreground-1 mb-10 font-medium">
          {t('views:repos.importRepo.importTitle', 'Import a repository')}
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

          <Input
            id="repository"
            label={t('views:repos.importRepo.repositoryLabel', 'Repository')}
            {...register('repository')}
            placeholder={t('views:repos.importRepo.repositoryPlaceholder', 'Enter the repository name')}
            size="md"
            error={errors.repository?.message?.toString()}
          />

          <Fieldset className="flex-row gap-5" legend="Import options">
            <Option
              control={
                <Checkbox
                  {...register('authorization')}
                  id="authorization"
                  checked={authorizationValue}
                  onCheckedChange={(checked: boolean) => setValue('authorization', checked)}
                />
              }
              id="authorization"
              label={t('views:repos.importRepo.authorizationOption', 'Authorization')}
              className="mt-0 flex min-h-8 items-center"
            />
            <Option
              control={
                <Checkbox
                  {...register('pipelines')}
                  id="pipelines"
                  checked={pipelinesValue}
                  onCheckedChange={(checked: boolean) => setValue('pipelines', checked)}
                />
              }
              id="pipelines"
              label={t('views:repos.importRepo.importPipelinesOption', 'Import Pipelines')}
              className="mt-0 flex min-h-8 items-center"
            />
          </Fieldset>

          {authorizationValue && (
            <Input
              type="password"
              id="password"
              label={t('views:repos.importRepo.accessInput.tokenLabel', 'Token')}
              {...register('password')}
              placeholder={t('views:repos.importRepo.accessInput.tokenPlaceholder', 'Enter your access token')}
              size="md"
              error={errors.password?.message?.toString()}
            />
          )}

          <FormSeparator />

          <Input
            id="identifier"
            label={t('views:repos.importRepo.repositoryNameLabel', 'Repository name')}
            {...register('identifier')}
            placeholder={t('views:repos.importRepo.repositoryNamePlaceholder', 'Enter the repository name')}
            size="md"
            error={errors.identifier?.message?.toString()}
          />

          <Textarea
            id="description"
            label={t('views:repos.importRepo.repositoryDescriptionLabel', 'Description')}
            {...register('description')}
            placeholder={t(
              'views:repos.importRepo.repositoryDescriptionPlaceholder',
              'Enter the repository description'
            )}
            error={errors.description?.message?.toString()}
            optional
          />

          {!!apiErrorsValue && (
            <Alert.Container closable variant="destructive">
              <Alert.Title>{apiErrorsValue}</Alert.Title>
            </Alert.Container>
          )}

          <ButtonGroup className="mt-6">
            <Button type="submit" disabled={isLoading}>
              {!isLoading
                ? t('views:repos.importRepo.importButton.import', 'Import repository')
                : t('views:repos.importRepo.importButton.importing', 'Importing repository...')}
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
