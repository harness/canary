import { useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  Button,
  ButtonGroup,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spacer,
  Text
} from '@harnessio/canary'
import { Alert, Textarea } from '@harnessio/ui/components'

import { FormFieldSet, SandboxLayout } from '..'
import { MessageTheme } from './form-field-set'

// Define the form schema with optional fields for gitignore and license
const formSchema = z.object({
  name: z.string().min(1, { message: 'Please provide a name' }),
  description: z.string(),
  gitignore: z.string().optional(),
  license: z.string().optional(),
  access: z.enum(['1', '2'], { errorMap: () => ({ message: 'Please select who has access' }) })
})

export type FormFields = z.infer<typeof formSchema> // Automatically generate a type from the schema

interface RepoCreatePageFormProps {
  onFormSubmit: (data: FormFields) => void
  onFormCancel: () => void
  apiError: string | null
  isLoading: boolean
  isSuccess: boolean
  gitIgnoreOptions?: string[]
  licenseOptions?: { value?: string; label?: string }[]
}

const RepoCreatePageForm: React.FC<RepoCreatePageFormProps> = ({
  onFormSubmit,
  apiError = null,
  onFormCancel,
  isLoading,
  isSuccess,
  gitIgnoreOptions,
  licenseOptions
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      gitignore: '',
      license: '',
      access: '2'
    }
  })

  const accessValue = watch('access')
  const gitignoreValue = watch('gitignore')
  const licenseValue = watch('license')

  const handleSelectChange = (fieldName: keyof FormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  const handleAccessChange = (value: '1' | '2') => {
    setValue('access', value, { shouldValidate: true })
  }

  useEffect(() => {
    if (isSuccess === true) {
      reset()
    }
  }, [isSuccess])

  const onSubmit: SubmitHandler<FormFields> = data => {
    onFormSubmit(data)
  }

  const handleCancel = () => {
    onFormCancel()
  }

  return (
    <>
      <SandboxLayout.Main hasLeftPanel hasHeader>
        <SandboxLayout.Content maxWidth="2xl">
          <Spacer size={10} />
          <Text size={6} weight={'medium'}>
            Create a new repository
          </Text>
          <Spacer size={3} />
          <Text size={2} as="p" className="max-w-full text-primary/80">
            A repository contains all project files, including the revision history. Already have a project repository
            elsewhere? Import a repository.
          </Text>
          <Spacer size={8} />
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* NAME */}
            <FormFieldSet.Root>
              <FormFieldSet.ControlGroup>
                <FormFieldSet.Label htmlFor="name" required>
                  Name
                </FormFieldSet.Label>
                <Input id="name" {...register('name')} placeholder="Enter repository name" autoFocus />
                {errors.name && (
                  <FormFieldSet.Message theme={MessageTheme.ERROR}>
                    {errors.name.message?.toString()}
                  </FormFieldSet.Message>
                )}
              </FormFieldSet.ControlGroup>
              {/* DESCRIPTION */}
              <FormFieldSet.ControlGroup>
                <FormFieldSet.Label htmlFor="description">Description</FormFieldSet.Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Enter a description of this repository..."
                />
                {errors.description && (
                  <FormFieldSet.Message theme={MessageTheme.ERROR}>
                    {errors.description.message?.toString()}
                  </FormFieldSet.Message>
                )}
              </FormFieldSet.ControlGroup>
            </FormFieldSet.Root>

            {/* ACCESS */}
            <FormFieldSet.Root box shaded>
              <FormFieldSet.ControlGroup>
                <FormFieldSet.Label htmlFor="access">Who has access?</FormFieldSet.Label>
                <RadioGroup value={accessValue} onValueChange={handleAccessChange} id="access">
                  <FormFieldSet.Option
                    control={<RadioGroupItem value="1" id="access-public" />}
                    id="access-public"
                    label="Public"
                    description="Anyone with access to the environment can clone this repo."
                  />
                  <FormFieldSet.Option
                    control={<RadioGroupItem value="2" id="access-private" />}
                    id="access-private"
                    label="Private"
                    description="You choose who can see and commit to this repository."
                  />
                </RadioGroup>
                {errors.access && (
                  <FormFieldSet.Message theme={MessageTheme.ERROR}>
                    {errors.access.message?.toString()}
                  </FormFieldSet.Message>
                )}
              </FormFieldSet.ControlGroup>
            </FormFieldSet.Root>

            {/* GITIGNORE */}
            <FormFieldSet.Root box>
              <FormFieldSet.ControlGroup>
                <FormFieldSet.Label htmlFor="gitignore">Add a .gitignore (optional)</FormFieldSet.Label>
                <Select value={gitignoreValue} onValueChange={value => handleSelectChange('gitignore', value)}>
                  <SelectTrigger id="gitignore">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {gitIgnoreOptions &&
                      gitIgnoreOptions?.map(option => {
                        return (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        )
                      })}
                  </SelectContent>
                </Select>
                {errors.gitignore && (
                  <FormFieldSet.Message theme={MessageTheme.ERROR}>
                    {errors.gitignore.message?.toString()}
                  </FormFieldSet.Message>
                )}
              </FormFieldSet.ControlGroup>

              {/* LICENSE */}
              <FormFieldSet.ControlGroup>
                <FormFieldSet.Label htmlFor="license">Choose a license (optional)</FormFieldSet.Label>
                <Select value={licenseValue} onValueChange={value => handleSelectChange('license', value)}>
                  <SelectTrigger id="license">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {licenseOptions &&
                      licenseOptions?.map(option => (
                        <SelectItem key={option.value} value={option.value ?? ''}>
                          {option.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormFieldSet.Caption>
                  A license tells others what they can and can&apos;t do with your code.
                </FormFieldSet.Caption>
                {errors.license && (
                  <FormFieldSet.Message theme={MessageTheme.ERROR}>
                    {errors.license.message?.toString()}
                  </FormFieldSet.Message>
                )}
              </FormFieldSet.ControlGroup>
            </FormFieldSet.Root>

            {apiError && (
              <Alert.Container variant="destructive" className="mb-8">
                <Alert.Description>{apiError?.toString()}</Alert.Description>
              </Alert.Container>
            )}

            {/* SUBMIT BUTTONS */}
            <FormFieldSet.Root>
              <FormFieldSet.ControlGroup>
                <ButtonGroup.Root>
                  <>
                    <Button type="submit" size="sm" disabled={!isValid || isLoading}>
                      {!isLoading ? 'Create repository' : 'Creating repository...'}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                </ButtonGroup.Root>
              </FormFieldSet.ControlGroup>
            </FormFieldSet.Root>
          </form>
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    </>
  )
}

export { RepoCreatePageForm }
