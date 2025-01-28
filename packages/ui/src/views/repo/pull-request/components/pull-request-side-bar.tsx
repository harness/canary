import { TranslationStore } from '@/views'

import { EnumPullReqReviewDecision, PRReviewer, PullReqReviewDecision } from '../pull-request.types'
import { LabelsHeader } from './pull-request-labels-header'
import { LabelsList } from './pull-request-labels-list'
import { ReviewersHeader, ReviewersList } from './reviewers'

interface PullRequestSideBarProps {
  reviewers?: PRReviewer[]
  processReviewDecision: (
    review_decision: EnumPullReqReviewDecision,
    reviewedSHA?: string,
    sourceSHA?: string
  ) => EnumPullReqReviewDecision | PullReqReviewDecision.outdated
  pullRequestMetadata?: { source_sha: string }
  refetchReviewers: () => void
  handleDelete: (id: number) => void
  addReviewers?: (id?: number) => void
  addReviewerError?: string
  removeReviewerError?: string
  usersList?: { display_name?: string; id?: number; uid?: string }[]
  currentUserId?: string
  searchQuery: string
  setSearchQuery: (query: string) => void
  labelsList?: { key?: string; id?: number; color?: string }[]
  PRLabels?: { key?: string; id?: number; color?: string }[]
  searchLabelQuery?: string
  setSearchLabelQuery?: (query: string) => void
  addLabel?: (id?: number) => void
  removeLabel?: (id: number) => void
  addLabelError?: string
  removeLabelError?: string
  useTranslationStore: () => TranslationStore
}

const PullRequestSideBar = (props: PullRequestSideBarProps) => {
  const {
    usersList,
    reviewers = [],
    pullRequestMetadata,
    processReviewDecision,
    handleDelete,
    addReviewerError,
    removeReviewerError,
    addReviewers,
    currentUserId,
    searchQuery,
    setSearchQuery,
    labelsList,
    PRLabels,
    searchLabelQuery,
    setSearchLabelQuery,
    addLabel,
    removeLabel,
    addLabelError,
    removeLabelError,
    useTranslationStore
  } = props

  return (
    <div>
      <div className="flex flex-col gap-3">
        <ReviewersHeader
          currentUserId={currentUserId}
          usersList={usersList}
          reviewers={reviewers}
          addReviewers={addReviewers}
          handleDelete={handleDelete}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          useTranslationStore={useTranslationStore}
        />
        <ReviewersList
          reviewers={reviewers}
          pullRequestMetadata={pullRequestMetadata}
          processReviewDecision={processReviewDecision}
          handleDelete={handleDelete}
          addReviewerError={addReviewerError}
          removeReviewerError={removeReviewerError}
        />
      </div>
      <div className="mt-8 flex flex-col gap-3">
        <LabelsHeader
          labelsList={labelsList}
          selectedLabels={PRLabels}
          addLabel={addLabel}
          removeLabel={removeLabel}
          searchQuery={searchLabelQuery}
          setSearchQuery={setSearchLabelQuery}
          useTranslationStore={useTranslationStore}
        />
        <LabelsList
          labels={PRLabels}
          handleDelete={removeLabel}
          addLabelError={addLabelError}
          removeLabelError={removeLabelError}
        />
      </div>
    </div>
  )
}

export { PullRequestSideBar }
