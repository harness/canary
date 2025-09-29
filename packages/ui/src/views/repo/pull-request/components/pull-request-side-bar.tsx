import { FC } from 'react'

import { Layout, LinkProps } from '@/components'
import { PrincipalType } from '@/types'
import {
  EnumPullReqReviewDecision,
  HandleAddLabelType,
  ILabelType,
  LabelAssignmentType,
  LabelValuesType,
  PRReviewer,
  PullReqReviewDecision,
  TypesScopesLabels
} from '@/views'

import { LabelsHeader, LabelsList } from './labels'
import { ReviewersHeader, ReviewersList } from './reviewers'

export interface PullRequestSideBarProps {
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
  usersList?: PrincipalType[]
  currentUserId?: string
  searchQuery: string
  setSearchQuery: (query: string) => void
  labelsList?: ILabelType[]
  labelsValues?: LabelValuesType
  assignableLabels?: TypesScopesLabels
  PRLabels?: LabelAssignmentType[]
  searchLabelQuery?: string
  setSearchLabelQuery: (query: string) => void
  addLabel?: (data: HandleAddLabelType) => void
  editLabelsProps: LinkProps
  removeLabel?: (id: number) => void
  isCreatingPr?: boolean
  isReviewersLoading?: boolean
  isLabelsLoading?: boolean
}

export const PullRequestSideBar: FC<PullRequestSideBarProps> = ({
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
  labelsList = [],
  labelsValues = {},
  assignableLabels = {},
  PRLabels = [],
  searchLabelQuery,
  setSearchLabelQuery,
  addLabel,
  editLabelsProps,
  removeLabel,
  isCreatingPr = false,
  isReviewersLoading = false,
  isLabelsLoading = false
}) => {
  return (
    <Layout.Vertical gap="md">
      <Layout.Vertical gap="xs">
        <ReviewersHeader
          currentUserId={currentUserId}
          usersList={usersList}
          reviewers={reviewers}
          addReviewers={addReviewers}
          handleDelete={handleDelete}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isReviewersLoading={isReviewersLoading}
        />
        <ReviewersList
          reviewers={reviewers}
          pullRequestMetadata={pullRequestMetadata}
          processReviewDecision={processReviewDecision}
          handleDelete={handleDelete}
          addReviewerError={addReviewerError}
          removeReviewerError={removeReviewerError}
        />
      </Layout.Vertical>
      {!isCreatingPr ? (
        <Layout.Vertical gap="xs">
          <LabelsHeader
            labelsList={labelsList}
            labelsValues={labelsValues}
            selectedLabels={PRLabels}
            addLabel={addLabel}
            editLabelsProps={editLabelsProps}
            removeLabel={removeLabel}
            searchQuery={searchLabelQuery}
            setSearchQuery={setSearchLabelQuery}
            assignableLabels={assignableLabels}
            isLabelsLoading={isLabelsLoading}
          />
          <LabelsList
            showReset={true}
            labels={PRLabels.map(label => ({
              onDelete: () => removeLabel?.(label.id),
              color: label?.assigned_value?.color || label.color,
              key: label.key,
              value: label?.assigned_value?.value || undefined,
              scope: label.scope
            }))}
          />
        </Layout.Vertical>
      ) : null}
    </Layout.Vertical>
  )
}

PullRequestSideBar.displayName = 'PullRequestSideBar'
