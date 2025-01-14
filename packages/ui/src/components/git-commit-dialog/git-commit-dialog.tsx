import { ChangeEvent, FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  Button,
  ButtonGroup,
  CommitToGitRefOption,
  ControlGroup,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  GitCommitFormType,
  Icon,
  Input,
  Message,
  MessageTheme,
  Option,
  RadioButton,
  RadioGroup,
  StyledLink,
  Textarea
} from '@/components'
import { UsererrorError, ViolationState } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const gitCommitSchema = z
  .object({
    message: z.string().optional(),
    description: z.string().optional(),
    commitToGitRef: z.string(),
    newBranchName: z.string().optional(),
    fileName: z.union([z.string().min(1), z.undefined()])
  })
  .superRefine((data, ctx) => {
    if (data.commitToGitRef === CommitToGitRefOption.NEW_BRANCH) {
      if (!data.newBranchName || data.newBranchName.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Branch Name is required ',
          path: ['newBranchName']
        })
      }
    }
    if (!!data.fileName && !data.fileName.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'File Name is required ',
        path: ['fileName']
      })
    }
  })

export type FormFields = z.infer<typeof gitCommitSchema>

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
  isSubmitting
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<FormFields>({
    resolver: zodResolver(gitCommitSchema),
    mode: 'onChange',
    defaultValues: {
      message: '',
      description: '',
      commitToGitRef: CommitToGitRefOption.DIRECTLY,
      newBranchName: '',
      fileName: isFileNameRequired ? '' : undefined
    }
  })

  const isDisabledSubmission = disableCTA || isSubmitting || !isValid

  const onSubmit: SubmitHandler<FormFields> = data => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[576px]">
        <DialogHeader>
          <DialogTitle>Commit Changes</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-y-7 pb-4" onSubmit={handleSubmit(onSubmit)}>
          {isFileNameRequired && (
            <Input
              id="fileName"
              label="File Name"
              {...register('fileName')}
              placeholder="Add a file name"
              size="md"
              error={errors.fileName?.message?.toString()}
              autoFocus
            />
          )}
          <Input
            id="message"
            label="Commit Message"
            {...register('message')}
            placeholder={commitTitlePlaceHolder ?? 'Add a commit message'}
            size="md"
            error={errors.message?.message?.toString()}
          />
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Add an optional extended description"
            label="Extended description"
            error={errors.description?.message?.toString()}
          />
          <ControlGroup>
            <RadioGroup
              className="gap-6"
              id="commitToGitRef"
              value={commitToGitRefValue}
              onValueChange={handleCommitToGitRefChange}
            >
              <Option
                control={
                  <RadioButton
                    className="mt-px"
                    value={CommitToGitRefOption.DIRECTLY}
                    id={CommitToGitRefOption.DIRECTLY}
                  />
                }
                id={CommitToGitRefOption.DIRECTLY}
                label={
                  <span>
                    Commit directly to the
                    <span
                      className="
                        relative mx-1.5 inline-flex gap-1 px-2.5 text-foreground-8
                        before:absolute before:-top-1 before:left-0 before:z-[-1] before:h-6 before:w-full before:rounded before:bg-background-8
                      "
                    >
                      <Icon className="translate-y-0.5 text-icons-9" name="branch" size={14} />
                      {currentBranch}
                    </span>
                    branch
                  </span>
                }
                ariaSelected={commitToGitRefValue === CommitToGitRefOption.DIRECTLY}
              />
              <Option
                control={
                  <RadioButton
                    className="mt-px"
                    value={CommitToGitRefOption.NEW_BRANCH}
                    id={CommitToGitRefOption.NEW_BRANCH}
                  />
                }
                id={CommitToGitRefOption.NEW_BRANCH}
                label="Create a new branch for this commit and start a pull request"
                ariaSelected={commitToGitRefValue === CommitToGitRefOption.NEW_BRANCH}
                description={
                  // TODO: Add correct path
                  <StyledLink to="/">Learn more about pull requests</StyledLink>
                }
              />
            </RadioGroup>
            {violation && (
              <Message className="ml-8 mt-0.5" theme={MessageTheme.ERROR}>
                {bypassable
                  ? commitToGitRefValue === CommitToGitRefOption.DIRECTLY
                    ? 'Some rules will be bypassed to commit directly'
                    : 'Some rules will be bypassed to commit by creating branch'
                  : commitToGitRefValue === CommitToGitRefOption.DIRECTLY
                    ? "Some rules don't allow you to commit directly"
                    : "Some rules don't allow you to create new branch for commit"}
              </Message>
            )}
            {errors.commitToGitRef && (
              <Message className="ml-8 mt-0.5" theme={MessageTheme.ERROR}>
                {errors.commitToGitRef?.message?.toString()}
              </Message>
            )}
            {commitToGitRefValue === CommitToGitRefOption.NEW_BRANCH && (!violation || (violation && bypassable)) && (
              <div className="ml-8 mt-3">
                <Input
                  id="newBranchName"
                  {...register('newBranchName', {
                    onChange: handleNewBranchNameChange
                  })}
                  placeholder="New Branch Name"
                  error={errors.newBranchName?.message?.toString()}
                  autoFocus
                  inputIconName="branch"
                />
              </div>
            )}
          </ControlGroup>
        </form>

        <DialogFooter>
          <ButtonGroup>
            <>
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isDisabledSubmission}>
                {isSubmitting ? 'Committing...' : 'Commit changes'}
              </Button>
            </>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
