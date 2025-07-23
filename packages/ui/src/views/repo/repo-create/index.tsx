import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import {
  Alert,
  Button,
  ButtonLayout,
  Checkbox,
  ControlGroup,
  Fieldset,
  FormInput,
  FormWrapper,
  Link,
  Message,
  MessageTheme,
  Radio,
  Select,
  SelectValueOption,
  Spacer,
  Text
} from '@/components'
import { useTranslation } from '@/context'
import { SandboxLayout } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { isEmpty } from 'lodash-es'
import { z } from 'zod'

// Define the form schema with optional fields for gitignore and license
const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Please provide a name' })
    .regex(/^[a-z0-9-_.]+$/i, { message: 'Name can only contain letters, numbers, dash, dot, or underscore' }),
  description: z.string(),
  defaultBranch: z.string(),
  gitignore: z.string().optional(),
  license: z.string().optional(),
  access: z.enum(['1', '2'], { errorMap: () => ({ message: 'Please select who has access' }) }),
  readme: z.boolean()
})

export type FormFields = z.infer<typeof formSchema> // Automatically generate a type from the schema

interface RepoCreatePageProps {
  onFormSubmit: (data: FormFields) => void
  onFormCancel: () => void
  isLoading: boolean
  isSuccess: boolean
  defaultBranchOptions?: string[]
  gitIgnoreOptions?: string[]
  licenseOptions?: { value?: string; label?: string }[]
  apiError?: string
}

export function RepoCreatePage({
  onFormSubmit,
  onFormCancel,
  isLoading,
  isSuccess,
  defaultBranchOptions: _defaultBranchOptions,
  gitIgnoreOptions: _gitIgnoreOptions,
  licenseOptions: _licenseOptions,
  apiError
}: RepoCreatePageProps) {
  const { t } = useTranslation()

  const formMethods = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      defaultBranch: _defaultBranchOptions?.at(0) ?? 'main',
      gitignore: '',
      license: '',
      access: '2',
      readme: false
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = formMethods

  const defaultBranchValue = watch('defaultBranch')
  const gitignoreValue = watch('gitignore')
  const licenseValue = watch('license')
  const readmeValue = watch('readme')

  const defaultBranchOptions: SelectValueOption[] = useMemo(
    () => _defaultBranchOptions?.map(option => ({ value: option, label: option })) ?? [],
    [_defaultBranchOptions]
  )

  const gitIgnoreOptions: SelectValueOption[] = useMemo(
    () => _gitIgnoreOptions?.map(option => ({ value: option, label: option })) ?? [],
    [_gitIgnoreOptions]
  )

  const licenseOptions: SelectValueOption[] = useMemo(
    () => _licenseOptions?.map(option => ({ value: option.value ?? '', label: option.label })) ?? [],
    [_licenseOptions]
  )

  const handleSelectChange = (fieldName: keyof FormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
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
      <SandboxLayout.Content className="mx-auto w-[570px] pb-20 pt-1">
        <Spacer size={5} />
        <Text variant="heading-section">{t('views:repos.createNewRepo', 'Create a new repository')}</Text>
        <Spacer size={2.5} />
        <Text className="max-w-[476px]">
          {t(
            'views:repos.repoContains',
            'A repository contains all project files, including the revision history. Already have a project repository elsewhere?'
          )}{' '}
          <Link to="../import" relative="path">
            {t('views:repos.importRepo', 'Import a repository')}.
          </Link>
        </Text>
        <Spacer size={10} />
        <FormWrapper {...formMethods} onSubmit={handleSubmit(onFormSubmit)}>
          {/* NAME */}
          <Fieldset>
            <FormInput.Text
              id="name"
              label="Name"
              {...register('name')}
              placeholder="Enter repository name"
              autoFocus
            />
            {/* DESCRIPTION */}
            <FormInput.Textarea
              id="description"
              {...register('description')}
              placeholder="Enter a description of this repository"
              label="Description"
              optional
            />
          </Fieldset>

          {/* DEFAULT BRANCH */}
          {defaultBranchOptions.length ? (
            <Select
              value={defaultBranchValue}
              options={defaultBranchOptions}
              onChange={value => handleSelectChange('defaultBranch', value)}
              placeholder="Select"
              label="Select a default branch"
              error={errors.defaultBranch?.message?.toString()}
              caption="Choose the name to initialize the default branch of your repository."
            />
          ) : undefined}

          {/* GITIGNORE */}
          <Select
            value={gitignoreValue}
            options={gitIgnoreOptions}
            onChange={value => handleSelectChange('gitignore', value)}
            placeholder="Select"
            label="Add a .gitignore"
            error={errors.gitignore?.message?.toString()}
            caption="Choose which files not to track from a list of templates."
          />

          {/* LICENSE */}
          <Select
            value={licenseValue}
            options={licenseOptions}
            onChange={value => handleSelectChange('license', value)}
            placeholder="Select"
            label="Choose a license"
            error={errors.license?.message?.toString()}
            caption="A license tells others what they can and can't do with your code."
          />

          {/* ACCESS */}
          <Fieldset className="mt-4">
            <FormInput.Radio label="Who has access" id="access" {...register('access')}>
              <Radio.Item
                id="access-public"
                value="1"
                label="Public"
                caption="Anyone with access to the Gitness environment can clone this repo."
              />
              <Radio.Item
                id="access-private"
                value="2"
                label="Private"
                caption="You choose who can see and commit to this repository."
              />
            </FormInput.Radio>
          </Fieldset>

          {/* README */}
          <Fieldset className="mt-4">
            <ControlGroup>
              <Text variant="body-single-line-normal">Initialize this repository with</Text>
              <div className="mt-6">
                <Checkbox
                  id="readme"
                  checked={readmeValue}
                  onCheckedChange={handleReadmeChange}
                  label="Add a README file"
                  caption="This is where you can write a long description for your project"
                />
              </div>

              {errors.readme && <Message theme={MessageTheme.ERROR}>{errors.readme.message?.toString()}</Message>}
            </ControlGroup>
          </Fieldset>

          {apiError && (
            <Alert.Root theme="danger">
              <Alert.Description>{apiError}</Alert.Description>
            </Alert.Root>
          )}

          {/* SUBMIT BUTTONS */}
          <Fieldset>
            <ControlGroup>
              <ButtonLayout horizontalAlign="start">
                {/* TODO: Improve loading state to avoid flickering */}
                <Button type="submit" disabled={isLoading || !isEmpty(errors)}>
                  {!isLoading ? 'Create repository' : 'Creating repository...'}
                </Button>
                <Button type="button" variant="outline" onClick={onFormCancel}>
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
