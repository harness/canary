import { TranslationStore } from '@/views'

import { EnumPullReqReviewDecision, PullReqReviewDecision } from '../pull-request.types'
import { LabelsHeader } from './pull-request-labels-header'
import { LabelsList } from './pull-request-labels-list'
import { ReviewersHeader } from './pull-request-reviewers-header'
import { ReviewersList } from './pull-request-reviewers-list'

interface PullRequestSideBarProps {
  reviewers?: {
    reviewer?: { display_name?: string; id?: number }
    review_decision?: EnumPullReqReviewDecision
    sha?: string
  }[]
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
      {labelsList && labelsList.length > 0 && (
        <div className="flex flex-col gap-3 pt-5">
          <LabelsHeader
            labelsList={labelsList}
            selectedLabels={PRLabels}
            addLabel={addLabel}
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
      )}
    </div>
  )
}

export { PullRequestSideBar }
