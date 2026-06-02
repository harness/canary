import { forwardRef, useCallback, useRef, useState } from 'react'

import { EnumBypassListType, PRReviewer, PullReqReviewDecision, ReviewerItemProps } from '@views'
import { getIcon } from '@views/repo/utils'

import {
  Avatar,
  AvatarProps,
  Button,
  IconV2,
  Layout,
  ScrollArea,
  Skeleton,
  withTooltip
} from '@harnessio/ui/components'

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

const GroupUsersSkeleton = () => (
  <Layout.Vertical gapY="sm" className="w-full">
    {Array.from({ length: 3 }).map((_, index) => (
      <Layout.Horizontal key={index} align="center" gap="xs">
        <Skeleton.Avatar size="md" rounded />
        <Skeleton.Typography variant="body-single-line-normal" className="w-32" />
      </Layout.Horizontal>
    ))}
  </Layout.Vertical>
)

const User = ({
  type,
  name,
  email,
  groupUsers,
  groupUsersLoading,
  onHoverGroup
}: {
  type: EnumBypassListType
  name: string
  email: string
  groupUsers?: ReviewerItemProps['groupUsers']
  groupUsersLoading?: ReviewerItemProps['groupUsersLoading']
  onHoverGroup?: () => void
}) => {
  const isUserGroup = type === EnumBypassListType.USER_GROUP

  return (
    <Layout.Horizontal align="center" gap="xs">
      {type === EnumBypassListType.USER && <Avatar name={name} rounded size="md" />}
      {type !== EnumBypassListType.USER && !isUserGroup && (
        <IconV2 name={getIcon(type)} size="lg" fallback="stop" className="ml-cn-4xs" />
      )}
      {isUserGroup && (
        <GroupAvatarWithTooltip
          name={name}
          onMouseEnter={onHoverGroup}
          tooltipProps={{
            content: (
              <ScrollArea className="px-cn-2xs max-h-60 w-64">
                {groupUsersLoading ? (
                  <GroupUsersSkeleton />
                ) : (
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
                )}
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
  fetchGroupMembers
}: ReviewerItemProps) => {
  const { id, type, display_name, email } = reviewer || {}
  const [groupUsers, setGroupUsers] = useState<PRReviewer['reviewer'][]>([])
  const [groupUsersLoading, setGroupUsersLoading] = useState(false)
  const hasFetchedGroupMembers = useRef(false)

  const handleFetchGroupMembers = useCallback(() => {
    if (!fetchGroupMembers || type !== EnumBypassListType.USER_GROUP || hasFetchedGroupMembers.current) return

    hasFetchedGroupMembers.current = true
    setGroupUsersLoading(true)
    fetchGroupMembers()
      .then(members => {
        setGroupUsers(
          members.map(user => ({
            display_name: user.name || '',
            id: 0,
            email: user.email || '',
            type: EnumBypassListType.USER
          }))
        )
      })
      .catch(() => {
        // Allow a retry on the next hover if the fetch failed
        hasFetchedGroupMembers.current = false
      })
      .finally(() => setGroupUsersLoading(false))
  }, [fetchGroupMembers, type])

  const updatedReviewDecision = reviewDecision && processReviewDecision(reviewDecision, sha, sourceSHA)

  return (
    <Layout.Horizontal align="center" justify="between" gap="sm" className="group">
      <User
        type={type as EnumBypassListType}
        name={display_name || ''}
        email={email || ''}
        groupUsers={groupUsers}
        groupUsersLoading={groupUsersLoading}
        onHoverGroup={handleFetchGroupMembers}
      />

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
