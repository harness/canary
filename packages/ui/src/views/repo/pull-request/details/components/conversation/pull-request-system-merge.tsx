import { useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, CommitCopyActions, Icon, Text } from '@components/index'
import { getInitials } from '@utils/stringUtils'
import { TypesPullReq } from '@views/repo/pull-request/pull-request.types'

import { GeneralPayload, MergeStrategy, PayloadAuthor, TypesPullReqActivity } from '../../pull-request-details-types'
import PullRequestBranchBadge from './pull-request-branch-badge'
import PullRequestTimelineItem from './pull-request-timeline-item'

interface PullRequestSystemMergeItemProps {
  payload: TypesPullReqActivity | undefined
  isLast: boolean
  avatarUrl: string
  pullReqMetadata: TypesPullReq | undefined
  toCode?: ({ sha }: { sha: string }) => string
  toCommitDetails?: ({ sha }: { sha: string }) => string
}
const PullRequestSystemMergeItem: React.FC<PullRequestSystemMergeItemProps> = ({
  payload,
  isLast,
  pullReqMetadata,
  toCode,
  toCommitDetails
}) => {
  const navigate = useNavigate()
  const handleNavigation = (url?: string) => {
    navigate(url || '')
  }
  return (
    <PullRequestTimelineItem
      key={payload?.id} // Consider using a unique ID if available
      header={[
        {
          avatar: (
            <Avatar className="size-6 rounded-full p-0">
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
              {(payload?.payload?.payload as GeneralPayload)?.merge_method === MergeStrategy.REBASE ? (
                <span className=" flex items-center gap-x-1 text-14 text-foreground-4">
                  rebased changes from branch
                  <PullRequestBranchBadge
                    branchName={pullReqMetadata?.source_branch as string}
                    onClick={() => handleNavigation(toCode?.({ sha: pullReqMetadata?.source_branch as string }))}
                  />
                  into
                  <PullRequestBranchBadge
                    branchName={pullReqMetadata?.target_branch as string}
                    onClick={() => handleNavigation(toCode?.({ sha: pullReqMetadata?.target_branch as string }))}
                  />
                  , now at{' '}
                  <CommitCopyActions
                    toCommitDetails={toCommitDetails}
                    sha={(payload?.payload?.payload as GeneralPayload)?.merge_sha as string}
                  />
                </span>
              ) : (
                <span className=" flex items-center gap-x-1 text-14 text-foreground-4">
                  merged changes from
                  <PullRequestBranchBadge
                    branchName={pullReqMetadata?.source_branch as string}
                    onClick={() => handleNavigation(toCode?.({ sha: pullReqMetadata?.source_branch as string }))}
                  />
                  into
                  <PullRequestBranchBadge
                    branchName={pullReqMetadata?.target_branch as string}
                    onClick={() => handleNavigation(toCode?.({ sha: pullReqMetadata?.target_branch as string }))}
                  />
                  by commit
                  <CommitCopyActions
                    toCommitDetails={toCommitDetails}
                    sha={(payload?.payload?.payload as GeneralPayload)?.merge_sha as string}
                  />
                </span>
              )}
            </>
          )
        }
      ]}
      //Fix icon for this state
      icon={<Icon name="pr-merge" size={12} />}
      isLast={isLast}
    />
  )
}

export default PullRequestSystemMergeItem
