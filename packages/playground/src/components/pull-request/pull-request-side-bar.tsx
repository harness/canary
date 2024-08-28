import React from 'react'
import cx from 'classnames'
import { CheckCircleSolid, WarningTriangleSolid, Clock, ChatBubbleQuestionSolid } from '@harnessio/icons-noir'
import { Button, Avatar, AvatarFallback, Icon, Text } from '@harnessio/canary'
import { EnumPullReqReviewDecision, PullReqReviewDecision, ReviewerData } from './interfaces'
import { getInitials } from '../../utils/utils'

interface PullRequestSideBarProps {
  reviewers?: ReviewerData[]
  processReviewDecision: (
    review_decision: EnumPullReqReviewDecision,
    reviewedSHA?: string,
    sourceSHA?: string
  ) => EnumPullReqReviewDecision | PullReqReviewDecision.outdated
  pullRequestMetadata?: { source_sha: string }
  refetchReviewers: () => void
}

const PullRequestSideBar = (props: PullRequestSideBarProps) => {
  const { reviewers, pullRequestMetadata, processReviewDecision } = props
  // TODO: add toaster error message
  //   const { showError } = useToaster()
  return (
    <div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <Text size={2} weight="medium">
            Reviewers
          </Text>
          <div className="flex-grow"></div>
          {/* TODO: how to handle dropdown or add new button */}
          {/* <ReviewerSelect
              pullRequestMetadata={pullRequestMetadata}
              onSelect={function (id: number): void {
                updateCodeCommentStatus({ reviewer_id: id }).catch(err => {
                  showError(getErrorMessage(err))
                })
                if (refetchReviewers) {
                  refetchReviewers()
                }
              }}
            /> */}
          <Button size="sm" variant="ghost" className="px-2 py-1">
            <Icon name="vertical-ellipsis" size={12} />
          </Button>
        </div>
        <div className="pt-2 pb-4 flex flex-col gap-3">
          {reviewers && reviewers.length !== 0 && reviewers !== null ? (
            reviewers.map(
              (reviewer: {
                reviewer: { display_name: string; id: number }
                review_decision: EnumPullReqReviewDecision
                sha: string
              }) => {
                const updatedReviewDecision = processReviewDecision(
                  reviewer.review_decision,
                  reviewer.sha,
                  pullRequestMetadata?.source_sha
                )

                return (
                  <div key={reviewer.reviewer.id} className="flex items-center space-x-2 mr-1">
                    <Avatar
                      className={cx('w-7 h-7 rounded-full', {
                        'p-0': updatedReviewDecision !== PullReqReviewDecision.changeReq
                      })}>
                      <AvatarFallback>
                        <span className="text-xs"> {getInitials(reviewer.reviewer.display_name)}</span>
                      </AvatarFallback>
                    </Avatar>
                    <div className="truncate reviewerName">{reviewer.reviewer.display_name}</div>
                    <div className="flex-grow"></div>

                    {updatedReviewDecision === PullReqReviewDecision.outdated ? (
                      <ChatBubbleQuestionSolid className="text-warning" />
                    ) : updatedReviewDecision === PullReqReviewDecision.approved ? (
                      <CheckCircleSolid className="text-success" />
                    ) : updatedReviewDecision === PullReqReviewDecision.changeReq ? (
                      <WarningTriangleSolid className="text-destructive" />
                    ) : updatedReviewDecision === PullReqReviewDecision.pending ? (
                      <Clock />
                    ) : null}
                  </div>
                )
              }
            )
          ) : (
            <div className="text-tertiary-background text-sm font-[500]">No reviewers</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PullRequestSideBar
