import React, { useState } from 'react'
import { SandboxLayout } from '..'
import {
  Button,
  ButtonGroup,
  Icon,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spacer,
  Text,
  Textarea
} from '@harnessio/canary'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { FormFieldSet } from '../index'
import { MessageTheme } from '../components/form-field-set'

// Define the form schema with optional fields for gitignore and license
const formSchema = z.object({
  name: z.string().min(1, { message: 'Please provide a name' }),
  description: z.string().min(1, { message: 'Please provide a description' }),
  gitignore: z.enum(['', '1', '2', '3']),
  license: z.enum(['', '1', '2', '3']),
  access: z.enum(['1', '2'], { errorMap: () => ({ message: 'Please select who has access' }) })
})

export type FormFields = z.infer<typeof formSchema> // Automatically generate a type from the schema

interface SandboxRepoCreatePageProps {
  onFormSubmit: (data: FormFields) => void
  onFormCancel: () => void
  apiError?: string | null
}
const SandboxRepoCreatePage: React.FC<SandboxRepoCreatePageProps> = ({ onFormSubmit, apiError, onFormCancel }) => {
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
      access: '1'
    }
  })

  const accessValue = watch('access')
  const gitignoreValue = watch('gitignore')
  const licenseValue = watch('license')

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false) // New state for tracking submission status

  const handleSelectChange = (fieldName: keyof FormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  const handleAccessChange = (value: '1' | '2') => {
    setValue('access', value, { shouldValidate: true })
  }

  const onSubmit: SubmitHandler<FormFields> = data => {
    setIsSubmitting(true)
    setTimeout(() => {
      onFormSubmit(data)
      reset()
      setIsSubmitting(false)
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 2000)
    }, 2000)
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
          <Text size={2} as="p" className="text-primary/80 max-w-[100%]">
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
                <FormFieldSet.Label htmlFor="description" required>
                  Description
                </FormFieldSet.Label>
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
                <FormFieldSet.Label htmlFor="access" required>
                  Who has access?
                </FormFieldSet.Label>
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
                    <SelectItem value="1">.gitignore option 1</SelectItem>
                    <SelectItem value="2">.gitignore option 2</SelectItem>
                    <SelectItem value="3">.gitignore option 3</SelectItem>
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
                    <SelectItem value="1">License option 1</SelectItem>
                    <SelectItem value="2">License option 2</SelectItem>
                    <SelectItem value="3">License option 3</SelectItem>
                  </SelectContent>
                </Select>
                <FormFieldSet.Caption>
                  A license tells others what they can and can't do with your code.
                </FormFieldSet.Caption>
                {errors.license && (
                  <FormFieldSet.Message theme={MessageTheme.ERROR}>
                    {errors.license.message?.toString()}
                  </FormFieldSet.Message>
                )}
              </FormFieldSet.ControlGroup>
            </FormFieldSet.Root>
            {apiError && (
              <>
                <Spacer size={2} />
                <Text size={1} className="text-destructive">
                  {apiError?.toString()}
                </Text>
              </>
            )}

            {/* SUBMIT BUTTONS */}
            <FormFieldSet.Root>
              <FormFieldSet.ControlGroup>
                <ButtonGroup.Root>
                  {!isSubmitted ? (
                    <>
                      <Button type="submit" size="sm" disabled={!isValid || isSubmitting}>
                        {!isSubmitting ? 'Create repository' : 'Creating repository...'}
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" type="button" size="sm" theme="success" className="pointer-events-none">
                      Repository created&nbsp;&nbsp;
                      <Icon name="tick" size={14} />
                    </Button>
                  )}
                </ButtonGroup.Root>
              </FormFieldSet.ControlGroup>
            </FormFieldSet.Root>
          </form>
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    </>
  )
}

export { SandboxRepoCreatePage }
