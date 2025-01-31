import { useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import {
  OpenapiCommitFilesRequest,
  TypesCommitFilesResponse,
  useCommitFilesMutation,
  UsererrorError
} from '@harnessio/code-service-client'
import {
  CommitToGitRefOption,
  GitCommitDialog as GitCommitDialogComp,
  GitCommitFormType
} from '@harnessio/ui/components'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { useRuleViolationCheck } from '../framework/hooks/useRuleViolationCheck'
import { GitCommitAction } from '../utils/git-utils'

export type CommitDialogOnSuccess = (
  response: TypesCommitFilesResponse,
  isNewBranch: boolean,
  newBranchName: string,
  fileName?: string
) => void

interface CommitDialogProps {
  open: boolean
  onClose: () => void
  commitAction: GitCommitAction
  gitRef: string
  sha?: string
  oldResourcePath?: string
  resourcePath: string
  payload?: string
  onSuccess: CommitDialogOnSuccess
  currentBranch: string
  isNew: boolean
}

/**
 * TODO: This code was migrated from V2 and needs to be refactored.
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
  currentBranch,
  isNew
}: CommitDialogProps) {
  const repoRef = useGetRepoRef()
  const [error, setError] = useState<UsererrorError>()
  const [disableCTA, setDisableCTA] = useState(false)
  const queryClient = useQueryClient()
  const { violation, bypassable, bypassed, setAllStates, resetViolation } = useRuleViolationCheck()
  const { mutateAsync: commitChanges } = useCommitFilesMutation({})

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

    commitChanges({
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
        if (_error?.violations?.length > 0) {
          setAllStates({
            violation: true,
            bypassed: true,
            bypassable: _error?.violations[0]?.bypassable
          })
        } else {
          setError(_error as UsererrorError)
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

        const { body: response } = await commitChanges({
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
    <GitCommitDialogComp
      isOpen={open}
      onClose={onClose}
      onFormSubmit={onSubmit}
      commitTitlePlaceHolder={commitTitlePlaceholder}
      error={error}
      disableCTA={disableCTA}
      dryRun={dryRun}
      violation={violation}
      bypassable={bypassable}
      currentBranch={currentBranch || 'Master'}
      isFileNameRequired={isNew && resourcePath?.length < 1}
      setAllStates={setAllStates}
      // TODO: Add a loading state for submission
      isSubmitting={false}
    />
  )
}
