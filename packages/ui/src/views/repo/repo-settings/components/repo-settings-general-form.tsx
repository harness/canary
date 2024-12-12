import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  Button,
  ButtonGroup,
  ControlGroup,
  Fieldset,
  Icon,
  Input,
  Label,
  Message,
  MessageTheme,
  Option,
  RadioButton,
  RadioGroup,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spacer,
  Text
} from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { SkeletonList, Textarea } from '@harnessio/ui/components'

import { AccessLevel, ErrorTypes, RepoData, RepoUpdateData } from '../types'

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
      <Text size={5} weight={'medium'}>
        Settings
      </Text>
      <Text size={4} weight="medium">
        General settings
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* NAME */}
        <Fieldset>
          <ControlGroup>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} placeholder="Enter repository name" disabled />
            {errors.name && <Message theme={MessageTheme.ERROR}>{errors.name.message?.toString()}</Message>}
          </ControlGroup>
          {/* DESCRIPTION */}
          <ControlGroup>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter a description of this repository..."
            />
            {errors.description && (
              <Message theme={MessageTheme.ERROR}>{errors.description.message?.toString()}</Message>
            )}
          </ControlGroup>
        </Fieldset>

        {/* <Fieldset className="max-w-[150px]"> */}
        <ControlGroup>
          <Label htmlFor="branch" optional>
            Default Branch
          </Label>
          <Select value={branchValue} onValueChange={value => handleSelectChange('branch', value)} placeholder="">
            {/* <SelectTrigger id="branch">
                <SelectValue />
              </SelectTrigger> */}
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
          {errors.branch && <Message theme={MessageTheme.ERROR}>{errors.branch.message?.toString()}</Message>}
        </ControlGroup>
        {/* </Fieldset> */}

        {/* <Fieldset> */}
        <ControlGroup>
          <Label htmlFor="access" optional>
            Visibility
          </Label>
          <RadioGroup value={accessValue} onValueChange={handleAccessChange} id="access">
            <Option
              control={<RadioButton value="1" id="access-public" />}
              id="access-public"
              label="Public"
              description="Anyone with access to the gitness environment can clone this repo."
            />
            <Option
              control={<RadioButton value="2" id="access-private" />}
              id="access-private"
              label="Private"
              description="You can choose who can see and commit to this repository."
            />
          </RadioGroup>
          {errors.access && <Message theme={MessageTheme.ERROR}>{errors.access.message?.toString()}</Message>}
        </ControlGroup>
        {/* </Fieldset> */}

        {apiError && errorTypes.has(apiError.type) && (
          <>
            <Spacer size={2} />
            <Text size={1} className="text-destructive">
              {apiError.message}
            </Text>
          </>
        )}

        {/* SUBMIT BUTTONS */}
        {/* <Fieldset className="mb-0"> */}
        <ControlGroup>
          <ButtonGroup>
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
          </ButtonGroup>
        </ControlGroup>
        {/* </Fieldset> */}
      </form>
    </>
  )
}
