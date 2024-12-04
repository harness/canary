import { Avatar, AvatarFallback, Button, Icon, Text } from '@harnessio/canary'

import { getInitials } from '../../utils/utils'
import {
  CommentItem,
  CommentType,
  GeneralPayload,
  PayloadAuthor,
  TypesPullReq,
  TypesPullReqActivity
} from './interfaces'
import PullRequestSystemLabelItem from './pull-request-system-label-item'
import PullRequestSystemMergeItem from './pull-request-system-merge'
import PullRequestSystemReviewerAddItem from './pull-request-system-reviewer-add'
import PullRequestSystemReviewerDeleteItem from './pull-request-system-reviewer-delete'
import PullRequestSystemTitleItem from './pull-request-system-title'
import PullRequestTimelineItem from './pull-request-timeline-item'

interface SystemCommentProps extends TypesPullReq {
  commentItems: CommentItem<TypesPullReqActivity>[]
  repoMetadataPath?: string
  isLast: boolean
  pullReqMetadata: TypesPullReq | undefined
}
const PullRequestSystemComments: React.FC<SystemCommentProps> = ({ commentItems, isLast, pullReqMetadata }) => {
  const payload = commentItems[0].payload
  const type = payload?.payload?.type
  const openFromDraft =
    (payload?.payload?.payload as GeneralPayload)?.old_draft === true &&
    (payload?.payload?.payload as GeneralPayload)?.new_draft === false
  const changedToDraft =
    (payload?.payload?.payload as GeneralPayload)?.old_draft === false &&
    (payload?.payload?.payload as GeneralPayload)?.new_draft === true

  const getIcon = () => {
    if (openFromDraft || changedToDraft) {
      return changedToDraft ? <Icon name="pr-draft" size={12} /> : <Icon name="pr-review" size={12} />
    } else {
      if (
        (payload?.payload?.payload as GeneralPayload)?.old === 'closed' &&
        (payload?.payload?.payload as GeneralPayload)?.new === 'open'
      ) {
        return <Icon name="pr-open" size={12} />
      } else {
        return <Icon name="pr-closed" size={12} />
      }
    }
  }
  switch (type) {
    case CommentType.MERGE:
      return (
        <PullRequestSystemMergeItem payload={payload} isLast={isLast} avatarUrl="" pullReqMetadata={pullReqMetadata} />
      )
    case CommentType.REVIEW_SUBMIT:
      return (
        <PullRequestTimelineItem
          hideIconBorder
          key={payload?.id} // Consider using a unique ID if available
          header={[
            {
              avatar: (
                <Avatar className="h-6 w-6 rounded-full p-0">
                  {/* <AvatarImage src={AvatarUrl} /> */}

                  <AvatarFallback>
                    <Text size={1} color="tertiaryBackground">
                      {/* TODO: fix fallback string */}
                      {getInitials((payload?.author as PayloadAuthor)?.display_name || '')}
                    </Text>
                  </AvatarFallback>
                </Avatar>
              ),
              name: (payload?.payload?.author as PayloadAuthor)?.display_name,
              // TODO: fix timeline item to handle commit update as rn it doesnt work
              description:
                (payload?.payload?.payload as GeneralPayload)?.decision === 'approved'
                  ? 'approved these changes'
                  : 'requested changes to this pull request'
            }
          ]}
          icon={
            (payload?.payload?.payload as GeneralPayload)?.decision === 'approved' ? (
              <Icon name="success" size={18} />
            ) : (
              <Icon name="triangle-warning" size={18} className="text-destructive" />
            )
          }
          isLast={isLast}
        />
      )
    case CommentType.BRANCH_UPDATE:
      return (
        <PullRequestTimelineItem
          key={payload?.id} // Consider using a unique ID if available
          header={[
            {
              avatar: (
                <Avatar className="h-6 w-6 rounded-full p-0">
                  {/* <AvatarImage src={AvatarUrl} /> */}

                  <AvatarFallback>
                    <Text size={1} color="tertiaryBackground">
                      {/* TODO: fix fallback string */}
                      {getInitials((payload?.author as PayloadAuthor)?.display_name || '')}
                    </Text>
                  </AvatarFallback>
                </Avatar>
              ),
              // TODO: fix timeline item to handle commit update as rn it doesnt work
              name: (payload?.payload?.payload as GeneralPayload)?.commit_title as string,
              // TODO: add modals or popovers to substring stuff
              description: `${((payload?.payload?.payload as GeneralPayload)?.new as string)?.substring(0, 6)}`
            }
          ]}
          icon={<Icon name="tube-sign" size={14} />}
          isLast={isLast}
        />
      )
    case CommentType.BRANCH_DELETE:
      return (
        <PullRequestTimelineItem
          key={payload?.id} // Consider using a unique ID if available
          header={[
            {
              avatar: (
                <Avatar className="h-6 w-6 rounded-full p-0">
                  {/* <AvatarImage src={AvatarUrl} /> */}

                  <AvatarFallback>
                    <Text size={1} color="tertiaryBackground">
                      {/* TODO: fix fallback string */}
                      {getInitials((payload?.author as PayloadAuthor)?.display_name || '')}
                    </Text>
                  </AvatarFallback>
                </Avatar>
              ),
              name: (payload?.payload?.author as PayloadAuthor)?.display_name,
              description: (
                <Text color="tertiaryBackground">
                  deleted the
                  <Button className="ml-1 mr-1" variant="secondary" size="xs">
                    {pullReqMetadata?.source_branch}
                  </Button>
                  branch
                </Text>
              )
            }
          ]}
          icon={<Icon name="git-branch" size={12} />}
          isLast={isLast}
        />
      )
    case CommentType.STATE_CHANGE:
      return (
        <PullRequestTimelineItem
          key={payload?.id} // Consider using a unique ID if available
          header={[
            {
              avatar: (
                <Avatar className="h-6 w-6 rounded-full p-0">
                  {/* <AvatarImage src={AvatarUrl} /> */}

                  <AvatarFallback>
                    <Text size={1} color="tertiaryBackground">
                      {/* TODO: fix fallback string */}
                      {getInitials((payload?.author as PayloadAuthor)?.display_name || '')}
                    </Text>
                  </AvatarFallback>
                </Avatar>
              ),
              name: (payload?.payload?.author as PayloadAuthor)?.display_name,
              description: (
                <>
                  {openFromDraft || changedToDraft ? (
                    <Text color="tertiaryBackground">
                      {changedToDraft ? 'marked pull request as draft' : 'opened pull request for review'}
                    </Text>
                  ) : (
                    <Text color="tertiaryBackground">{`changed pull request state from ${(payload?.payload?.payload as GeneralPayload)?.old} to ${(payload?.payload?.payload as GeneralPayload)?.new}`}</Text>
                  )}
                </>
              )
            }
          ]}
          icon={getIcon()}
          isLast={isLast}
        />
      )
    case CommentType.TITLE_CHANGE:
      return <PullRequestSystemTitleItem payload={payload} isLast={isLast} />
    case CommentType.REVIEW_DELETE:
      return <PullRequestSystemReviewerDeleteItem payload={payload} isLast={isLast} />
    case CommentType.REVIEW_ADD:
      return <PullRequestSystemReviewerAddItem payload={payload} isLast={isLast} />
    case CommentType.LABEL_MODIFY:
      return <PullRequestSystemLabelItem payload={payload} isLast={isLast} />
    default:
      console.warn('Unable to render system type activity', commentItems)
      return <Text color="tertiaryBackground">{type}</Text>
  }
}

export default PullRequestSystemComments
