import { forwardRef } from 'react'

import { Avatar, AvatarProps, Button, IconV2, Layout, ScrollArea, withTooltip } from '@harnessio/ui/components'
import { EnumBypassListType, PullReqReviewDecision, ReviewerItemProps } from '@views'
import { getIcon } from '@views/repo/utils'

import { ReviewerInfo } from './reviewer-info'

const getReviewDecisionIcon = (decision: PullReqReviewDecision) => {
  switch (decision) {
    case PullReqReviewDecision.outdated:
      return <IconV2 size="lg" name="refresh-circle-solid" color="neutral" />
    case PullReqReviewDecision.approved:
      return <IconV2 size="lg" name="check-circle-solid" color="success" />
    case PullReqReviewDecision.changeReq:
      return <IconV2 size="lg" name="warning-triangle-solid" color="danger" />
    case PullReqReviewDecision.pending:
      return <IconV2 size="lg" name="clock-solid" color="warning" />
    default:
      return null
  }
}

const GroupAvatar = forwardRef<HTMLSpanElement, AvatarProps & { name: string }>(({ name, ...props }, ref) => (
  <Avatar ref={ref} name={name} rounded size="md" isGroup className="cursor-pointer" {...props} />
))
GroupAvatar.displayName = 'GroupAvatar'

const GroupAvatarWithTooltip = withTooltip(GroupAvatar)

const User = ({
  type,
  name,
  email,
  groupUsers
}: {
  type: EnumBypassListType
  name: string
  email: string
  groupUsers?: ReviewerItemProps['groupUsers']
}) => {
  const hasGroupUsers = groupUsers && groupUsers.length > 0
  const isGroupWithTooltip = hasGroupUsers && type === EnumBypassListType.USER_GROUP

  return (
    <Layout.Horizontal align="center" gap="xs">
      {(type === EnumBypassListType.USER || (type === EnumBypassListType.USER_GROUP && !hasGroupUsers)) && (
        <Avatar name={name} rounded size="md" isGroup={type === EnumBypassListType.USER_GROUP} />
      )}
      {type !== EnumBypassListType.USER && type !== EnumBypassListType.USER_GROUP && (
        <IconV2 name={getIcon(type)} size="lg" fallback="stop" className="ml-cn-4xs" />
      )}
      {isGroupWithTooltip && (
        <GroupAvatarWithTooltip
          name={name}
          tooltipProps={{
            content: (
              <ScrollArea className="-mx-cn-2xs px-cn-2xs max-h-60 w-64">
                <Layout.Vertical gapY="sm" className="w-full">
                  {groupUsers?.map(user => (
                    <User
                      key={user?.id}
                      type={user?.type as EnumBypassListType}
                      name={user?.display_name || ''}
                      email={user?.email || ''}
                    />
                  ))}
                </Layout.Vertical>
              </ScrollArea>
            ),
            side: 'bottom',
            align: 'start'
          }}
        />
      )}
      <ReviewerInfo display_name={name} email={email} />
    </Layout.Horizontal>
  )
}

const ReviewerItem = ({
  reviewer,
  reviewDecision,
  sha,
  sourceSHA,
  processReviewDecision,
  handleDelete,
  groupUsers
}: ReviewerItemProps) => {
  const { id, type, display_name, email } = reviewer || {}

  const updatedReviewDecision = reviewDecision && processReviewDecision(reviewDecision, sha, sourceSHA)

  return (
    <Layout.Horizontal align="center" justify="between" gap="sm" className="group">
      <User type={type as EnumBypassListType} name={display_name || ''} email={email || ''} groupUsers={groupUsers} />

      <div className="relative">
        <Button
          className="absolute -inset-px z-0 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
          onClick={() => {
            if (id) handleDelete(id)
          }}
          size="2xs"
          variant="transparent"
          iconOnly
          tooltipProps={{ content: 'Remove reviewer', align: 'end' }}
        >
          <IconV2 name="xmark" skipSize />
        </Button>
        <div className="relative z-[1] group-focus-within:z-[-1] group-focus-within:opacity-0 group-hover:z-[-1] group-hover:opacity-0">
          {updatedReviewDecision && getReviewDecisionIcon(updatedReviewDecision as PullReqReviewDecision)}
        </div>
      </div>
    </Layout.Horizontal>
  )
}

export { ReviewerItem }
