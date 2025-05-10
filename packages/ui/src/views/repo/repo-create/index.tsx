import { useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'

import {
  Alert,
  Button,
  ButtonGroup,
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
  Spacer,
  Text,
  Textarea
} from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Define the form schema with optional fields for gitignore and license
const formSchema = z.object({
  name: z.string().min(1, { message: 'Please provide a name' }),
  description: z.string(),
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

  const formMethods = useForm<FormFields>({
    resolver: zodResolver(formSchema),
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = formMethods

  const accessValue = watch('access')
  const gitignoreValue = watch('gitignore')
  const licenseValue = watch('license')
  const readmeValue = watch('readme')

  const handleSelectChange = (fieldName: keyof FormFields, value: string) => {
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

  const onSubmit: SubmitHandler<FormFields> = data => {
    console.log('data', data)

    onFormSubmit(data)
  }

  const handleCancel = () => {
    onFormCancel()
  }

  console.log('errors', errors)

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className="mx-auto w-[570px] pb-20 pt-11">
        <Spacer size={5} />
        <Text className="tracking-tight" size={5} weight="medium">
          {t('views:repos.createNewRepo', 'Create a new repository')}
        </Text>
        <Spacer size={2.5} />
        <Text className="max-w-[476px] text-cn-foreground-2" size={2} as="p">
          {t(
            'views:repos.repoContains',
            'A repository contains all project files, including the revision history. Already have a project repository elsewhere?'
          )}{' '}
          <Link to="../import" relative="path">
            {t('views:repos.importRepo', 'Import a repository')}.
          </Link>
        </Text>
        <Spacer size={10} />
        <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
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
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter a description of this repository"
              label="Description"
              error={errors.description?.message?.toString()}
              optional
            />
          </Fieldset>

          {/* GITIGNORE */}
          <Fieldset>
            <ControlGroup>
              <Select.Root
                name="gitignore"
                value={gitignoreValue}
                onValueChange={value => handleSelectChange('gitignore', value)}
                placeholder="Select"
                label="Add a .gitignore"
                error={errors.gitignore?.message?.toString()}
                caption="Choose which files not to track from a list of templates."
              >
                <Select.Content>
                  {!!gitIgnoreOptions &&
                    gitIgnoreOptions.map(option => (
                      <Select.Item key={option} value={option}>
                        {option}
                      </Select.Item>
                    ))}
                </Select.Content>
              </Select.Root>
            </ControlGroup>

            {/* LICENSE */}
            <ControlGroup>
              <Select.Root
                name="license"
                value={licenseValue}
                onValueChange={value => handleSelectChange('license', value)}
                placeholder="Select"
                label="Choose a license"
                error={errors.license?.message?.toString()}
                caption="A license tells others what they can and can't do with your code."
              >
                <Select.Content>
                  {licenseOptions &&
                    licenseOptions?.map(option => (
                      <Select.Item key={option.value} value={option.value ?? ''}>
                        {option.label}
                      </Select.Item>
                    ))}
                </Select.Content>
              </Select.Root>
            </ControlGroup>
          </Fieldset>

          {/* ACCESS */}
          <Fieldset className="mt-4">
            <ControlGroup>
              <Text className="leading-none text-cn-foreground-2" size={2}>
                Who has access
              </Text>
              <Radio.Root className="mt-6" value={accessValue} onValueChange={handleAccessChange} id="access">
                <Radio.Item
                  id="access-public"
                  className="mt-px"
                  value="1"
                  label="Public"
                  caption="Anyone with access to the Gitness environment can clone this repo."
                />
                <Radio.Item
                  id="access-private"
                  className="mt-px"
                  value="2"
                  label="Private"
                  caption="You choose who can see and commit to this repository."
                />
              </Radio.Root>
              {errors.access && (
                <Message className="mt-0.5" theme={MessageTheme.ERROR}>
                  {errors.access.message?.toString()}
                </Message>
              )}
            </ControlGroup>
          </Fieldset>

          {/* README */}
          <Fieldset className="mt-4">
            <ControlGroup>
              <Text className="leading-none text-cn-foreground-2" size={2}>
                Initialize this repository with
              </Text>
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
            <Alert.Container variant="destructive">
              <Alert.Description>{apiError}</Alert.Description>
            </Alert.Container>
          )}

          {/* SUBMIT BUTTONS */}
          <Fieldset>
            <ControlGroup>
              <ButtonGroup>
                {/* TODO: Improve loading state to avoid flickering */}
                <Button type="submit" disabled={isLoading}>
                  {!isLoading ? 'Create repository' : 'Creating repository...'}
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
