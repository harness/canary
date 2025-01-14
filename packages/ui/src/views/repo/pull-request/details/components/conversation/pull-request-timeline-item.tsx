import { memo, useState } from 'react'

import {
  Avatar,
  AvatarFallback,
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
import { getInitials } from '@utils/utils'

import { PullRequestCommentBox } from './pull-request-comment-box'

interface TimelineItemProps {
  header: {
    avatar?: React.ReactNode
    name?: string
    description?: React.ReactNode
    selectStatus?: React.ReactNode
  }[]
  parentCommentId?: number
  commentId?: number
  currentUser?: string
  content?: React.ReactNode
  icon?: React.ReactNode
  isLast: boolean
  isComment?: boolean
  hideIconBorder?: boolean
  hideReply?: boolean
  contentClassName?: string
  replyBoxClassName?: string
  titleClassName?: string
  handleSaveComment?: (comment: string, parentId?: number) => void
  onEditClick?: () => void
  onCopyClick?: (commentId?: number) => void
  isEditMode?: boolean
  handleDeleteComment?: () => void
  isDeleted?: boolean
  hideReplyBox?: boolean
  setHideReplyBox?: (state: boolean) => void
  id?: string
  isResolved?: boolean
  toggleConversationStatus?: (status: string, parentId?: number) => void
  onCommentSaveAndStatusChange?: (comment: string, status: string, parentId?: number) => void
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
  onCopyClick?: (commentId?: number) => void
  commentId?: number
  handleDeleteComment?: () => void
  isDeleted?: boolean
}
const CRLF = '\n'

// Use React.memo for performance optimization if appropriate
const ItemHeader: React.FC<ItemHeaderProps> = memo(
  ({
    handleReplyBox,
    onEditClick,
    onCopyClick,
    commentId,
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
                <DropdownMenuItem className="cursor-pointer" onClick={() => onCopyClick?.(commentId)}>
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
  replyBoxClassName,
  handleSaveComment,
  commentId,
  parentCommentId,
  titleClassName,
  isComment,
  onEditClick,
  onCopyClick,
  isEditMode,
  handleDeleteComment,
  isDeleted = false,
  hideReplyBox,
  setHideReplyBox,
  currentUser,
  id,
  isResolved,
  toggleConversationStatus,
  onCommentSaveAndStatusChange
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
    <div id={id}>
      <NodeGroup.Root>
        {icon && <NodeGroup.Icon className={cn({ 'border-transparent': hideIconBorder })}>{icon}</NodeGroup.Icon>}
        <NodeGroup.Title className={titleClassName}>
          {/* Ensure that header has at least one item */}
          {header.length > 0 && (
            <ItemHeader
              handleReplyBox={handleReplyBox}
              isDeleted={isDeleted}
              setComment={setComment}
              onEditClick={onEditClick}
              onCopyClick={onCopyClick}
              comment={comment}
              isComment={isComment}
              handleDeleteComment={handleDeleteComment}
              commentId={commentId}
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
                  onSaveComment={() => {
                    handleSaveComment?.(comment, parentCommentId)
                    setComment('')
                  }}
                  currentUser={currentUser}
                  onCancelClick={() => {
                    setComment('')
                  }}
                  isResolved={isResolved}
                  comment={comment}
                  setComment={setComment}
                />
              ) : (
                content
              )}
              {!hideReply && (
                <>
                  {hideReplyBox ? (
                    <div className="flex w-full flex-col px-4">
                      <PullRequestCommentBox
                        inReplyMode
                        onSaveComment={() => {
                          handleSaveComment?.(comment, parentCommentId)
                          setHideReplyBox?.(false)
                        }}
                        currentUser={currentUser}
                        onCancelClick={() => {
                          setHideReplyBox?.(false)
                        }}
                        comment={comment}
                        isResolved={isResolved}
                        setComment={setComment}
                        parentCommentId={parentCommentId}
                        onCommentSaveAndStatusChange={onCommentSaveAndStatusChange}
                      />
                    </div>
                  ) : (
                    <>
                      <div className={cn('flex items-center gap-3 border-t', replyBoxClassName)}>
                        {currentUser ? (
                          <Avatar className="size-6 rounded-full p-0">
                            <AvatarFallback>
                              <Text size={1} color="tertiaryBackground">
                                {getInitials(currentUser ?? '', 2)}
                              </Text>
                            </AvatarFallback>
                          </Avatar>
                        ) : null}
                        <Input
                          value={comment}
                          placeholder="Reply here"
                          size="md"
                          onClick={() => {
                            setHideReplyBox?.(true)
                          }}
                          onChange={e => {
                            setComment(e.target.value)
                          }}
                        />
                      </div>
                      <div className={cn('flex gap-3 border-t', replyBoxClassName)}>
                        <Button
                          variant={'outline'}
                          onClick={() => {
                            toggleConversationStatus?.(isResolved ? 'active' : 'resolved', parentCommentId)
                          }}
                        >
                          {isResolved ? 'Reactivate' : 'Resolve Conversation'}
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </Card>
          </NodeGroup.Content>
        )}
        {!isLast && <NodeGroup.Connector />}
      </NodeGroup.Root>
    </div>
  )
}

export default PullRequestTimelineItem
