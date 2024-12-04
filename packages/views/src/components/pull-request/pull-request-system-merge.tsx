import { Avatar, AvatarFallback, Button, Icon, Text } from '@harnessio/canary'

import { getInitials } from '../../utils/utils'
import { GeneralPayload, MergeStrategy, PayloadAuthor, TypesPullReq, TypesPullReqActivity } from './interfaces'
import PullRequestTimelineItem from './pull-request-timeline-item'

interface PullRequestSystemMergeItemProps {
  payload: TypesPullReqActivity | undefined
  isLast: boolean
  avatarUrl: string
  pullReqMetadata: TypesPullReq | undefined
}
const PullRequestSystemMergeItem: React.FC<PullRequestSystemMergeItemProps> = ({
  payload,
  isLast,
  pullReqMetadata
}) => {
  return (
    <PullRequestTimelineItem
      key={payload?.id} // Consider using a unique ID if available
      header={[
        {
          avatar: (
            <Avatar className="h-6 w-6 rounded-full p-0">
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
                <Text color="tertiaryBackground">
                  rebased changes from branch
                  <Button className="ml-1 mr-1" variant="secondary" size="xs">
                    {pullReqMetadata?.source_branch}
                  </Button>
                  onto
                  <Button className="ml-1 mr-1" variant="secondary" size="xs">
                    {pullReqMetadata?.target_branch}
                  </Button>
                  , now at {(payload?.payload?.payload as GeneralPayload)?.merge_sha as string}
                </Text>
              ) : (
                <Text color="tertiaryBackground">
                  merged changes from
                  <Button className="ml-1 mr-1" variant="secondary" size="xs">
                    {pullReqMetadata?.source_branch}
                  </Button>
                  into
                  <Button className="ml-1 mr-1" variant="secondary" size="xs">
                    {pullReqMetadata?.target_branch}
                  </Button>
                  by commit
                  <Button className="ml-1 mr-1" variant="secondary" size="xs">
                    {((payload?.payload?.payload as GeneralPayload)?.merge_sha as string)?.substring(0, 6)}
                  </Button>
                </Text>
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
