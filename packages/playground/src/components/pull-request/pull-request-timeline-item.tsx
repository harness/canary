import React, { useEffect } from 'react'
import { Button, Card, Input, NodeGroup, Text } from '@harnessio/canary'
import cx from 'classnames'
interface TimelineItemProps {
  header: {
    avatar?: React.ReactNode
    name?: string
    description?: React.ReactNode
  }[]
  parentCommentId?: number
  currentUser?: string
  content?: React.ReactNode
  icon: React.ReactNode
  isLast: boolean
  hideIconBorder?: boolean
  hideReply?: boolean
  contentClassName?: string
  handleSaveComment?: (comment: string, parentId?: number) => void
}

interface ItemHeaderProps {
  avatar?: React.ReactNode
  name?: string
  description?: React.ReactNode
}

// Use React.memo for performance optimization if appropriate
const ItemHeader: React.FC<ItemHeaderProps> = React.memo(({ avatar, name, description }) => (
  <div className="inline-flex  gap-1.5 items-center">
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
))

const PullRequestTimelineItem: React.FC<TimelineItemProps> = ({
  header,
  content,
  icon,
  isLast,
  hideIconBorder,
  hideReply = false,
  contentClassName,
  handleSaveComment,
  parentCommentId
  // currentUser
}) => {
  const [comment, setComment] = React.useState<string>('')
  useEffect(() => {
    setComment('')
  }, [handleSaveComment])
  return (
    <NodeGroup.Root>
      <NodeGroup.Icon className={cx({ 'border-transparent': hideIconBorder })}>{icon}</NodeGroup.Icon>
      <NodeGroup.Title>
        {/* Ensure that header has at least one item */}
        {header.length > 0 && <ItemHeader {...header[0]} />}
      </NodeGroup.Title>
      {content && (
        <NodeGroup.Content>
          {/* Remove h-32, only for show */}
          <Card className={cx('bg-transparent rounded-md', contentClassName)}>
            {content}
            {/* TODO: will have to eventually implement a commenting and reply system similiar to gitness */}
            {!hideReply && (
              <div className="flex items-center gap-3 border-t px-4 py-4">
                <div className="h-6 w-6 rounded-full bg-tertiary-background  bg-cover"></div>
                <Input
                  value={comment}
                  placeholder={'Reply here'}
                  onChange={e => {
                    setComment(e.target.value)
                  }}
                />
                <Button
                  onClick={() => {
                    handleSaveComment?.(comment, parentCommentId)
                    setComment('')
                  }}>
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
