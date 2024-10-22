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
  Textarea,
  Spacer
} from '@harnessio/canary'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { FormFieldSet, SkeletonList } from '../../../index'
import { MessageTheme } from '../../../components/form-field-set'
import { RepoData, AccessLevel, RepoUpdateData, ErrorTypes } from './types'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  branch: z.string(),
  access: z.enum([AccessLevel.PUBLIC, AccessLevel.PRIVATE], {})
})
export type RepoUpdateFormFields = z.infer<typeof formSchema>

export const RepoSettingsGeneralForm: React.FC<{
  repoData: RepoData
  handleRepoUpdate: (data: RepoUpdateData) => void
  apiError: { type: ErrorTypes; message: string } | null
  isLoadingRepoData: boolean
  isUpdatingRepoData: boolean
  isRepoUpdateSuccess: boolean
}> = ({ repoData, handleRepoUpdate, apiError, isLoadingRepoData, isUpdatingRepoData, isRepoUpdateSuccess }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<RepoUpdateFormFields>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: repoData.name || '',
      description: repoData.description || '',
      branch: repoData.defaultBranch || '',
      access: repoData.isPublic ? AccessLevel.PUBLIC : AccessLevel.PRIVATE
    }
  })

  useEffect(() => {
    reset({
      name: repoData.name || '',
      description: repoData.description || '',
      branch: repoData.defaultBranch || '',
      access: repoData.isPublic ? AccessLevel.PUBLIC : AccessLevel.PRIVATE
    })
  }, [repoData, isLoadingRepoData])

  const accessValue = watch('access')
  const branchValue = watch('branch')

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  useEffect(() => {
    if (isSubmitted && isRepoUpdateSuccess) {
      setTimeout(() => {
        setIsSubmitted(false)
      }, 1000)
    }
  }, [isSubmitted, isRepoUpdateSuccess])

  const handleSelectChange = (fieldName: keyof RepoUpdateFormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  const handleAccessChange = (value: AccessLevel) => {
    setValue('access', value, { shouldValidate: true })
  }
  const onSubmit: SubmitHandler<RepoUpdateFormFields> = data => {
    setIsSubmitted(true)
    handleRepoUpdate(data)
    reset()
  }
  const isDefaultInBranches = repoData.branches.some(branch => branch.name === repoData.defaultBranch)
  const errorTypes = new Set([
    ErrorTypes.FETCH_REPO,
    ErrorTypes.FETCH_BRANCH,
    ErrorTypes.DESCRIPTION_UPDATE,
    ErrorTypes.BRANCH_UPDATE,
    ErrorTypes.UPDATE_ACCESS
  ])

  if (isLoadingRepoData) {
    return <SkeletonList />
  }

  return (
    <>
      <Text size={4} weight="medium">
        General settings
      </Text>
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

        <FormFieldSet.Root className="max-w-[150px]">
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="branch">Default Branch</FormFieldSet.Label>
            <Select value={branchValue} onValueChange={value => handleSelectChange('branch', value)}>
              <SelectTrigger id="branch">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {!isDefaultInBranches && repoData.defaultBranch && (
                  <SelectItem key={repoData.defaultBranch} value={repoData.defaultBranch}>
                    {repoData.defaultBranch}
                  </SelectItem>
                )}
                {repoData.branches.map(branch => {
                  return (
                    <SelectItem key={branch.name} value={branch.name || ''}>
                      {branch.name}
                    </SelectItem>
                  )
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

        {apiError && errorTypes.has(apiError.type) && (
          <>
            <Spacer size={2} />
            <Text size={1} className="text-destructive">
              {apiError.message}
            </Text>
          </>
        )}

        {/* SUBMIT BUTTONS */}
        <FormFieldSet.Root className="mb-0">
          <FormFieldSet.ControlGroup>
            <ButtonGroup.Root>
              {!isSubmitted || !isRepoUpdateSuccess ? (
                <>
                  <Button type="submit" size="sm" disabled={!isValid || isUpdatingRepoData}>
                    {!isUpdatingRepoData ? 'Save' : 'Saving...'}
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
