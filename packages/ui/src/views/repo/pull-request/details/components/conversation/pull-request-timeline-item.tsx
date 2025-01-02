import { memo, useState } from 'react'

import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Icon,
  Input,
  NodeGroup,
  Text
} from '@components/index'
import { cn } from '@utils/cn'

import { PullRequestCommentBox } from './pull-request-comment-box'

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
  isComment?: boolean
  hideIconBorder?: boolean
  hideReply?: boolean
  contentClassName?: string
  titleClassName?: string
  handleSaveComment?: (comment: string, parentId?: number) => void
  onEditClick?: () => void
  isEditMode?: boolean
  handleDeleteComment?: () => void
  isDeleted?: boolean
  hideReplyBox?: boolean
  setHideReplyBox?: (state: boolean) => void
}

interface ItemHeaderProps {
  handleReplyBox: (state: boolean) => void
  avatar?: React.ReactNode
  name?: string
  isComment?: boolean
  description?: React.ReactNode
  comment?: string
  setComment?: React.Dispatch<React.SetStateAction<string>>
  selectStatus?: React.ReactNode
  onEditClick?: () => void
  handleDeleteComment?: () => void
  isDeleted?: boolean
}
const CRLF = '\n'

// Use React.memo for performance optimization if appropriate
const ItemHeader: React.FC<ItemHeaderProps> = memo(
  ({
    handleReplyBox,
    onEditClick,
    avatar,
    name,
    description,
    selectStatus,
    isComment,
    handleDeleteComment,
    isDeleted = false
  }) => {
    const moreTooltip = () => {
      return (
        !isDeleted && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="rotate-90 px-2 py-1">
                <Icon name="vertical-ellipsis" size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px] rounded-[10px] border border-borders-1 bg-background-2 py-2 shadow-sm">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={onEditClick} className="cursor-pointer">
                  <DropdownMenuShortcut className="ml-0"></DropdownMenuShortcut>
                  {'Edit'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={e => {
                    handleReplyBox(true)
                    e.stopPropagation()
                  }}
                  className="cursor-pointer"
                >
                  <DropdownMenuShortcut className="ml-0"></DropdownMenuShortcut>
                  {'Quote reply'}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <DropdownMenuShortcut className="ml-0"></DropdownMenuShortcut>
                  {'Copy Link'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive"
                  onClick={e => {
                    e.stopPropagation()
                    handleDeleteComment?.()
                  }}
                >
                  <DropdownMenuShortcut className="ml-0">
                    <Icon name="trash" className="mr-2 text-destructive" />
                  </DropdownMenuShortcut>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      )
    }
    return (
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
        {isComment && moreTooltip()}
      </div>
    )
  }
)
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
  titleClassName,
  isComment,
  onEditClick,
  isEditMode,
  handleDeleteComment,
  isDeleted = false,
  hideReplyBox,
  setHideReplyBox
}) => {
  const [comment, setComment] = useState<string>('')
  const onQuote = (content: string) => {
    // TODO: Handle quote logic
    const replyContent = content
      .split(CRLF)
      .map(line => `> ${line}`)
      .concat([CRLF])
      .join(CRLF)
    setComment(replyContent)
  }

  const handleReplyBox = (state: boolean) => {
    setHideReplyBox?.(state)
    onQuote('t')
  }
  return (
    <NodeGroup.Root>
      <NodeGroup.Icon className={cn({ 'border-transparent': hideIconBorder })}>{icon}</NodeGroup.Icon>
      <NodeGroup.Title className={titleClassName}>
        {/* Ensure that header has at least one item */}
        {header.length > 0 && (
          <ItemHeader
            handleReplyBox={handleReplyBox}
            isDeleted={isDeleted}
            setComment={setComment}
            onEditClick={onEditClick}
            comment={comment}
            isComment={isComment}
            handleDeleteComment={handleDeleteComment}
            {...header[0]}
          />
        )}
      </NodeGroup.Title>
      {content && (
        <NodeGroup.Content>
          <Card className={cn('rounded-md bg-transparent', contentClassName)}>
            {isEditMode ? (
              <PullRequestCommentBox
                isEditMode
                inReplyMode
                onSaveComment={() => {
                  handleSaveComment?.(comment, parentCommentId)
                  setComment('')
                }}
                currentUser={header[0].name}
                onCancelClick={() => {
                  setComment('')
                }}
                comment={comment}
                setComment={setComment}
              />
            ) : (
              content
            )}
            {!hideReply && (
              <>
                {hideReplyBox ? (
                  <PullRequestCommentBox
                    inReplyMode
                    onSaveComment={() => {
                      handleSaveComment?.(comment, parentCommentId)
                      setHideReplyBox?.(false)
                    }}
                    currentUser={header[0].name}
                    onCancelClick={() => {
                      setHideReplyBox?.(false)
                    }}
                    comment={comment}
                    setComment={setComment}
                  />
                ) : (
                  <div className="flex items-center gap-3 border-t p-4">
                    {header.length > 0 && header[0].avatar}
                    <Input
                      value={comment}
                      placeholder={'Reply here'}
                      onClick={() => {
                        setHideReplyBox?.(true)
                      }}
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
              </>
            )}
          </Card>
        </NodeGroup.Content>
      )}
      {!isLast && <NodeGroup.Connector />}
    </NodeGroup.Root>
  )
}

export default PullRequestTimelineItem
