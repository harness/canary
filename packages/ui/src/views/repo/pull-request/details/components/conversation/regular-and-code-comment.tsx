import { FC, memo, useCallback, useState } from 'react'

import { Avatar, Icon, Layout } from '@/components'
import {
  CommentItem,
  isCodeComment,
  PullRequestCommentBox,
  PullRequestOverviewProps,
  removeLastPlus,
  TranslationStore,
  TypesPullReqActivity
} from '@/views'
import { DiffModeEnum } from '@git-diff-view/react'
import { timeAgo } from '@utils/utils'
import PullRequestDiffViewer from '@views/repo/pull-request/components/pull-request-diff-viewer'
import { PRCommentViewProps } from '@views/repo/pull-request/details/components/common/pull-request-comment-view'
import PullRequestTimelineItem, {
  TimelineItemProps
} from '@views/repo/pull-request/details/components/conversation/pull-request-timeline-item'
import { useDiffConfig } from '@views/repo/pull-request/hooks/useDiffConfig'
import { parseStartingLineIfOne, quoteTransform } from '@views/repo/pull-request/utils'
import { get } from 'lodash-es'

const getAvatar = (name?: string) => {
  return <Avatar name={name} rounded />
}

const getPayloadDependentData = (payload: TypesPullReqActivity | undefined) => {
  const headerData: TimelineItemProps['header'][number] = {
    avatar: getAvatar(payload?.author?.display_name),
    name: payload?.author?.display_name
  }

  if (!payload)
    return {
      codeDiffSnapshot: '',
      startingLine: null,
      headerData
    }

  const codeDiffSnapshot = [
    `diff --git a/src b/dest`,
    `new file mode 100644`,
    'index 0000000..0000000',
    `--- a/src/${get(payload, 'code_comment.path')}`,
    `+++ b/dest/${get(payload, 'code_comment.path')}`,
    `${get(payload, 'payload.title', '')} ttttt`,
    ...(get(payload, 'payload.lines', []) as string[])
  ].join('\n')

  return {
    codeDiffSnapshot,
    startingLine: parseStartingLineIfOne(codeDiffSnapshot),
    headerData
  }
}

interface CreateBaseCompProps
  extends Pick<PullRequestRegularAndCodeCommentProps, 'handleUpload' | 'currentUser' | 'toggleConversationStatus'> {
  payload: TypesPullReqActivity | undefined
  hideReplyHeres: Record<string, boolean>
  toggleReplyBox: (state: boolean, id?: number) => void
  quoteReplies: Record<number, { text: string }>
  handleQuoteReply: (commentId: number, originalText: string) => void
  headerData: TimelineItemProps['header'][number]
}

const createBaseComp = ({
  payload,
  handleUpload,
  hideReplyHeres,
  toggleReplyBox,
  quoteReplies,
  handleQuoteReply,
  currentUser,
  toggleConversationStatus,
  headerData
}: CreateBaseCompProps) => {
  const Component = ({
    customProps,
    customHeaderData
  }: {
    customProps: Partial<Omit<TimelineItemProps, 'header'>>
    customHeaderData: TimelineItemProps['header'][number]
  }) => {
    if (!payload?.id) return <></>

    return (
      <PullRequestTimelineItem
        replyBoxClassName="p-4"
        id={`comment-${payload?.id}`}
        handleUpload={handleUpload}
        data={payload?.text}
        hideReplyHere={hideReplyHeres[payload?.id]}
        setHideReplyHere={state => toggleReplyBox(state, payload?.id)}
        quoteReplyText={quoteReplies[payload?.id]?.text || ''}
        onQuoteReply={handleQuoteReply}
        currentUser={currentUser?.display_name}
        toggleConversationStatus={toggleConversationStatus}
        parentCommentId={payload?.id}
        hideEditDelete={payload?.author?.uid !== currentUser?.uid}
        header={[
          {
            ...headerData,
            ...customHeaderData
          }
        ]}
        {...customProps}
      />
    )
  }

  Component.displayName = 'PullRequestTimelineItemBase'

  return Component
}

export interface PullRequestRegularAndCodeCommentProps
  extends Pick<
    PullRequestOverviewProps,
    | 'handleUpload'
    | 'currentUser'
    | 'toggleConversationStatus'
    | 'handleSaveComment'
    | 'onCopyClick'
    | 'handleDeleteComment'
    | 'handleUpdateComment'
  > {
  commentItems: CommentItem<TypesPullReqActivity>[]
  parentItem?: CommentItem<TypesPullReqActivity>
  isLast: boolean
  useTranslationStore: () => TranslationStore
  componentViewBase: FC<{
    commentItem: PRCommentViewProps['commentItem']
    parentItem?: CommentItem<TypesPullReqActivity>
  }>
}

const PullRequestRegularAndCodeCommentInternal: FC<PullRequestRegularAndCodeCommentProps> = ({
  commentItems,
  parentItem,
  handleUpload,
  currentUser,
  toggleConversationStatus,
  isLast,
  handleSaveComment,
  onCopyClick,
  handleDeleteComment,
  useTranslationStore,
  handleUpdateComment,
  componentViewBase: ComponentViewBase
}) => {
  const { t } = useTranslationStore()
  const { highlight, wrap, fontsize } = useDiffConfig()

  const [hideReplyHeres, setHideReplyHeres] = useState<Record<string, boolean>>({})
  const [quoteReplies, setQuoteReplies] = useState<Record<number, { text: string }>>({})
  const [editModes, setEditModes] = useState<Record<string, boolean>>({})
  const [editComments, setEditComments] = useState<Record<string, string>>({})

  const payload = commentItems[0]?.payload

  const isCode = isCodeComment(commentItems)

  const { codeDiffSnapshot, startingLine, headerData } = getPayloadDependentData(payload)

  const toggleEditMode = useCallback(
    (id: string, initialText: string) => {
      setEditModes(prev => ({ ...prev, [id]: !prev[id] }))
      if (!editModes[id]) {
        setEditComments(prev => ({ ...prev, [id]: initialText }))
      }
    },
    [editModes]
  )

  const toggleReplyBox = useCallback((state: boolean, id?: number) => {
    if (id === undefined) {
      console.error('toggleEditMode called with undefined id')
      return
    }

    setHideReplyHeres(prev => ({ ...prev, [id]: state }))
  }, [])

  const handleQuoteReply = useCallback((commentId: number, originalText: string) => {
    setQuoteReplies(prev => ({
      ...prev,
      [commentId]: {
        text: quoteTransform(originalText)
      }
    }))
  }, [])

  /**
   * PullRequestTimelineItem component with basic common props
   */
  const BaseComp = createBaseComp({
    payload,
    handleUpload,
    hideReplyHeres,
    toggleReplyBox,
    quoteReplies,
    handleQuoteReply,
    currentUser,
    toggleConversationStatus,
    headerData
  })

  /**
   * Common items' comments section
   */
  const renderContentItemsBlock = () => (
    <div className="px-4 pt-4">
      {commentItems?.map((commentItem, idx) => {
        const componentId = `activity-comment-${commentItem?.id}`
        const commentIdAttr = `comment-${commentItem?.id}`
        const name = commentItem?.payload?.author?.display_name
        const avatar = getAvatar(name)

        return (
          <BaseComp
            key={`${commentItem.id}-${commentItem.author}-pr-comment`}
            customProps={{
              titleClassName: '!flex max-w-full',
              isNotCodeComment: isCode,
              id: commentIdAttr,
              data: commentItem.payload?.text,
              hideReplySection: true,
              isComment: true,
              isLast: commentItems.length - 1 === idx,
              onCopyClick,
              commentId: commentItem.id,
              isDeleted: !!commentItem?.deleted,
              handleDeleteComment: () => handleDeleteComment(commentItem?.id),
              onEditClick: () => toggleEditMode(componentId, commentItem?.payload?.text || ''),
              contentClassName: 'border-0 pb-0 rounded-none',
              icon: avatar,
              content: commentItem?.deleted ? (
                <div className="rounded-md border bg-cn-background-1 p-1">{t('views:pullRequests.deletedComment')}</div>
              ) : editModes[componentId] ? (
                <PullRequestCommentBox
                  handleUpload={handleUpload}
                  isEditMode
                  onSaveComment={() => {
                    if (commentItem?.id) {
                      handleUpdateComment?.(commentItem?.id, editComments[componentId])
                      toggleEditMode(componentId, '')
                    }
                  }}
                  currentUser={currentUser?.display_name}
                  onCancelClick={() => toggleEditMode(componentId, '')}
                  comment={editComments[componentId]}
                  setComment={text => setEditComments(prev => ({ ...prev, [componentId]: text }))}
                />
              ) : (
                <ComponentViewBase parentItem={parentItem} commentItem={commentItem} />
              )
            }}
            customHeaderData={{
              name,
              avatar: undefined,
              description: (
                <Layout.Horizontal className="text-cn-foreground-2">
                  <span>{timeAgo(commentItem?.created ? Number(commentItem.created) : undefined)}</span>
                  {!!commentItem?.deleted && (
                    <>
                      <span>&nbsp;|&nbsp;</span>
                      <span>{t('views:pullRequests.deleted')}</span>
                    </>
                  )}
                </Layout.Horizontal>
              )
            }}
          />
        )
      })}
    </div>
  )

  return isCode ? (
    <BaseComp
      customHeaderData={
        payload?.created
          ? {
              description: <div className="flex gap-x-1"> reviewed {timeAgo(payload?.created)}</div>
            }
          : {}
      }
      customProps={{
        isResolved: !!payload?.resolved,
        icon: <Icon name="pr-review" size={12} />,
        isLast,
        handleSaveComment,
        isNotCodeComment: true,
        contentHeader: <span className="font-medium text-cn-foreground-1">{payload?.code_comment?.path}</span>,
        content: (
          <div className="flex flex-col">
            {!!startingLine && (
              <div className="bg-[--diff-hunk-lineNumber--]">
                <div className="ml-16 w-full px-8 py-1">{startingLine}</div>
              </div>
            )}

            <PullRequestDiffViewer
              handleUpload={handleUpload}
              data={removeLastPlus(codeDiffSnapshot)}
              fileName={payload?.code_comment?.path ?? ''}
              lang={(payload?.code_comment?.path && payload?.code_comment?.path.split('.').pop()) || ''}
              fontsize={fontsize}
              highlight={highlight}
              mode={DiffModeEnum.Unified}
              wrap={wrap}
              addWidget={false}
              useTranslationStore={useTranslationStore}
            />

            {renderContentItemsBlock()}
          </div>
        )
      }}
    />
  ) : (
    <BaseComp
      customHeaderData={
        payload?.created
          ? {
              description: <div className="flex gap-x-1"> commented {timeAgo(payload?.created)}</div>
            }
          : {}
      }
      customProps={{
        titleClassName: '!flex max-w-full',
        isResolved: !!payload?.resolved,
        icon: <Icon name="pr-comment" size={12} />,
        isLast,
        handleSaveComment,
        content: renderContentItemsBlock()
      }}
    />
  )
}

export const PullRequestRegularAndCodeComment = memo(PullRequestRegularAndCodeCommentInternal)
