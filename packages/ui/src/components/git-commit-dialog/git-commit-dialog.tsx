import { ChangeEvent, FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  Button,
  ButtonGroup,
  CommitToGitRefOption,
  ControlGroup,
  Dialog,
  FormInput,
  FormWrapper,
  GitCommitFormType,
  Icon,
  Link,
  Message,
  MessageTheme,
  Radio
} from '@/components'
import { UsererrorError, ViolationState } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export const createGitCommitSchema = (isFileNameRequired: boolean) => {
  const fileNameSchema = isFileNameRequired ? z.string().min(1, 'File Name is required') : z.string().optional()

  return z
    .object({
      message: z.string().optional(),
      description: z.string().optional(),
      commitToGitRef: z.nativeEnum(CommitToGitRefOption),
      newBranchName: z.string().optional(),
      fileName: fileNameSchema
    })
    .superRefine((data, ctx) => {
      if (data.commitToGitRef === CommitToGitRefOption.NEW_BRANCH) {
        if (!data.newBranchName || !data.newBranchName.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Branch Name is required',
            path: ['newBranchName']
          })
        }
      }
    })
}

export type GitCommitSchemaType = z.infer<ReturnType<typeof createGitCommitSchema>>

export interface GitCommitDialogProps {
  isOpen: boolean
  isFileNameRequired?: boolean
  commitTitlePlaceHolder?: string
  currentBranch: string
  violation: boolean
  bypassable: boolean
  disableCTA: boolean
  // TODO: We need to decide how to display errors from the API.
  error?: UsererrorError
  onClose: () => void
  onFormSubmit: (formValues: GitCommitFormType) => Promise<void>
  setAllStates: (payload: Partial<ViolationState>) => void
  dryRun: (commitToGitRef: CommitToGitRefOption, fileName?: string) => void
  isSubmitting: boolean
}

export const GitCommitDialog: FC<GitCommitDialogProps> = ({
  isOpen,
  onClose,
  isFileNameRequired = false,
  onFormSubmit,
  commitTitlePlaceHolder,
  dryRun,
  currentBranch,
  violation,
  bypassable,
  setAllStates,
  disableCTA,
  isSubmitting,
  error
}) => {
  const formMethods = useForm<GitCommitSchemaType>({
    resolver: zodResolver(createGitCommitSchema(isFileNameRequired)),
    mode: 'onChange',
    defaultValues: {
      message: '',
      description: '',
      commitToGitRef: CommitToGitRefOption.DIRECTLY,
      newBranchName: '',
      fileName: isFileNameRequired ? '' : undefined
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

  const isDisabledSubmission = disableCTA || isSubmitting
  const onSubmit: SubmitHandler<GitCommitSchemaType> = data => {
    if (isDisabledSubmission) return

    onFormSubmit(data as GitCommitFormType)
  }

  const commitToGitRefValue = watch('commitToGitRef')
  const fileNameValue = watch('fileName')

  const handleCommitToGitRefChange = (value: CommitToGitRefOption) => {
    dryRun(value, fileNameValue)
    setValue('commitToGitRef', value, { shouldValidate: true })

    if (CommitToGitRefOption.DIRECTLY) {
      setValue('newBranchName', '')
    }
  }

  const handleNewBranchNameChange = (_e: ChangeEvent<HTMLInputElement>) => {
    setAllStates({ violation: false, bypassable: false, bypassed: false })
  }
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      reset()
      onClose()
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleDialogClose}>
      <Dialog.Content className="max-w-[576px]">
        <Dialog.Header>
          <Dialog.Title>Commit Changes</Dialog.Title>
        </Dialog.Header>

        <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
          {isFileNameRequired && (
            <FormInput.Text
              id="fileName"
              label="File Name"
              {...register('fileName')}
              placeholder="Add a file name"
              autoFocus
            />
          )}
          <FormInput.Text
            autoFocus={!isFileNameRequired}
            id="message"
            label="Commit Message"
            {...register('message')}
            placeholder={commitTitlePlaceHolder ?? 'Add a commit message'}
          />
          <FormInput.Textarea
            id="description"
            {...register('description')}
            placeholder="Add an optional extended description"
            label="Extended description"
          />
          <ControlGroup>
            <Radio.Root
              className="gap-6"
              id="commitToGitRef"
              value={commitToGitRefValue}
              onValueChange={handleCommitToGitRefChange}
            >
              <Radio.Item
                id={CommitToGitRefOption.DIRECTLY}
                className="mt-px"
                value={CommitToGitRefOption.DIRECTLY}
                label={
                  <span>
                    Commit directly to the
                    <span
                      className="
                        text-cn-foreground-1 before:bg-cn-background-8 relative mx-1.5 inline-flex gap-1
                        px-2.5 before:absolute before:-top-1 before:left-0 before:z-[-1] before:h-6 before:w-full before:rounded
                      "
                    >
                      <Icon className="text-icons-9 translate-y-0.5" name="branch" size={14} />
                      {currentBranch}
                    </span>
                    branch
                  </span>
                }
              />
              <Radio.Item
                id={CommitToGitRefOption.NEW_BRANCH}
                className="mt-px"
                value={CommitToGitRefOption.NEW_BRANCH}
                label="Create a new branch for this commit and start a pull request"
                caption={
                  // TODO: Add correct path
                  <Link to="/">Learn more about pull requests</Link>
                }
              />
            </Radio.Root>
            {violation && (
              <Message className="ml-[26px] mt-0.5" theme={MessageTheme.ERROR}>
                {bypassable
                  ? commitToGitRefValue === CommitToGitRefOption.DIRECTLY
                    ? 'Some rules will be bypassed to commit directly'
                    : 'Some rules will be bypassed to commit by creating branch'
                  : commitToGitRefValue === CommitToGitRefOption.DIRECTLY
                    ? "Some rules don't allow you to commit directly"
                    : "Some rules don't allow you to create new branch for commit"}
              </Message>
            )}
            {error && error?.message && (
              <Message className="ml-[26px] mt-0.5" theme={MessageTheme.ERROR}>
                {error.message}
              </Message>
            )}
            {errors.commitToGitRef && (
              <Message className="ml-8 mt-0.5" theme={MessageTheme.ERROR}>
                {errors.commitToGitRef?.message?.toString()}
              </Message>
            )}
            {commitToGitRefValue === CommitToGitRefOption.NEW_BRANCH && (!violation || (violation && bypassable)) && (
              <div className="ml-8 mt-3">
                <FormInput.Text
                  autoFocus
                  prefix={
                    <div className="grid place-items-center px-2">
                      <Icon name="branch" size={14} />
                    </div>
                  }
                  id="newBranchName"
                  {...register('newBranchName', {
                    onChange: handleNewBranchNameChange
                  })}
                  placeholder="New Branch Name"
                />
              </div>
            )}
          </ControlGroup>
        </FormWrapper>

        <Dialog.Footer>
          <ButtonGroup>
            <>
              <Button variant="outline" onClick={() => handleDialogClose(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              {!bypassable ? (
                <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isDisabledSubmission}>
                  {isSubmitting ? 'Committing...' : 'Commit changes'}
                </Button>
              ) : (
                <Button onClick={handleSubmit(onSubmit)} variant="outline" theme="danger" type="submit">
                  {commitToGitRefValue === CommitToGitRefOption.NEW_BRANCH
                    ? 'Bypass rules and commit via new branch'
                    : 'Bypass rules and commit directly'}
                </Button>
              )}
            </>
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
