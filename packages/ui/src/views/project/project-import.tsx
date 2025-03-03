import { useEffect } from 'react'
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
  Select
} from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProviderOptionsEnum } from '@views/repo/repo-import/types'
import { z } from 'zod'

const makeImportProjectFormSchema = (t: TranslationStore['t']) =>
  z
    .object({
      identifier: z
        .string()
        .max(100, {
          message: t('views:importProject.validation.nameMax', 'Name must be no longer than 100 characters')
        })
        .regex(/^[a-zA-Z0-9._-\s]+$/, {
          message: t(
            'views:importProject.validation.nameRegex',
            'Name must contain only letters, numbers, and the characters: - _ .'
          )
        })
        .refine(data => !data.includes(' '), {
          message: t('views:importProject.validation.nameNoSpaces', 'Name cannot contain spaces')
        }),
      description: z.string().max(1024, {
        message: t(
          'views:importProject.validation.descriptionMax',
          'Description must be no longer than 1024 characters'
        )
      }),
      hostUrl: z.string().optional(),
      pipelines: z.boolean().optional(),
      repositories: z.boolean().optional(),
      provider: z.string().min(1, { message: 'Please select a provider' }),
      password: z.string().optional(),
      organization: z
        .string()
        .min(1, { message: 'Please enter an organization' })
        .max(100, {
          message: t(
            'views:importProject.validation.organizationNameMax',
            'Organization name must be no longer than 100 characters'
          )
        })
        .regex(/^[a-zA-Z0-9._-\s]+$/, {
          message: t(
            'views:importProject.validation.nameRegex',
            'Organization name must contain only letters, numbers, and the characters: - _ .'
          )
        })
        .refine(data => !data.includes(' '), {
          message: t('views:importProject.validation.noSpaces', 'Organization name cannot contain spaces')
        })
    })
    .superRefine((data, ctx) => {
      if (data.provider !== ProviderOptionsEnum.GITHUB_ENTERPRISE) return

      if (!data.hostUrl) {
        ctx.addIssue({
          code: 'custom',
          path: ['hostUrl'],
          message: t('views:importProject.validation.hostUrlRequired', 'Repository URL is required')
        })
        return
      }

      try {
        new URL(data.hostUrl)
      } catch (error) {
        ctx.addIssue({
          code: 'custom',
          path: ['hostUrl'],
          message: t('views:importProject.validation.hostUrlInvalid', 'Invalid URL')
        })
      }
    })

export type ImportProjectFormFields = z.infer<ReturnType<typeof makeImportProjectFormSchema>>

interface ImportProjectPageProps {
  onFormSubmit: (data: ImportProjectFormFields) => void
  onFormCancel: () => void
  isLoading: boolean
  apiErrorsValue?: string
  useTranslationStore: () => TranslationStore
}

export function ImportProjectPage({
  onFormSubmit,
  onFormCancel,
  isLoading,
  apiErrorsValue,
  useTranslationStore
}: ImportProjectPageProps) {
  const { t } = useTranslationStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ImportProjectFormFields>({
    resolver: zodResolver(makeImportProjectFormSchema(t)),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      description: '',
      pipelines: false,
      repositories: true,
      provider: ProviderOptionsEnum.GITHUB,
      password: '',
      organization: ''
    }
  })

  const providerValue = watch('provider')
  const orgValue = watch('organization')
  const pipelinesValue = watch('pipelines')

  useEffect(() => {
    setValue('identifier', orgValue)
  }, [orgValue, setValue])

  const handleSelectProvider = (value: string) => setValue('provider', value, { shouldValidate: true })

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content paddingClassName="w-[570px] mx-auto pt-11 pb-20">
        <h1 className="mb-10 mt-5 text-2xl font-medium tracking-tight text-foreground-1">
          {t('views:importProject.title', 'Import a project')}
        </h1>

        <FormWrapper onSubmit={handleSubmit(onFormSubmit)}>
          <Fieldset legend="Git provider data">
            <ControlGroup>
              <Select.Root
                name="provider"
                value={providerValue}
                onValueChange={handleSelectProvider}
                placeholder={t('views:importProject.gitProviderPlaceholder', 'Select provider')}
                label={t('views:importProject.gitProviderLabel', 'Git provider')}
              >
                <Select.Content>
                  {Object.values(ProviderOptionsEnum)?.map(option => {
                    const isDisabled =
                      option !== ProviderOptionsEnum.GITHUB && option !== ProviderOptionsEnum.GITHUB_ENTERPRISE

                    return (
                      <Select.Item key={option} value={option} disabled={isDisabled}>
                        {option}
                      </Select.Item>
                    )
                  })}
                </Select.Content>
              </Select.Root>
            </ControlGroup>

            {providerValue === ProviderOptionsEnum.GITHUB_ENTERPRISE && (
              <Input
                id="host"
                label={t('views:importProject.hostUrlLabel', 'Host URL')}
                {...register('hostUrl')}
                placeholder={t('views:importProject.hostUrlPlaceholder', 'Enter the host URL')}
                size="md"
                error={errors.hostUrl?.message?.toString()}
              />
            )}

            <Input
              type="password"
              id="password"
              label={t('views:importProject.tokenLabel', 'Token')}
              {...register('password')}
              placeholder={t('views:importProject.tokenPlaceholder', 'Enter your access token')}
              size="md"
              error={errors.password?.message?.toString()}
            />
          </Fieldset>

          <FormSeparator />

          <Fieldset legend="Organization import data">
            <Input
              id="organization"
              label={t('views:importProject.organizationLabel', 'Organization')}
              {...register('organization')}
              placeholder={t('views:importProject.organizationPlaceholder', 'Enter the organization name')}
              size="md"
              error={errors.organization?.message?.toString()}
            />

            <div className="flex gap-5">
              <Option
                control={<Checkbox {...register('repositories')} id="authorization" checked disabled />}
                id="authorization"
                label={t('views:importProject.repositoriesLabel', 'Repositories')}
                disabled
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
                label={t('views:importProject.pipelinesLabel', 'Import Pipelines')}
              />
            </div>
          </Fieldset>

          <FormSeparator />

          <Fieldset legend="Project data">
            <Input
              id="identifier"
              label={t('views:importProject.projectNameLabel', 'Name')}
              {...register('identifier')}
              placeholder={t('views:importProject.projectNamePlaceholder', 'Enter repository name')}
              size="md"
              error={errors.identifier?.message?.toString()}
            />

            <Input
              id="description"
              label={t('views:importProject.descriptionLabel', 'Description')}
              {...register('description')}
              placeholder={t('views:importProject.descriptionPlaceholder', 'Enter a description')}
              size="md"
              error={errors.description?.message?.toString()}
            />
          </Fieldset>

          {!!apiErrorsValue && <span className="text-xs text-destructive">{apiErrorsValue}</span>}

          <Fieldset legend="Form actions">
            <ButtonGroup>
              <Button type="submit" disabled={isLoading}>
                {!isLoading
                  ? t('views:importProject.importButton.default', 'Import project')
                  : t('views:importProject.importButton.importing', 'Importing project...')}
              </Button>
              <Button type="button" variant="outline" onClick={onFormCancel}>
                {t('views:importProject.cancelButton', 'Cancel')}
              </Button>
            </ButtonGroup>
          </Fieldset>
        </FormWrapper>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
