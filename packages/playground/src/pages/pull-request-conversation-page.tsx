import React, { useState } from 'react'
import { mockOverviewData } from '../data/mockOverviewData'
import { mockReviewers } from '../data/mockReviewer'
import { mockPullReqMetadata } from '../data/mockPullReqMetadata'
import { mockChecksSuccessData } from '../data/mockChecksData'
import { mockChangesData } from '../data/mockChangesData'
import { mockChecksSucceededInfo, mockChecksFailedInfo } from '../data/mockCheckInfo'
import { mockCommentResolvedInfo, mockCommentUnresolvedInfo } from '../data/mockCommentInfo'
import PlaygroundPullRequestCommitsSettingsProps from '../components/playground/pull-request-commits-settings'
import SkeletonList from '../components/loaders/skeleton-list'
import NoData from '../components/no-list-data'
import PullRequestPanel from '../components/pull-request/pull-request-panel'
import { Spacer } from '@harnessio/canary'
import PullRequestFilters from '../components/pull-request/pull-request-filters'
import PullRequestOverview from '../components/pull-request/pull-request-overview'
import PullRequestCommentBox from '../components/pull-request/pull-request-comment-box'
import PullRequestSideBar from '../components/pull-request/pull-request-side-bar'
import { processReviewDecision, useActivityFilters, useDateFilters } from '../components/pull-request/utils'

export default function PullRequestConversationPage() {
  const [loadState, setLoadState] = useState('data-loaded')
  const dateFilters = useDateFilters()
  const [dateOrderSort, setDateOrderSort] = useState<{ label: string; value: string }>(dateFilters[0])
  const activityFilters = useActivityFilters()
  const [activityFilter, setActivityFilter] = useState<{ label: string; value: string }>(activityFilters[0])
  const ruleViolation = false
  const checksInfo = !ruleViolation ? mockChecksSucceededInfo : mockChecksFailedInfo
  const commentsInfo = !ruleViolation ? mockCommentResolvedInfo : mockCommentUnresolvedInfo

  if (loadState == 'loading') {
    return (
      <>
        <SkeletonList />
        <PlaygroundPullRequestCommitsSettingsProps loadState={loadState} setLoadState={setLoadState} />
      </>
    )
  }

  if (loadState == 'no-data') {
    return (
      <>
        <NoData
          iconName="no-data-folder"
          title="No activity yet"
          description={['There is no activity for this pull request yet.']}
        />
        <PlaygroundPullRequestCommitsSettingsProps loadState={loadState} setLoadState={setLoadState} />
      </>
    )
  }

  return (
    <>
      <div className="grid grid-flow-col grid-cols-[1fr_220px] gap-x-8">
        <div className="flex flex-col">
          <PullRequestPanel
            changesInfo={mockChangesData}
            checksInfo={checksInfo}
            commentsInfo={commentsInfo}
            ruleViolation={ruleViolation}
            checks={mockChecksSuccessData}
            pullReqMetadata={mockPullReqMetadata}
            PRStateLoading={false}
          />
          <Spacer size={9} />
          <PullRequestFilters
            activityFilters={activityFilters}
            dateFilters={dateFilters}
            activityFilter={activityFilter}
            dateOrderSort={dateOrderSort}
            setActivityFilter={setActivityFilter}
            setDateOrderSort={setDateOrderSort}
          />
          <Spacer size={6} />
          <PullRequestOverview data={mockOverviewData} />
          <Spacer size={9} />
          <PullRequestCommentBox />
          <Spacer size={9} />
        </div>
        <PullRequestSideBar
          // repoMetadata={undefined}
          pullRequestMetadata={undefined}
          processReviewDecision={processReviewDecision}
          refetchReviewers={function (): void {
            throw new Error('Function not implemented.')
          }}
          reviewers={mockReviewers}
        />
      </div>
      <PlaygroundPullRequestCommitsSettingsProps loadState={loadState} setLoadState={setLoadState} />
    </>
  )
}
