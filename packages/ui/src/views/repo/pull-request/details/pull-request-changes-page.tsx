import { FC } from 'react'

import { TypesUser } from '@/types'
import { SkeletonList, Spacer } from '@components/index'
import { DiffModeEnum } from '@git-diff-view/react'
import { TranslationStore } from '@views/repo/repo-list/types'

import { TypesPullReq } from '../pull-request.types'
import { PullRequestChanges } from './components/changes/pull-request-changes'
import { PullRequestChangesFilter } from './components/changes/pull-request-changes-filter'
import {
  PullReqReviewDecision,
  PullRequestDataState,
  ReviewerListPullReqOkResponse
} from './pull-request-details-types'

interface RepoPullRequestChangesPageProps {
  useTranslationStore: () => TranslationStore
  usePullRequestProviderStore: () => PullRequestDataState
  currentUser?: TypesUser
  pullReqMetadata?: TypesPullReq
  reviewers?: ReviewerListPullReqOkResponse
  submitReview?: (decision: PullReqReviewDecision) => void
  refetchReviewers?: () => void
  loading?: boolean
  diffMode: DiffModeEnum
  setDiffMode: (value: DiffModeEnum) => void
  loadingReviewers?: boolean
  loadingRawDiff?: boolean
}
const PullRequestChangesPage: FC<RepoPullRequestChangesPageProps> = ({
  useTranslationStore,
  loadingReviewers,
  usePullRequestProviderStore,
  diffMode,

  reviewers,
  refetchReviewers,
  submitReview,
  currentUser,
  setDiffMode,
  pullReqMetadata,
  loadingRawDiff
}) => {
  const { diffs } = usePullRequestProviderStore()
  const renderContent = () => {
    if (loadingRawDiff) {
      return <SkeletonList />
    }
    return (
      <PullRequestChanges
        data={
          diffs?.map(item => ({
            text: item.filePath,
            numAdditions: item.addedLines,
            numDeletions: item.deletedLines,
            data: item.raw,
            title: item.filePath,
            lang: item.filePath.split('.')[1]
          })) || []
        }
        useTranslationStore={useTranslationStore}
        diffMode={diffMode}
        currentUser={currentUser?.display_name}
      />
    )
  }

  return (
    <>
      <PullRequestChangesFilter
        active={''}
        useTranslationStore={useTranslationStore}
        loading={loadingReviewers}
        currentUser={currentUser ?? {}}
        pullRequestMetadata={pullReqMetadata ? pullReqMetadata : undefined}
        reviewers={reviewers}
        submitReview={submitReview}
        refetchReviewers={refetchReviewers}
        diffMode={diffMode}
        setDiffMode={setDiffMode}
      />
      <Spacer aria-setsize={5} />

      {renderContent()}
    </>
  )
}

export { PullRequestChangesPage }
