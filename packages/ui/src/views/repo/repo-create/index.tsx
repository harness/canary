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
  Layout,
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

import { DefaultBranchDialog } from './default-branch-dialog'

// Define the form schema with optional fields for gitignore and license
const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Please provide a name' })
    .regex(/^[a-z0-9-_.]+$/i, { message: 'Name can only contain letters, numbers, dash, dot, or underscore' }),
  description: z.string(),
  defaultBranch: z.string().min(1, { message: 'Please provide a name to initialize the default branch' }),
  customBranchRadio: z.string().optional(),
  customBranchInput: z.string().optional(),
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
  gitIgnoreOptions?: string[]
  licenseOptions?: { value?: string; label?: string }[]
  apiError?: string
}

export function RepoCreatePage({
  onFormSubmit,
  onFormCancel,
  isLoading,
  isSuccess,
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
      defaultBranch: 'main',
      customBranchRadio: 'main',
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

  const gitignoreValue = watch('gitignore')
  const licenseValue = watch('license')
  const readmeValue = watch('readme')

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
      <SandboxLayout.Content className="mx-auto w-[610px] pb-20 pt-1">
        <Spacer size={7} />
        <Layout.Vertical gap="xl">
          <Layout.Vertical gap="md">
            <Text variant="heading-section">{t('views:repos.createNewRepo', 'Create a new repository')}</Text>
            <Text className="max-w-[476px]">
              {t(
                'views:repos.repoContains',
                'A repository contains all project files, including the revision history. Already have a project repository elsewhere?'
              )}{' '}
              <Link to="../import" relative="path">
                {t('views:repos.importRepo', 'Import a repository')}.
              </Link>
            </Text>
          </Layout.Vertical>

          <FormWrapper {...formMethods} onSubmit={handleSubmit(onFormSubmit)}>
            <Layout.Vertical gap="3xl">
              <Layout.Vertical gap="xl">
                {/* NAME */}
                <Fieldset>
                  <FormInput.Text
                    id="name"
                    label={t('views:repos.createNewRepoForm.name.label', 'Name')}
                    {...register('name')}
                    placeholder={t('views:repos.createNewRepoForm.name.placeholder', 'Enter repository name')}
                    autoFocus
                  />
                  {/* DESCRIPTION */}
                  <FormInput.Textarea
                    id="description"
                    {...register('description')}
                    placeholder={t(
                      'views:repos.createNewRepoForm.description.placeholder',
                      'Enter a description of this repository'
                    )}
                    label={t('views:repos.createNewRepoForm.description.label', 'Description')}
                    optional
                  />

                  <DefaultBranchDialog formMethods={formMethods} />
                </Fieldset>

                {/* GITIGNORE */}
                <Select
                  value={gitignoreValue}
                  options={gitIgnoreOptions}
                  onChange={value => handleSelectChange('gitignore', value)}
                  placeholder={t('views:repos.createNewRepoForm.gitignore.placeholder', 'Select')}
                  label={t('views:repos.createNewRepoForm.gitignore.label', 'Add a .gitignore')}
                  error={errors.gitignore?.message?.toString()}
                  caption={t(
                    'views:repos.createNewRepoForm.gitignore.caption',
                    'Choose which files not to track from a list of templates.'
                  )}
                  contentWidth="triggerWidth"
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
                  contentWidth="triggerWidth"
                />
              </Layout.Vertical>

              {/* ACCESS */}
              <Fieldset>
                <Layout.Vertical gap="xl">
                  <Text variant="body-strong">Who has access</Text>
                  <FormInput.Radio id="access" {...register('access')}>
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
                </Layout.Vertical>
              </Fieldset>

              <div>
                {/* README */}
                <Fieldset>
                  <ControlGroup>
                    <Layout.Vertical gap="xl">
                      <Text variant="body-strong">Initialize this repository with</Text>

                      <Checkbox
                        id="readme"
                        checked={readmeValue}
                        onCheckedChange={handleReadmeChange}
                        label="Add a README file"
                        caption="This is where you can write a long description for your project."
                      />
                    </Layout.Vertical>
                    {errors.readme && <Message theme={MessageTheme.ERROR}>{errors.readme.message?.toString()}</Message>}
                  </ControlGroup>
                </Fieldset>

                {apiError && (
                  <Alert.Root theme="danger">
                    <Alert.Description>{apiError}</Alert.Description>
                  </Alert.Root>
                )}
              </div>

              {/* SUBMIT BUTTONS */}
              <Fieldset>
                <ControlGroup>
                  <ButtonLayout horizontalAlign="start">
                    {/* TODO: Improve loading state to avoid flickering */}
                    <Button type="submit" disabled={isLoading || !isEmpty(errors)}>
                      {!isLoading ? 'Create repository' : 'Creating repository...'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={onFormCancel}>
                      Cancel
                    </Button>
                  </ButtonLayout>
                </ControlGroup>
              </Fieldset>
            </Layout.Vertical>
          </FormWrapper>
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
