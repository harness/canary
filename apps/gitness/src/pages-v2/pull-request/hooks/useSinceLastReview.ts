import { useMemo } from 'react'

import { TypesListCommitResponse, TypesUser } from '@harnessio/code-service-client'
import { ReviewerListPullReqOkResponse, SinceLastReviewData, TypesPullReq } from '@harnessio/views'

const NO_REVIEW: SinceLastReviewData = { status: 'no-review', commits: [] }
const NO_NEW_COMMITS: SinceLastReviewData = { status: 'no-new-commits', commits: [] }

interface UseSinceLastReviewProps {
  reviewers?: ReviewerListPullReqOkResponse
  pullReqCommits?: TypesListCommitResponse
  currentUser?: TypesUser
  pullReqMetadata?: TypesPullReq
}

export function useSinceLastReview({
  reviewers,
  pullReqCommits,
  currentUser,
  pullReqMetadata
}: UseSinceLastReviewProps): SinceLastReviewData | undefined {
  return useMemo(() => {
    const commits = pullReqCommits?.commits
    if (!commits?.length || !currentUser) return undefined

    if (!reviewers?.length) return NO_REVIEW

    const currentReviewer = reviewers.find(r => r.reviewer?.uid === currentUser.uid)
    if (!currentReviewer?.sha) return NO_REVIEW

    if (currentReviewer.sha === pullReqMetadata?.source_sha) return NO_NEW_COMMITS

    const reviewedIndex = commits.findIndex(c => c.sha === currentReviewer.sha)
    if (reviewedIndex === -1) return NO_REVIEW

    // Commits are ordered newest-first from the API, so commits
    // added after the review are at indices before reviewedIndex
    const newCommits = commits.slice(0, reviewedIndex)
    if (!newCommits.length) return NO_NEW_COMMITS

    return {
      status: 'has-new-commits',
      commits: newCommits.map(c => ({
        name: c.message || '',
        count: 0,
        value: c.sha || '',
        datetime: c.committer?.when || ''
      }))
    }
  }, [reviewers, pullReqCommits?.commits, currentUser, pullReqMetadata?.source_sha])
}
