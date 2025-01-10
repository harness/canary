import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import * as Diff2Html from 'diff2html'
import { compact } from 'lodash-es'

import { useDiffStatsQuery, useGetCommitDiffQuery } from '@harnessio/code-service-client'
import { CommitDiffsView } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { parseSpecificDiff } from '../../pages/pull-request/diff-utils'
import { PathParams } from '../../RouteDefinitions'
import { changedFileId, DIFF2HTML_CONFIG, normalizeGitFilePath } from '../pull-request/pull-request-utils'
import { useCommitDetailsStore } from './stores/commit-details-store'

export default function RepoCommitDiffsPage() {
  const repoRef = useGetRepoRef()
  const { commitSHA } = useParams<PathParams>()
  const { setDiffs, setDiffStats } = useCommitDetailsStore()

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

  useEffect(() => {
    if (diffStats) {
      setDiffStats(diffStats)
    }
  }, [diffStats, setDiffStats])

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
            raw: diffString
          }
        })
        .sort((a, b) => (a.newName || a.oldName).localeCompare(b.newName || b.oldName, undefined, { numeric: true }))

      setDiffs(_diffs)
    } else {
      setDiffs([])
    }
  }, [currentCommitDiffData])

  return <CommitDiffsView useCommitDetailsStore={useCommitDetailsStore} useTranslationStore={useTranslationStore} />
}
