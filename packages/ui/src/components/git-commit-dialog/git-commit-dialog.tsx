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
  Link,
  Message,
  MessageTheme,
  Radio,
  Tag
} from '@/components'
import { useTranslation } from '@/context'
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
  const { t } = useTranslation()

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
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{t('component:commitDialog.title', 'Commit changes')}</Dialog.Title>
        </Dialog.Header>

        <Dialog.Body>
          <FormWrapper id="commit-form" {...formMethods} onSubmit={handleSubmit(onSubmit)}>
            {isFileNameRequired && (
              <FormInput.Text
                id="fileName"
                label={t('component:commitDialog.form.file.label', 'File name')}
                {...register('fileName')}
                placeholder={t('component:commitDialog.form.file.placeholder', 'Add a file name')}
                autoFocus
              />
            )}

            <FormInput.Text
              autoFocus={!isFileNameRequired}
              id="message"
              label={t('component:commitDialog.form.commit.label', 'Commit message')}
              {...register('message')}
              placeholder={
                commitTitlePlaceHolder ?? t('component:commitDialog.form.commit.placeholder', 'Add a commit message')
              }
            />

            <FormInput.Textarea
              id="description"
              {...register('description')}
              placeholder={t(
                'component:commitDialog.form.description.placeholder',
                'Add an optional extended description'
              )}
              label={t('component:commitDialog.form.description.label', 'Extended description')}
            />

            <ControlGroup className="gap-cn-sm">
              <FormInput.Radio id="commitToGitRef" {...register('commitToGitRef')}>
                <Radio.Item
                  id={CommitToGitRefOption.DIRECTLY}
                  className="mt-px"
                  value={CommitToGitRefOption.DIRECTLY}
                  label={
                    <>
                      {t('component:commitDialog.form.radioGroup.directly.labelFirst', 'Commit directly to')}
                      <Tag
                        className="-mt-0.5 mx-1.5 align-sub"
                        variant="secondary"
                        theme="gray"
                        value={currentBranch}
                        icon="git-branch"
                      />
                    </>
                  }
                />
                <Radio.Item
                  id={CommitToGitRefOption.NEW_BRANCH}
                  className="mt-px"
                  value={CommitToGitRefOption.NEW_BRANCH}
                  label={t(
                    'component:commitDialog.form.radioGroup.new.label',
                    'Create a new branch for this commit and start a pull request'
                  )}
                  caption={
                    // TODO: Add correct path
                    <Link to="/">
                      {t('component:commitDialog.form.radioGroup.new.caption', 'Learn more about pull requests')}
                    </Link>
                  }
                />
              </FormInput.Radio>

              {commitToGitRefValue === CommitToGitRefOption.NEW_BRANCH && (!violation || (violation && bypassable)) && (
                <div className="ml-[26px]">
                  <FormInput.Text
                    autoFocus
                    id="newBranchName"
                    {...register('newBranchName')}
                    placeholder={t('component:commitDialog.form.radioGroup.new.input', 'New branch name')}
                  />
                </div>
              )}

              {violation && (
                <Message className="ml-[26px]" theme={MessageTheme.ERROR}>
                  {bypassable
                    ? commitToGitRefValue === CommitToGitRefOption.DIRECTLY
                      ? t(
                          'component:commitDialog.violationMessages.bypassed.directly',
                          'Some rules will be bypassed to commit directly'
                        )
                      : t(
                          'component:commitDialog.violationMessages.bypassed.new',
                          'Some rules will be bypassed to commit by creating branch'
                        )
                    : commitToGitRefValue === CommitToGitRefOption.DIRECTLY
                      ? t(
                          'component:commitDialog.violationMessages.notAllow.directly',
                          "Some rules don't allow you to commit directly"
                        )
                      : t(
                          'component:commitDialog.violationMessages.notAllow.new',
                          "Some rules don't allow you to create new branch for commit"
                        )}
                </Message>
              )}

              {error && error?.message && (
                <Message className="ml-[26px]" theme={MessageTheme.ERROR}>
                  {error.message}
                </Message>
              )}
            </ControlGroup>
          </FormWrapper>
        </Dialog.Body>

        <Dialog.Footer>
          <ButtonLayout>
            <Dialog.Close onClick={() => handleDialogClose(false)} disabled={isSubmitting}>
              {t('component:cancel', 'Cancel')}
            </Dialog.Close>
            {!bypassable ? (
              <Button type="submit" form="commit-form" disabled={isDisabledSubmission}>
                {isSubmitting
                  ? t('component:commitDialog.form.submit.loading', 'Committing...')
                  : t('component:commitDialog.form.submit.default', 'Commit changes')}
              </Button>
            ) : (
              <Button type="submit" form="commit-form" variant="outline" theme="danger">
                {commitToGitRefValue === CommitToGitRefOption.NEW_BRANCH
                  ? t('component:commitDialog.form.submit.bypassable.new', 'Bypass rules and commit via new branch')
                  : t('component:commitDialog.form.submit.bypassable.directly', 'Bypass rules and commit directly')}
              </Button>
            )}
          </ButtonLayout>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
