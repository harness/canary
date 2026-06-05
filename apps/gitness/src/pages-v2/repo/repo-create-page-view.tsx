import { useEffect, useMemo, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { SandboxLayout, tagsOptionsToRecord } from '@harnessio/views'
import { isEmpty } from 'lodash-es'
import { z } from 'zod'

import {
  Alert,
  Button,
  ButtonLayout,
  Checkbox,
  ControlGroup,
  Dialog,
  Fieldset,
  FormInput,
  FormWrapper,
  IconV2,
  Layout,
  Link,
  Message,
  MessageTheme,
  MultiSelect,
  MultiSelectOption,
  Radio,
  Select,
  SelectValueOption,
  Text
} from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

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
  readme: z.boolean(),
  tags: z
    .array(
      z.object({
        id: z.union([z.string(), z.number()]),
        key: z.string(),
        value: z.string().optional()
      })
    )
    .optional()
    .default([])
})

export type RepoCreateFormFields = z.infer<typeof formSchema>

type DefaultBranchDialogProps = {
  formMethods: UseFormReturn<RepoCreateFormFields>
  defaultBranchOptions: string[]
}

const DefaultBranchDialog = ({ formMethods, defaultBranchOptions }: DefaultBranchDialogProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const {
    register,
    watch,
    setValue,
    formState: { errors }
  } = formMethods

  const branchValue = watch('defaultBranch')
  const customBranchRadio = watch('customBranchRadio')
  const customBranchInput = watch('customBranchInput')

  const handleConfirm = () => {
    const value = customBranchRadio === 'custom' ? customBranchInput : customBranchRadio
    setValue('defaultBranch', value || '', { shouldValidate: true })
    setValue('customBranchInput', customBranchRadio === 'custom' ? value : '', { shouldValidate: true })
    if (value) {
      setOpen(false)
    }
  }

  return (
    <Layout.Horizontal gap="xs" align="center" wrap="wrap">
      <Text wrap="nowrap">
        {t('views:repos.createNewRepo.defaultBranchDialog.startLabel', 'Your repository will be initialized with a')}
      </Text>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>
          <Button variant="outline">
            <IconV2 name="git-branch" />
            {branchValue}
            <IconV2 name="nav-arrow-down" />
          </Button>
        </Dialog.Trigger>

        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Change branch</Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <FormInput.Radio id="default-branch-radio" {...register('customBranchRadio')}>
              {defaultBranchOptions.map(option =>
                option === 'custom' ? (
                  <Radio.Item id="default-branch-custom" key="custom" value="custom" label="custom" />
                ) : (
                  <Radio.Item
                    id={`default-branch-${option}`}
                    key={option}
                    value={option}
                    label={option}
                  />
                )
              )}
            </FormInput.Radio>

            {customBranchRadio === 'custom' && (
              <FormInput.Text
                id="default-branch-text"
                label="Branch name"
                {...register('customBranchInput')}
                placeholder="Enter name to initialize default branch"
                required
                error={
                  customBranchRadio === 'custom' && !customBranchInput
                    ? errors.defaultBranch?.message?.toString()
                    : undefined
                }
                autoFocus
              />
            )}
          </Dialog.Body>

          <Dialog.Footer>
            <ButtonLayout>
              <Dialog.Close>Cancel</Dialog.Close>
              <Button variant="primary" onClick={handleConfirm}>
                Save
              </Button>
            </ButtonLayout>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

      <Text wrap="nowrap">{t('views:repos.createNewRepo.defaultBranchDialog.endLabel', 'branch.')}</Text>
    </Layout.Horizontal>
  )
}

interface RepoCreatePageViewProps {
  onFormSubmit: (data: RepoCreateFormFields) => void
  onFormCancel: () => void
  isLoading: boolean
  isSuccess: boolean
  gitIgnoreOptions?: string[]
  licenseOptions?: { value?: string; label?: string }[]
  apiError?: string
  initialDefaultBranch?: string
}

export function RepoCreatePageView({
  onFormSubmit,
  onFormCancel,
  isLoading,
  isSuccess,
  gitIgnoreOptions: _gitIgnoreOptions,
  licenseOptions: _licenseOptions,
  apiError,
  initialDefaultBranch
}: RepoCreatePageViewProps) {
  const { t } = useTranslation()

  const resolvedDefaultBranch = initialDefaultBranch?.trim() || 'main'

  const formMethods = useForm<RepoCreateFormFields>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      defaultBranch: resolvedDefaultBranch,
      customBranchRadio: resolvedDefaultBranch,
      customBranchInput: '',
      gitignore: '',
      license: '',
      access: '2',
      readme: false,
      tags: []
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
  const tagsValue = watch('tags')

  const gitIgnoreOptions: SelectValueOption[] = useMemo(
    () => _gitIgnoreOptions?.map(option => ({ value: option, label: option })) ?? [],
    [_gitIgnoreOptions]
  )

  const licenseOptions: SelectValueOption[] = useMemo(
    () => _licenseOptions?.map(option => ({ value: option.value ?? '', label: option.label })) ?? [],
    [_licenseOptions]
  )

  const defaultBranchOptions = useMemo(() => {
    const options = ['main', 'master']
    if (!options.includes(resolvedDefaultBranch)) {
      options.unshift(resolvedDefaultBranch)
    } else {
      const reordered = options.filter(option => option !== resolvedDefaultBranch)
      options.splice(0, options.length, resolvedDefaultBranch, ...reordered)
    }
    return [...options, 'custom']
  }, [resolvedDefaultBranch])

  const handleSelectChange = (fieldName: keyof RepoCreateFormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  const handleReadmeChange = (value: boolean) => {
    setValue('readme', value, { shouldValidate: true })
  }

  const handleTagsChange = (options: MultiSelectOption[]) => {
    setValue('tags', options, { shouldValidate: true })
  }

  useEffect(() => {
    if (isSuccess) {
      reset()
    }
  }, [isSuccess, reset])

  useEffect(() => {
    if (!initialDefaultBranch) return

    const currentBranch = watch('defaultBranch')
    if (!currentBranch || currentBranch === 'main') {
      setValue('defaultBranch', resolvedDefaultBranch)
      setValue('customBranchRadio', resolvedDefaultBranch)
      setValue('customBranchInput', '')
    }
  }, [initialDefaultBranch, resolvedDefaultBranch, setValue, watch])

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className="mx-auto w-[635px]">
        <Layout.Vertical gap="xl">
          <Layout.Vertical gap="md">
            <Text variant="heading-section">{t('views:repos.createNewRepo', 'Create a new repository')}</Text>
            <Text className="max-w-[500px]">
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
                <Fieldset>
                  <FormInput.Text
                    id="name"
                    label={t('views:repos.createNewRepoForm.name.label', 'Name')}
                    {...register('name')}
                    placeholder={t('views:repos.createNewRepoForm.name.placeholder', 'Enter repository name')}
                    autoFocus
                    wrapperClassName="w-full"
                  />

                  <FormInput.Textarea
                    id="description"
                    {...register('description')}
                    placeholder={t(
                      'views:repos.createNewRepoForm.description.placeholder',
                      'Enter a description of this repository'
                    )}
                    label={t('views:repos.createNewRepoForm.description.label', 'Description')}
                    optional
                    resizable
                    rows={6}
                    wrapperClassName="w-full"
                  />

                  <MultiSelect
                    label={t('views:repos.createNewRepoForm.tags.label', 'Tags')}
                    optional
                    placeholder={t('views:repos.createNewRepoForm.tags.placeholder', 'Add tags')}
                    value={tagsValue}
                    onChange={handleTagsChange}
                  />

                  <DefaultBranchDialog formMethods={formMethods} defaultBranchOptions={defaultBranchOptions} />
                </Fieldset>

                <Select
                  value={gitignoreValue}
                  options={gitIgnoreOptions}
                  onChange={value => handleSelectChange('gitignore', value)}
                  placeholder="None"
                  optional
                  label={t('views:repos.createNewRepoForm.gitignore.label', 'Add a .gitignore')}
                  error={errors.gitignore?.message?.toString()}
                  caption={t(
                    'views:repos.createNewRepoForm.gitignore.caption',
                    'Choose which files not to track from a list of templates.'
                  )}
                  contentWidth="auto"
                  wrapperClassName="w-full"
                />

                <Select
                  value={licenseValue}
                  options={licenseOptions}
                  onChange={value => handleSelectChange('license', value)}
                  placeholder="None"
                  optional
                  label="Choose a license"
                  error={errors.license?.message?.toString()}
                  caption="A license tells others what they can and can't do with your code."
                  contentWidth="auto"
                  wrapperClassName="w-full"
                />
              </Layout.Vertical>

              <Fieldset>
                <Layout.Vertical gap="xl">
                  <Text variant="body-strong">Who has access</Text>
                  <FormInput.Radio id="access" {...register('access')} wrapperClassName="w-full">
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
                <Fieldset>
                  <ControlGroup>
                    <Layout.Vertical gap="xl">
                      <Text variant="body-strong">Initialize this repository with</Text>

                      <Layout.Vertical gap="xs">
                        <Checkbox
                          id="readme"
                          checked={readmeValue}
                          onCheckedChange={handleReadmeChange}
                          label="Create a README file"
                          caption="This is where you can write a long description for your project."
                        />
                        <Link
                          to="https://developer.harness.io/docs/code-repository/config-repos/create-repo/"
                          target="_blank"
                          suffixIcon={true}
                          className="ml-[28px]"
                        >
                          {t('views:repos.learnMoreAboutReadme', 'Learn more about README')}
                        </Link>
                      </Layout.Vertical>
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

              <Fieldset>
                <ControlGroup>
                  <ButtonLayout horizontalAlign="start">
                    <Button type="submit" disabled={isLoading || !isEmpty(errors)}>
                      {!isLoading ? 'Create Repository' : 'Creating Repository...'}
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

export const tagsToRecord = tagsOptionsToRecord