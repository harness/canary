import { FC, ReactNode } from 'react'

import { TextInput } from '@/components'
import { useTranslation } from '@/context'
import { HandleUploadType, PrincipalPropsType, PrincipalsMentionMap, PullRequestCommentBox } from '@/views'

export interface CommentContentProps {
  content?: ReactNode
  isEditMode?: boolean
  isDeleted?: boolean
  comment?: string
  setComment?: (value: string) => void
  onSaveComment?: () => Promise<void>
  onCancelEdit?: () => void
  currentUser?: string
  handleUpload?: HandleUploadType
  principalProps: PrincipalPropsType
  principalsMentionMap: PrincipalsMentionMap
  setPrincipalsMentionMap: React.Dispatch<React.SetStateAction<PrincipalsMentionMap>>
  className?: string
}

export const CommentContent: FC<CommentContentProps> = ({
  content,
  isEditMode = false,
  isDeleted = false,
  comment = '',
  setComment,
  onSaveComment,
  onCancelEdit,
  currentUser,
  handleUpload,
  principalProps,
  principalsMentionMap,
  setPrincipalsMentionMap,
  className
}) => {
  const { t } = useTranslation()

  if (isDeleted) {
    return <TextInput value={t('views:pullRequests.deletedComment')} disabled />
  }

  if (isEditMode) {
    return (
      <PullRequestCommentBox
        principalsMentionMap={principalsMentionMap}
        setPrincipalsMentionMap={setPrincipalsMentionMap}
        principalProps={principalProps}
        handleUpload={handleUpload}
        isEditMode
        currentUser={currentUser}
        onSaveComment={onSaveComment}
        onCancelClick={onCancelEdit}
        comment={comment}
        setComment={setComment}
        className={className}
      />
    )
  }

  return <div className={className}>{content}</div>
}

CommentContent.displayName = 'CommentContent'
