import { useParams } from 'react-router-dom'

import * as Diff2Html from 'diff2html'
import { compact } from 'lodash-es'

import { useDiffStatsQuery, useGetCommitDiffQuery, useGetCommitQuery } from '@harnessio/code-service-client'
import { DiffFile, RepoCommitDetailsView } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { DIFF2HTML_CONFIG } from '../pull-request/pull-request-utils'

export default function RepoCommitDetailsPage() {
  const repoRef = useGetRepoRef()
  const { commitSHA } = useParams<PathParams>()

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
  console.log(Diff2Html.parse((currentCommitDiffData?.body as string) || '', DIFF2HTML_CONFIG))

  return (
    <RepoCommitDetailsView
      commit={{
        ...commitData,
        // TODO: get this data from backend if possible
        isVerified: true,
        diffs: currentCommitDiffData?.body as unknown as DiffFile[],
        diffStats: diffStats
      }}
      useTranslationStore={useTranslationStore}
    />
  )
}
