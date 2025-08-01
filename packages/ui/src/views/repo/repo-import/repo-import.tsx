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
import { useTranslation } from '@/context'
import { SandboxLayout } from '@/views'
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
    provider: z.nativeEnum(ProviderOptionsEnum, { message: 'Please select a provider' }),
    password: z.string().optional(),
    organization: z.string().optional(),
    repository: z.string().min(1, { message: 'Please enter a repository' }),
    group: z.string().optional(),
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
        message: 'Please enter a organization'
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
        message: 'Please enter the Repository URL'
      })
    }
    if (data.provider === ProviderOptionsEnum.GITLAB && !data.group?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['group'],
        message: 'Please enter a Group'
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

export type ImportRepoFormFields = z.infer<typeof formSchema>

const providerOptions = Object.values(ProviderOptionsEnum).map(option => ({ value: option, label: option }))

interface RepoImportPageProps {
  onFormSubmit: (data: ImportRepoFormFields) => void
  onFormCancel: () => void
  isLoading: boolean
  apiErrorsValue?: string
}

export function RepoImportPage({ onFormSubmit, onFormCancel, isLoading, apiErrorsValue }: RepoImportPageProps) {
  const { t } = useTranslation()

  const formMethods = useForm<ImportRepoFormFields>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      pipelines: false,
      authorization: false,
      provider: ProviderOptionsEnum.GITHUB
    }
  })

  const { register, handleSubmit, setValue, watch } = formMethods

  const repositoryValue = watch('repository')

  useEffect(() => {
    setValue('identifier', repositoryValue)
  }, [repositoryValue, setValue])

  const onSubmit: SubmitHandler<ImportRepoFormFields> = data => {
    onFormSubmit(data)
  }

  const handleCancel = () => {
    onFormCancel()
  }
  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className="mx-auto w-[570px]">
        <Text variant="heading-section">{t('views:repos.importRepo', 'Import a repository')}</Text>
        <Spacer size={10} />
        <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
          {/* provider */}
          <FormInput.Select options={providerOptions} placeholder="Select" label="Provider" {...register('provider')} />

          {[
            ProviderOptionsEnum.GITHUB_ENTERPRISE,
            ProviderOptionsEnum.GITLAB_SELF_HOSTED,
            ProviderOptionsEnum.BITBUCKET_SERVER,
            ProviderOptionsEnum.GITEA,
            ProviderOptionsEnum.GOGS
          ].includes(watch('provider')) && (
            <Fieldset>
              <FormInput.Text id="hostUrl" label="Host URL" {...register('hostUrl')} placeholder="Enter the host URL" />
            </Fieldset>
          )}
          {[ProviderOptionsEnum.GITLAB, ProviderOptionsEnum.GITLAB_SELF_HOSTED].includes(watch('provider')) && (
            <Fieldset>
              <FormInput.Text id="group" label="Group" {...register('group')} placeholder="Enter the group name" />
            </Fieldset>
          )}

          {watch('provider') === ProviderOptionsEnum.BITBUCKET && (
            <Fieldset>
              <FormInput.Text
                id="workspace"
                label="Workspace"
                {...register('workspace')}
                placeholder="Enter the workspace name"
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
              <FormInput.Text
                id="organization"
                label="Organization"
                {...register('organization')}
                placeholder="Enter the organization name"
              />
            </Fieldset>
          )}
          {[ProviderOptionsEnum.BITBUCKET_SERVER, ProviderOptionsEnum.AZURE_DEVOPS].includes(watch('provider')) && (
            <Fieldset>
              <FormInput.Text
                id="project"
                label="Project"
                {...register('project')}
                placeholder="Enter the project name"
              />
            </Fieldset>
          )}
          {/* repository */}
          <Fieldset>
            <FormInput.Text
              id="repository"
              label="Repository"
              {...register('repository')}
              placeholder="Enter the repository name"
            />
          </Fieldset>

          {/* authorization - pipelines */}
          <Fieldset>
            <ControlGroup className="flex flex-row gap-5">
              <FormInput.Checkbox {...register('authorization')} id="authorization" label="Requires Authorization" />
              <FormInput.Checkbox {...register('pipelines')} id="pipelines" label="Import Pipelines" />
            </ControlGroup>
          </Fieldset>

          {/* token */}
          {watch('authorization') && (
            <FormInput.Text
              type="password"
              id="password"
              label="Token"
              {...register('password')}
              placeholder="Enter your access token"
            />
          )}

          <FormSeparator />

          {/* repo identifier */}
          <FormInput.Text
            id="identifier"
            label="Name"
            {...register('identifier')}
            placeholder="Enter repository name"
          />

          {/* description */}
          <FormInput.Textarea
            id="description"
            label="Description"
            {...register('description')}
            placeholder="Enter a description"
            optional
          />

          {!!apiErrorsValue && <span className="text-2 text-cn-foreground-danger">{apiErrorsValue}</span>}

          {/* SUBMIT BUTTONS */}
          <Fieldset className="mt-6">
            <ControlGroup>
              <ButtonLayout horizontalAlign="start">
                {/* TODO: Improve loading state to avoid flickering */}
                <Button type="submit" disabled={isLoading}>
                  {!isLoading ? 'Import repository' : 'Importing repository...'}
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
