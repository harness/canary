import { memo, useState } from 'react'

import cx from 'classnames'

import { NodeGroup } from '@harnessio/canary'
import { Button, Card, Input, Text } from '@harnessio/ui/components'

interface TimelineItemProps {
  header: {
    avatar?: React.ReactNode
    name?: string
    description?: React.ReactNode
    selectStatus?: React.ReactNode
  }[]
  parentCommentId?: number
  currentUser?: string
  content?: React.ReactNode
  icon: React.ReactNode
  isLast: boolean
  hideIconBorder?: boolean
  hideReply?: boolean
  contentClassName?: string
  titleClassName?: string
  handleSaveComment?: (comment: string, parentId?: number) => void
}

interface ItemHeaderProps {
  avatar?: React.ReactNode
  name?: string
  description?: React.ReactNode
  selectStatus?: React.ReactNode
}

// Use React.memo for performance optimization if appropriate
const ItemHeader: React.FC<ItemHeaderProps> = memo(({ avatar, name, description, selectStatus }) => (
  <div className="inline-flex w-full items-center justify-between gap-1.5">
    <div className="inline-flex items-center gap-1.5">
      {avatar && <div>{avatar}</div>}
      {name && (
        <Text size={2} color="primary" weight="medium">
          {name}
        </Text>
      )}
      {description && (
        <Text size={2} color="tertiaryBackground">
          {description}
        </Text>
      )}
    </div>
    {selectStatus && (
      <div className="justify-end">
        <Text size={2} color="tertiaryBackground">
          {selectStatus}
        </Text>
      </div>
    )}
  </div>
))
ItemHeader.displayName = 'ItemHeader'

const PullRequestTimelineItem: React.FC<TimelineItemProps> = ({
  header,
  content,
  icon,
  isLast,
  hideIconBorder,
  hideReply = false,
  contentClassName,
  handleSaveComment,
  parentCommentId,
  titleClassName
  // currentUser
}) => {
  const [comment, setComment] = useState<string>('')

  return (
    <NodeGroup.Root>
      <NodeGroup.Icon className={cx({ 'border-transparent': hideIconBorder })}>{icon}</NodeGroup.Icon>
      <NodeGroup.Title className={titleClassName}>
        {/* Ensure that header has at least one item */}
        {header.length > 0 && <ItemHeader {...header[0]} />}
      </NodeGroup.Title>
      {content && (
        <NodeGroup.Content>
          {/* Remove h-32, only for show */}
          <Card className={cx('rounded-md bg-transparent', contentClassName)}>
            {content}
            {/* TODO: will have to eventually implement a commenting and reply system similiar to gitness */}
            {!hideReply && (
              <div className="flex items-center gap-3 border-t p-4">
                {header.length > 0 && header[0].avatar}
                <Input
                  value={comment}
                  placeholder={'Reply here'}
                  onChange={e => {
                    setComment(e.target.value)
                  }}
                />
                <Button
                  disabled={!comment.trim()}
                  onClick={() => {
                    handleSaveComment?.(comment, parentCommentId)
                    setComment('')
                  }}
                >
                  Reply
                </Button>
              </div>
            )}
          </Card>
        </NodeGroup.Content>
      )}
      {!isLast && <NodeGroup.Connector />}
    </NodeGroup.Root>
  )
}

export default PullRequestTimelineItem
