import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import * as Diff2Html from 'diff2html'
import { compact } from 'lodash-es'

import {
  useDiffStatsQuery,
  useGetCommitDiffQuery,
  useGetContentQuery,
  useListPathsQuery
} from '@harnessio/code-service-client'
import { CommitDiff, CommitSidebar } from '@harnessio/ui/views'

import Explorer from '../../components/FileExplorer'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import useCodePathDetails from '../../hooks/useCodePathDetails'
import { parseSpecificDiff } from '../../pages/pull-request/diff-utils'
import { PathParams } from '../../RouteDefinitions'
import { normalizeGitRef } from '../../utils/git-utils'
import { changedFileId, DIFF2HTML_CONFIG, normalizeGitFilePath } from '../pull-request/pull-request-utils'
import { useCommitDetailsStore } from './stores/commit-details-store'

/**
 * TODO: For now, file-tree is static and contains all files.
 * Needs to filter files for current commit and add opportunity to navigate to diff for each file from file-tree
 */
export const CommitDiffContainer = ({ showSidebar = true }: { showSidebar?: boolean }) => {
  const repoRef = useGetRepoRef()
  const { commitSHA } = useParams<PathParams>()
  const { fullGitRef } = useCodePathDetails()
  const { setDiffs, setDiffStats } = useCommitDetailsStore()

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
            raw: diffString
          }
        })
        .sort((a, b) => (a.newName || a.oldName).localeCompare(b.newName || b.oldName, undefined, { numeric: true }))

      setDiffs(_diffs)
    } else {
      setDiffs([])
    }
  }, [currentCommitDiffData])

  const { data: repoDetails } = useGetContentQuery({
    path: '',
    repo_ref: repoRef,
    queryParams: {
      include_commit: true,
      git_ref: normalizeGitRef(fullGitRef)
    }
  })

  const { data: filesData } = useListPathsQuery({
    repo_ref: repoRef,
    queryParams: { git_ref: normalizeGitRef(fullGitRef) }
  })

  const filesList = filesData?.body?.files || []

  return (
    <>
      {showSidebar && (
        <CommitSidebar navigateToFile={() => {}} filesList={filesList}>
          {!!repoDetails?.body?.content?.entries?.length && <Explorer repoDetails={repoDetails?.body} />}
        </CommitSidebar>
      )}

      <CommitDiff useCommitDetailsStore={useCommitDetailsStore} />
    </>
  )
}
