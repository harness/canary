import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import * as Diff2Html from 'diff2html'

import { useGetCommitDiffQuery, useGetCommitQuery } from '@harnessio/code-service-client'
import { RepoCommitDetailsView } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { parseSpecificDiff } from '../../pages/pull-request/diff-utils'
import { PathParams } from '../../RouteDefinitions'
import { changedFileId, DIFF2HTML_CONFIG, normalizeGitFilePath } from '../pull-request/pull-request-utils'
import { useCommitDetailsStore } from './stores/commit-details-store'

export default function RepoCommitDetailsPage() {
  const repoRef = useGetRepoRef()
  const { commitSHA } = useParams<PathParams>()
  const { diffs, setDiffs } = useCommitDetailsStore()

  const { data: { body: commitData } = {} } = useGetCommitQuery({
    repo_ref: repoRef,
    commit_sha: commitSHA || ''
  })

  const { data: currentCommitDiffData } = useGetCommitDiffQuery({
    repo_ref: repoRef,
    commit_sha: commitSHA || ''
  })

  useEffect(() => {
    if (currentCommitDiffData) {
      const _diffs = Diff2Html.parse((currentCommitDiffData?.body as string) || '', DIFF2HTML_CONFIG)
        .map(diff => {
          diff.oldName = normalizeGitFilePath(diff.oldName)
          diff.newName = normalizeGitFilePath(diff.newName)

          const fileId = changedFileId([diff.oldName, diff.newName])
          const containerId = `container-${fileId}`
          const contentId = `content-${fileId}`

          const filePath = diff.isDeleted ? diff.oldName : diff.newName
          const diffString = parseSpecificDiff((currentCommitDiffData.body as string) ?? '', diff.oldName, diff.newName)
          return {
            ...diff,
            containerId,
            contentId,
            fileId,
            filePath,
            // fileViews: cachedDiff.fileViews,
            raw: diffString
          }
        })
        .sort((a, b) => (a.newName || a.oldName).localeCompare(b.newName || b.oldName, undefined, { numeric: true }))

      setDiffs(_diffs)
    } else {
      setDiffs([])
    }
  }, [
    // readOnly,
    currentCommitDiffData
  ])

  return (
    <RepoCommitDetailsView
      commit={{
        ...commitData,
        // TODO: get this data from backend if possible
        isVerified: true
      }}
      useTranslationStore={useTranslationStore}
    />
  )
}
