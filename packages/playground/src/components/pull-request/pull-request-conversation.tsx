import React, { useState } from 'react'
import PullRequestSideBar from './pull-request-side-bar'
import PullRequestOverview from './pull-request-overview'
import { processReviewDecision, useActivityFilters, useDateFilters } from './utils'
import { mockReviewers } from './mocks/mockReviewer'
import PullRequestFilters from './pull-request-filters'
import PullRequestPanel from './pull-request-panel'
import { mockPullReqMetadata } from './mocks/mockPullReqMetadata'
import { mockChecksSuccessData } from './mocks/mockChecksData'
import { mockChangesData } from './mocks/mockChangesData'
import { mockChecksSucceededInfo, mockChecksFailedInfo } from './mocks/mockCheckInfo'
import { mockCommentResolvedInfo, mockCommentUnresolvedInfo } from './mocks/mockCommentInfo'
import mockOverviewData from './mocks/mockOverviewData'
import { Spacer } from '@harnessio/canary'

export default function PullRequestConversation() {
  const dateFilters = useDateFilters()
  const [dateOrderSort, setDateOrderSort] = useState<{ label: string; value: string }>(dateFilters[0])
  const activityFilters = useActivityFilters()
  const [activityFilter, setActivityFilter] = useState<{ label: string; value: string }>(activityFilters[0])
  const changesData = mockChangesData
  const ruleViolation = false

  const checksInfo = !ruleViolation ? mockChecksSucceededInfo : mockChecksFailedInfo
  const commentsInfo = !ruleViolation ? mockCommentResolvedInfo : mockCommentUnresolvedInfo
  return (
    <div>
      <div className="grid grid-flow-col grid-cols-[1fr_220px] gap-x-8">
        <div className="flex flex-col">
          <PullRequestPanel
            changesInfo={changesData}
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
    </div>
  )
}
