import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import * as Diff2Html from 'diff2html'
import { compact } from 'lodash-es'

import { useDiffStatsQuery, useGetCommitDiffQuery, useGetCommitQuery } from '@harnessio/code-service-client'
import { CommitDiffsView, DiffFileEntry } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { parseSpecificDiff } from '../../pages/pull-request/diff-utils'
import { PathParams } from '../../RouteDefinitions'
import { changedFileId, DIFF2HTML_CONFIG, normalizeGitFilePath } from '../pull-request/pull-request-utils'

export default function RepoCommitDiffsPage() {
  const repoRef = useGetRepoRef()
  const { commitSHA } = useParams<PathParams>()
  const [diffs, setDiffs] = useState<DiffFileEntry[]>([])

  const { data: { body: commitData } = {} } = useGetCommitQuery({
    repo_ref: repoRef,
    commit_sha: commitSHA || ''
  })

  const { data: currentCommitDiffData } = useGetCommitDiffQuery({
    repo_ref: repoRef,
    commit_sha: commitSHA || ''
  })

  const defaultCommitRange = compact(commitSHA?.split(/~1\.\.\.|\.\.\./g))
  const diffApiPath = `${defaultCommitRange[0]}~1...${defaultCommitRange[defaultCommitRange.length - 1]}`

  const { data: { body: diffStats } = {} } = useDiffStatsQuery(
    { queryParams: {}, repo_ref: repoRef, range: diffApiPath },
    { enabled: !!repoRef && !!diffApiPath }
  )

  // TODO: add diff to the view
  // console.log(Diff2Html.parse((currentCommitDiffData?.body as string) || '', DIFF2HTML_CONFIG))

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
    <CommitDiffsView
      commit={{
        ...commitData,
        // TODO: get this data from backend if possible
        isVerified: true,
        diffs: diffs,
        diffStats: diffStats
      }}
      useTranslationStore={useTranslationStore}
    />
  )
}
