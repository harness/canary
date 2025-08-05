import { FC } from 'react'

import { Avatar, TextInput } from '@/components'
import { HandleUploadType, PrincipalPropsType, PrincipalsMentionMap, PullRequestCommentBox } from '@/views'
import { cn } from '@utils/cn'

export interface CommentReplyBoxProps {
  showReplyBox: boolean
  currentUser?: string
  replyText: string
  onReplyTextChange: (text: string) => void
  onSaveReply: () => Promise<void>
  onCancelReply: () => void
  onOpenReplyBox: () => void
  handleUpload?: HandleUploadType
  principalProps: PrincipalPropsType
  principalsMentionMap: PrincipalsMentionMap
  setPrincipalsMentionMap: React.Dispatch<React.SetStateAction<PrincipalsMentionMap>>
  className?: string
}

export const CommentReplyBox: FC<CommentReplyBoxProps> = ({
  showReplyBox,
  currentUser,
  replyText,
  onReplyTextChange,
  onSaveReply,
  onCancelReply,
  onOpenReplyBox,
  handleUpload,
  principalProps,
  principalsMentionMap,
  setPrincipalsMentionMap,
  className
}) => {
  if (showReplyBox) {
    return (
      <PullRequestCommentBox
        buttonTitle="Reply"
        principalsMentionMap={principalsMentionMap}
        setPrincipalsMentionMap={setPrincipalsMentionMap}
        principalProps={principalProps}
        handleUpload={handleUpload}
        inReplyMode
        onSaveComment={onSaveReply}
        onCancelClick={onCancelReply}
        comment={replyText}
        setComment={onReplyTextChange}
        className={className}
      />
    )
  }

  return (
    <div className={cn('flex items-center gap-3 border-t bg-cn-background-2', className)}>
      {currentUser && <Avatar name={currentUser} rounded />}
      <TextInput
        wrapperClassName="flex-1"
        placeholder="Reply here"
        onClick={onOpenReplyBox}
        onChange={e => onReplyTextChange(e.target.value)}
      />
    </div>
  )
}

CommentReplyBox.displayName = 'CommentReplyBox'
