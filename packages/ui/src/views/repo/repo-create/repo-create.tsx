import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import {
  Alert,
  Button,
  ButtonGroup,
  Checkbox,
  ControlGroup,
  Fieldset,
  FormWrapper,
  Input,
  Label,
  Message,
  MessageTheme,
  Option,
  RadioButton,
  RadioGroup,
  Select,
  StyledLink,
  Textarea
} from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Define the form schema with optional fields for gitignore and license
const makeRepoCreateFormSchema = (t: TranslationStore['t']) =>
  z.object({
    name: z
      .string()
      .trim()
      .nonempty(t('views:repos.repoCreate.validation.nameNoEmpty', 'Name can’t be blank'))
      .max(100, t('views:repos.repoCreate.validation.nameMax', 'Name must be no longer than 100 characters'))
      .regex(
        /^[a-zA-Z0-9._-\s]+$/,
        t(
          'views:repos.repoCreate.validation.nameRegex',
          'Name must contain only letters, numbers, and the characters: - _ .'
        )
      )
      .refine(
        data => !data.includes(' '),
        t('views:repos.repoCreate.validation.nameNoSpaces', 'Name cannot contain spaces')
      ),
    description: z
      .string()
      .max(
        1024,
        t('views:repos.repoCreate.validation.descriptionMax', 'Description must be no longer than 1024 characters')
      ),
    gitignore: z.string().optional(),
    license: z.string().optional(),
    access: z.enum(['1', '2'], {
      errorMap: () => ({ message: t('views:repos.repoCreate.validation.access', 'Please select who has access') })
    }),
    readme: z.boolean()
  })

export type RepoCreateFormFields = z.infer<ReturnType<typeof makeRepoCreateFormSchema>>

interface RepoCreatePageProps {
  onFormSubmit: (data: RepoCreateFormFields) => void
  onFormCancel: () => void
  isLoading: boolean
  isSuccess: boolean
  gitIgnoreOptions?: string[]
  licenseOptions?: { value?: string; label?: string }[]
  useTranslationStore: () => TranslationStore
  apiError?: string
}

export function RepoCreatePage({
  onFormSubmit,
  onFormCancel,
  isLoading,
  isSuccess,
  gitIgnoreOptions,
  licenseOptions,
  useTranslationStore,
  apiError
}: RepoCreatePageProps) {
  const { t } = useTranslationStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<RepoCreateFormFields>({
    resolver: zodResolver(makeRepoCreateFormSchema(t)),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      gitignore: '',
      license: '',
      access: '2',
      readme: false
    }
  })

  const accessValue = watch('access')
  const gitignoreValue = watch('gitignore')
  const licenseValue = watch('license')
  const readmeValue = watch('readme')

  const handleSelectChange = (fieldName: keyof RepoCreateFormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  const handleAccessChange = (value: '1' | '2') => {
    setValue('access', value, { shouldValidate: true })
  }

  const handleReadmeChange = (value: boolean) => {
    setValue('readme', value, { shouldValidate: true })
  }

  useEffect(() => {
    if (isSuccess) {
      reset()
    }
  }, [isSuccess, reset])

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content paddingClassName="w-[570px] mx-auto pt-11 pb-20">
        <h1 className="text-24 text-foreground-1 mb-2.5 font-medium">
          {t('views:repos.repoCreate.title', 'Create a new repository')}
        </h1>

        <p className="text-foreground-2 mb-10 max-w-[476px] text-sm">
          {t(
            'views:repos.repoCreate.description',
            'A repository contains all project files, including the revision history. Already have a project repository elsewhere?'
          )}{' '}
          <StyledLink to="../import" relative="path">
            {t('views:repos.repoCreate.importRepo', 'Import a repository')}.
          </StyledLink>
        </p>

        <FormWrapper className="gap-y-7" onSubmit={handleSubmit(onFormSubmit)}>
          <Fieldset legend="Repository details">
            <Input
              id="name"
              label={t('views:repos.repoCreate.nameLabel', 'Name')}
              {...register('name')}
              placeholder={t('views:repos.repoCreate.namePlaceholder', 'Enter repository name')}
              size="md"
              error={errors.name?.message?.toString()}
              autoFocus
            />
            <Textarea
              id="description"
              {...register('description')}
              placeholder={t('views:repos.repoCreate.descriptionPlaceholder', 'Enter a description of this repository')}
              label={t('views:repos.repoCreate.descriptionLabel', 'Description')}
              error={errors.description?.message?.toString()}
              optional
            />
          </Fieldset>

          <Fieldset legend="Optional settings">
            <ControlGroup>
              <Select.Root
                name="gitignore"
                value={gitignoreValue}
                onValueChange={value => handleSelectChange('gitignore', value)}
                placeholder={t('views:repos.repoCreate.gitignorePlaceholder', 'Select')}
                label={t('views:repos.repoCreate.gitignoreLabel', 'Add .gitignore')}
                error={errors.gitignore?.message?.toString()}
                caption={t(
                  'views:repos.repoCreate.gitignoreCaption',
                  'Choose which files not to track from a list of templates.'
                )}
              >
                <Select.Content>
                  {gitIgnoreOptions?.map(option => (
                    <Select.Item key={option} value={option}>
                      {option}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </ControlGroup>

            <ControlGroup>
              <Select.Root
                name="license"
                value={licenseValue}
                onValueChange={value => handleSelectChange('license', value)}
                placeholder={t('views:repos.repoCreate.licensePlaceholder', 'Select')}
                label={t('views:repos.repoCreate.licenseLabel', 'Choose a license')}
                error={errors.license?.message?.toString()}
                caption={t(
                  'views:repos.repoCreate.licenseCaption',
                  "A license tells others what they can and can't do with your code."
                )}
              >
                <Select.Content>
                  {licenseOptions?.map(option => (
                    <Select.Item key={option.value} value={option.value ?? ''}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </ControlGroup>
          </Fieldset>

          <Fieldset className="mt-4 gap-y-0">
            <legend className="text-foreground-2 text-sm font-normal leading-none">
              {t('views:repos.repoCreate.access.legend', 'Who has access')}
            </legend>

            <RadioGroup className="mt-6" value={accessValue} onValueChange={handleAccessChange} id="access">
              <Option
                control={<RadioButton className="mt-px" value="1" id="access-public" />}
                id="access-public"
                label={t('views:repos.repoCreate.access.publicOptionLabel', 'Public')}
                aria-selected={accessValue === '1'}
                description={t(
                  'views:repos.repoCreate.access.publicOptionDescription',
                  'Anyone with access to the Gitness environment can clone this repo.'
                )}
              />
              <Option
                control={<RadioButton className="mt-px" value="2" id="access-private" />}
                id="access-private"
                label={t('views:repos.repoCreate.access.privateOptionLabel', 'Private')}
                aria-selected={accessValue === '2'}
                description={t(
                  'views:repos.repoCreate.access.privateOptionDescription',
                  'You choose who can see and commit to this repository.'
                )}
              />
            </RadioGroup>

            {errors.access && (
              <Message className="mt-0.5" theme={MessageTheme.ERROR}>
                {errors.access.message?.toString()}
              </Message>
            )}
          </Fieldset>

          <ControlGroup className="mt-4">
            <Label color="secondary" htmlFor="readme">
              {t('views:repos.repoCreate.initialize.label', 'Initialize this repository with')}
            </Label>

            <Option
              className="mt-6"
              control={<Checkbox id="readme" checked={readmeValue} onCheckedChange={handleReadmeChange} />}
              id="readme"
              label={t('views:repos.repoCreate.initialize.readmeLabel', 'Add a README file')}
              aria-selected={accessValue === '1'}
              description={
                <>
                  {t(
                    'views:repos.repoCreate.initialize.readmeDescription',
                    'This is where you can write a long description for your project'
                  )}{' '}
                  {/* TODO: when theres a README docs , link to it
                     <StyledLink className="inline-block" to="/">
                      Learn more about README
                    </StyledLink> */}
                </>
              }
              error={errors.readme && errors.readme.message?.toString()}
            />
          </ControlGroup>

          {apiError && (
            <Alert.Container variant="destructive">
              <Alert.Description>{apiError}</Alert.Description>
            </Alert.Container>
          )}

          <ButtonGroup className="mt-6">
            {/* TODO: Improve loading state to avoid flickering */}
            <Button type="submit" disabled={isLoading}>
              {!isLoading
                ? t('views:repos.repoCreate.create.create', 'Create repository')
                : t('views:repos.repoCreate.create.create', 'Creating repository...')}
            </Button>
            <Button type="button" variant="outline" onClick={onFormCancel}>
              {t('views:repos.repoCreate.cancel', 'Cancel')}
            </Button>
          </ButtonGroup>
        </FormWrapper>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
