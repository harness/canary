import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  Button,
  ButtonLayout,
  CommitToGitRefOption,
  ControlGroup,
  Dialog,
  FormInput,
  FormWrapper,
  GitCommitFormType,
  IconV2,
  Link,
  Message,
  MessageTheme,
  Radio,
  Tag
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

  const { register, handleSubmit, setValue, watch, reset } = formMethods

  const isDisabledSubmission = disableCTA || isSubmitting
  const onSubmit: SubmitHandler<GitCommitSchemaType> = data => {
    if (isDisabledSubmission) return

    onFormSubmit(data as GitCommitFormType)
  }

  const commitToGitRefValue = watch('commitToGitRef')
  const fileNameValue = watch('fileName')
  const newBranchNameValue = watch('newBranchName')

  useEffect(() => {
    dryRun(commitToGitRefValue, fileNameValue)
    if (commitToGitRefValue === CommitToGitRefOption.DIRECTLY) {
      setValue('newBranchName', '')
    }
  }, [commitToGitRefValue])

  useEffect(() => {
    setAllStates({ violation: false, bypassable: false, bypassed: false })
  }, [newBranchNameValue])

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      reset()
      onClose()
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleDialogClose}>
      <Dialog.Content size="md">
        <Dialog.Header>
          <Dialog.Title>Commit Changes</Dialog.Title>
        </Dialog.Header>

        <Dialog.Body>
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
              <FormInput.Radio className="gap-6" id="commitToGitRef" {...register('commitToGitRef')}>
                <Radio.Item
                  id={CommitToGitRefOption.DIRECTLY}
                  className="mt-px"
                  value={CommitToGitRefOption.DIRECTLY}
                  label={
                    <span className="flex items-center gap-2">
                      Commit directly to the
                      <Tag size="sm" value={currentBranch} icon="git-branch" showIcon />
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
              </FormInput.Radio>
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

              {commitToGitRefValue === CommitToGitRefOption.NEW_BRANCH && (!violation || (violation && bypassable)) && (
                <div className="ml-8 mt-3">
                  <FormInput.Text
                    autoFocus
                    prefix={
                      <div className="grid place-items-center px-2">
                        <IconV2 name="git-branch" size="xs" />
                      </div>
                    }
                    id="newBranchName"
                    {...register('newBranchName')}
                    placeholder="New Branch Name"
                  />
                </div>
              )}
            </ControlGroup>
          </FormWrapper>
        </Dialog.Body>

        <Dialog.Footer>
          <ButtonLayout>
            <Dialog.Close onClick={() => handleDialogClose(false)} disabled={isSubmitting}>
              Cancel
            </Dialog.Close>
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
          </ButtonLayout>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
