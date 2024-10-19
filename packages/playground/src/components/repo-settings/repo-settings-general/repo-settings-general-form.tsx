import React, { useEffect, useState } from 'react'
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
  Text,
  Textarea
} from '@harnessio/canary'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { FormFieldSet } from '../../../index'
import { MessageTheme } from '../../../components/form-field-set'

// Define the form schema with optional fields for gitignore and license
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  branch: z.enum(['1', '2', '3']),
  access: z.enum(['1', '2'], {})
})
export type FormFields = z.infer<typeof formSchema> // Automatically generate a type from the schema

interface RepoSettingsGeneralFormProps {
  /* onFormSubmit?: (data: FormFields) => void
  onFormCancel?: () => void
  apiError?: string | null
  isLoading?: boolean
  isSuccess?: boolean*/
  isLoading?: boolean
}
export const RepoSettingsGeneralForm: React.FC<RepoSettingsGeneralFormProps> = ({
  /*onFormSubmit,
  apiError = null,
  onFormCancel,
  isLoading,
  isSuccess*/
  isLoading = false,
  repoData
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
      name: repoData.name || '',
      description: repoData.description || '',
      branch: '1',
      access: repoData.isPublic ? '1' : '2'
    }
  })

  console.log(repoData)

  useEffect(() => {
    reset({
      name: repoData.name || '',
      description: repoData.description || '',
      branch: '1',
      access: repoData.isPublic ? '1' : '2'
    })
  }, [repoData])

  const accessValue = watch('access')
  const branchValue = watch('branch')

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const handleSelectChange = (fieldName: keyof FormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  const handleAccessChange = (value: '1' | '2') => {
    setValue('access', value, { shouldValidate: true })
  }
  const onSubmit: SubmitHandler<FormFields> = data => {
    setIsSubmitted(true)
    console.log(data)
    reset()
    setTimeout(() => {
      setIsSubmitted(false)
    }, 2000)
  }

  return (
    <>
      <Text size={4} weight="medium">
        General settings
      </Text>
      {/* <Spacer size={3} /> */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* NAME */}
        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="name" required>
              Name
            </FormFieldSet.Label>
            <Input id="name" {...register('name')} placeholder="Enter repository name" disabled />
            {errors.name && (
              <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors.name.message?.toString()}</FormFieldSet.Message>
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

        {/* GITIGNORE */}
        <FormFieldSet.Root className="max-w-[150px]">
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="branch">Default Branch</FormFieldSet.Label>
            <Select value={branchValue} onValueChange={value => handleSelectChange('branch', value)}>
              <SelectTrigger id="branch">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {repoData.branches.map(branch => {
                  return <SelectItem value={branch.name}>{branch.name}</SelectItem>
                })}
              </SelectContent>
            </Select>
            {errors.branch && (
              <FormFieldSet.Message theme={MessageTheme.ERROR}>
                {errors.branch.message?.toString()}
              </FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>

        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="access" required>
              Visibility
            </FormFieldSet.Label>
            <RadioGroup value={accessValue} onValueChange={handleAccessChange} id="access">
              <FormFieldSet.Option
                control={<RadioGroupItem value="1" id="access-public" />}
                id="access-public"
                label="Public"
                description="Anyone with access to the gitness environment can clone this repo."
              />
              <FormFieldSet.Option
                control={<RadioGroupItem value="2" id="access-private" />}
                id="access-private"
                label="Private"
                description="You can choose who can see and commit to this repository."
              />
            </RadioGroup>
            {errors.access && (
              <FormFieldSet.Message theme={MessageTheme.ERROR}>
                {errors.access.message?.toString()}
              </FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>

        {/*{apiError && (
          <>
            <Spacer size={2} />
            <Text size={1} className="text-destructive">
              {apiError?.toString()}
            </Text>
          </>
        )}*/}

        {/* SUBMIT BUTTONS */}
        <FormFieldSet.Root className="mb-0">
          <FormFieldSet.ControlGroup>
            <ButtonGroup.Root>
              {!isSubmitted ? (
                <>
                  <Button type="submit" size="sm" disabled={!isValid || isLoading}>
                    {!isLoading ? 'Save' : 'Saving...'}
                  </Button>
                </>
              ) : (
                <Button variant="ghost" type="button" size="sm" theme="success" className="pointer-events-none">
                  Saved&nbsp;&nbsp;
                  <Icon name="tick" size={14} />
                </Button>
              )}
            </ButtonGroup.Root>
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>
      </form>
    </>
  )
}
