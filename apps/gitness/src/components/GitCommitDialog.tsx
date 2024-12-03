import { useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Spacer } from '@harnessio/canary'
import {
  OpenapiCommitFilesRequest,
  TypesCommitFilesResponse,
  useCommitFilesMutation,
  UsererrorError
} from '@harnessio/code-service-client'
import { GitCommitFormType } from '@harnessio/ui/components'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { useRuleViolationCheck } from '../framework/hooks/useRuleViolationCheck'
import { GitCommitAction } from '../utils/git-utils'
import { CommitToGitRefOption, GitCommitForm } from './GitCommitForm'

interface CommitDialogProps {
  open: boolean
  onClose: () => void
  commitAction: GitCommitAction
  gitRef: string
  sha?: string
  oldResourcePath?: string
  resourcePath: string
  payload?: string
  onSuccess: (
    response: TypesCommitFilesResponse,
    isNewBranch: boolean,
    newBranchName: string,
    fileName?: string
  ) => void
  defaultBranch: string
  isNew: boolean
}

/**
 * @deprecated
 */
export default function GitCommitDialog({
  open,
  onClose,
  commitAction,
  gitRef,
  oldResourcePath,
  resourcePath,
  payload,
  sha,
  onSuccess,
  defaultBranch,
  isNew
}: CommitDialogProps) {
  const repoRef = useGetRepoRef()
  const [error, setError] = useState<UsererrorError>()
  const [disableCTA, setDisableCTA] = useState(false)
  const queryClient = useQueryClient()
  const { violation, bypassable, bypassed, setAllStates, resetViolation } = useRuleViolationCheck()
  const { mutateAsync: commitChages } = useCommitFilesMutation({})

  const commitTitle =
    commitAction === GitCommitAction.DELETE
      ? 'Delete'
      : commitAction === GitCommitAction.MOVE
        ? 'Move'
        : commitAction === GitCommitAction.CREATE
          ? 'Create'
          : 'Edit'

  const commitTitlePlaceholder =
    commitAction === GitCommitAction.MOVE
      ? commitTitle + ' ' + oldResourcePath + ' to ' + resourcePath
      : commitTitle + ' ' + resourcePath

  const onSubmit = async (formValues: GitCommitFormType) => {
    const { message, description, commitToGitRef, newBranchName, fileName } = formValues
    const path = oldResourcePath ?? (isNew && resourcePath.length < 1 ? '/' + fileName : resourcePath)
    const data: OpenapiCommitFilesRequest = {
      actions: [
        {
          action: commitAction,
          path: path,
          payload: `${oldResourcePath ? `${resourcePath}\0` : ''}${payload}`,
          sha
        }
      ],
      branch: gitRef,
      new_branch: commitToGitRef === CommitToGitRefOption.NEW_BRANCH ? newBranchName : '',
      title: message || commitTitlePlaceholder,
      message: description,
      bypass_rules: bypassed
    }

    commitChages({
      repo_ref: repoRef,
      body: { ...data }
    })
      .then(response => {
        if ([GitCommitAction.MOVE, GitCommitAction.CREATE].includes(commitAction)) {
          queryClient.invalidateQueries(['folderContents', repoRef, gitRef])
        }
        onSuccess(response.body, commitToGitRef === CommitToGitRefOption.NEW_BRANCH, newBranchName || '', fileName)
      })
      .catch(_error => {
        if (_error?.status === 422) {
          setAllStates({
            violation: true,
            bypassed: true,
            bypassable: _error?.data?.violations[0]?.bypassable
          })
        } else {
          setError(_error as UsererrorError)
          console.log(_error, 'error')
        }
      })
  }

  const dryRun = async (commitToGitRef: CommitToGitRefOption, fileName?: string) => {
    resetViolation()
    setDisableCTA(false)
    const path = oldResourcePath ?? (isNew && resourcePath.length < 1 ? '/' + fileName : resourcePath)
    if (commitToGitRef === CommitToGitRefOption.DIRECTLY) {
      try {
        const data: OpenapiCommitFilesRequest = {
          actions: [
            {
              action: commitAction,
              path: path,
              payload: `${oldResourcePath ? `${resourcePath}\0` : ''}${payload}`,
              sha
            }
          ],
          branch: gitRef,
          new_branch: '',
          title: '',
          message: '',
          bypass_rules: false,
          dry_run_rules: true
        }

        const { body: response } = await commitChages({
          repo_ref: repoRef,
          body: { ...data }
        })
        if (response?.rule_violations?.length) {
          setAllStates({
            violation: true,
            bypassed: true,
            bypassable: response?.rule_violations[0]?.bypassable
          })
          setDisableCTA(!response?.rule_violations[0]?.bypassable)
        }
      } catch (_error) {
        // Todo: error via toast?
        console.log(_error, 'error')
      }
    }
  }

  useEffect(() => {
    dryRun(CommitToGitRefOption.DIRECTLY)
  }, [])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] border-border bg-primary-background">
        <DialogHeader>
          <DialogTitle>Commit Changes</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Spacer size={6} />
          <GitCommitForm
            onSubmit={onSubmit}
            onCancel={onClose}
            commitTitlePlaceHolder={commitTitlePlaceholder}
            error={error}
            disableCTA={disableCTA}
            dryRun={dryRun}
            violation={violation}
            bypassable={bypassable}
            defaultBranch={defaultBranch || 'Master'}
            isFileNameRequired={isNew && resourcePath?.length < 1}
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
