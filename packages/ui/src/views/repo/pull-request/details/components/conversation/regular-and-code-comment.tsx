import { FC, memo, useCallback, useState } from 'react'

import { Avatar, CopyButton, IconV2, Layout, Separator, Tag, Text, TextInput, TimeAgoCard } from '@/components'
import { useTranslation } from '@/context'
import {
  activitiesToDiffCommentItems,
  CommentItem,
  isCodeComment,
  PrincipalPropsType,
  PrincipalsMentionMap,
  PullRequestCommentBox,
  PullRequestOverviewProps,
  removeLastPlus,
  TypesPullReqActivity
} from '@/views'
import { DiffModeEnum } from '@git-diff-view/react'
import PullRequestDiffViewer from '@views/repo/pull-request/components/pull-request-diff-viewer'
import { PRCommentViewProps } from '@views/repo/pull-request/details/components/common/pull-request-comment-view'
import PullRequestTimelineItem, {
  TimelineItemProps
} from '@views/repo/pull-request/details/components/conversation/pull-request-timeline-item'
import { useDiffConfig } from '@views/repo/pull-request/hooks/useDiffConfig'
import { parseStartingLineIfOne, quoteTransform } from '@views/repo/pull-request/utils'
import { get } from 'lodash-es'

import { replaceEmailAsKey, replaceMentionEmailWithId, replaceMentionIdWithEmail } from './utils'

const getAvatar = (name?: string) => <Avatar name={name} rounded />

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

interface BaseCompProps {
  payload: TypesPullReqActivity | undefined
  handleUpload: PullRequestOverviewProps['handleUpload']
  hideReplyHeres: Record<string, boolean>
  toggleReplyBox: (state: boolean, id?: number) => void
  quoteReplies: Record<number, { text: string }>
  handleQuoteReply: (commentId: number, originalText: string, mentions: PrincipalsMentionMap) => void
  currentUser: PullRequestOverviewProps['currentUser']
  toggleConversationStatus: PullRequestOverviewProps['toggleConversationStatus']
  headerData: TimelineItemProps['header'][number]
  customProps: Partial<Omit<TimelineItemProps, 'header'>>
  customHeaderData: TimelineItemProps['header'][number]
  principalProps: PrincipalPropsType
  principalsMentionMap: PrincipalsMentionMap
  setPrincipalsMentionMap: React.Dispatch<React.SetStateAction<PrincipalsMentionMap>>
  isReply?: boolean
}

const BaseComp: FC<BaseCompProps> = ({
  payload,
  handleUpload,
  hideReplyHeres,
  toggleReplyBox,
  quoteReplies,
  handleQuoteReply,
  currentUser,
  toggleConversationStatus,
  headerData,
  customProps,
  customHeaderData,
  principalProps,
  principalsMentionMap,
  setPrincipalsMentionMap,
  isReply
}) => {
  if (!payload?.id) return null

  return (
    <PullRequestTimelineItem
      isReply={isReply}
      principalsMentionMap={principalsMentionMap}
      setPrincipalsMentionMap={setPrincipalsMentionMap}
      principalProps={principalProps}
      replyBoxClassName="p-4"
      id={`comment-${payload?.id}`}
      handleUpload={handleUpload}
      data={payload?.text}
      hideReplyHere={hideReplyHeres[payload?.id]}
      setHideReplyHere={state => toggleReplyBox(state, payload?.id)}
      quoteReplyText={quoteReplies[payload?.id]?.text || ''}
      onQuoteReply={(commentId: number, originalText: string) =>
        handleQuoteReply(commentId, originalText, payload?.mentions || {})
      }
      currentUser={currentUser?.display_name}
      toggleConversationStatus={toggleConversationStatus}
      parentCommentId={payload?.id}
      hideEditDelete={payload?.author?.uid !== currentUser?.uid}
      payload={payload}
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

BaseComp.displayName = 'BaseComp'

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
  componentViewBase: FC<{
    commentItem: PRCommentViewProps['commentItem']
    parentItem?: CommentItem<TypesPullReqActivity>
  }>
  principalProps: PrincipalPropsType
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
  handleUpdateComment,
  componentViewBase: ComponentViewBase,
  principalProps
}) => {
  const { t } = useTranslation()
  const { highlight, wrap, fontsize } = useDiffConfig()

  const [hideReplyHeres, setHideReplyHeres] = useState<Record<string, boolean>>({})
  const [quoteReplies, setQuoteReplies] = useState<Record<number, { text: string }>>({})
  const [editModes, setEditModes] = useState<Record<string, boolean>>({})
  const [editComments, setEditComments] = useState<Record<string, string>>({})

  // const initialPrincipalsMentionMap = replaceEmailAsKey(parentItem?.payload?.mentions || {})
  const [principalsMentionMap, setPrincipalsMentionMap] = useState<PrincipalsMentionMap>(() =>
    replaceEmailAsKey(parentItem?.payload?.mentions || {})
  )

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
    if (id === undefined) return
    setHideReplyHeres(prev => ({ ...prev, [id]: state }))
  }, [])

  const handleQuoteReply = useCallback((commentId: number, originalText: string, mentions: PrincipalsMentionMap) => {
    setQuoteReplies(prev => ({
      ...prev,
      [commentId]: {
        text: replaceMentionIdWithEmail(quoteTransform(originalText), mentions)
      }
    }))
  }, [])

  const renderContentItemsBlock = () => (
    <div className="px-4 pt-4">
      {commentItems?.map((commentItem, idx) => {
        const componentId = `activity-comment-${commentItem.id}`
        const commentIdAttr = `comment-${commentItem.id}`
        const name = commentItem.payload?.author?.display_name
        const avatar = getAvatar(name)
        // codeBlockContent is required for suggestions in a code-comment, TODO: fix this parsing at gitness for both conversation and changes
        commentItem.codeBlockContent = activitiesToDiffCommentItems(
          commentItem,
          'payload.payload',
          'payload'
        ).codeBlockContent

        return (
          <BaseComp
            isReply={parentItem?.id !== commentItem.id}
            key={`${commentItem.id}-${commentItem.author}-pr-comment`}
            principalProps={principalProps}
            principalsMentionMap={principalsMentionMap}
            setPrincipalsMentionMap={setPrincipalsMentionMap}
            payload={payload}
            handleUpload={handleUpload}
            hideReplyHeres={hideReplyHeres}
            toggleReplyBox={toggleReplyBox}
            quoteReplies={quoteReplies}
            handleQuoteReply={(commentId: number, originalText: string) =>
              handleQuoteReply(commentId, originalText, commentItem?.payload?.mentions || {})
            }
            currentUser={currentUser}
            toggleConversationStatus={toggleConversationStatus}
            headerData={headerData}
            customProps={{
              titleClassName: '!flex max-w-full',
              isNotCodeComment: isCode,
              id: commentIdAttr,
              data: commentItem.payload?.text,
              isResolved: !!payload?.resolved,
              hideReplySection: true,
              isComment: true,
              isLast: (commentItems?.length || 0) - 1 === idx,
              onCopyClick,
              commentId: commentItem.id,
              isDeleted: !!commentItem.deleted,
              handleDeleteComment: () => handleDeleteComment(commentItem.id),
              onEditClick: () => toggleEditMode(componentId, commentItem.payload?.text || ''),
              contentClassName: 'border-0 pb-0 rounded-none',
              icon: avatar,
              content: commentItem.deleted ? (
                <TextInput value={t('views:pullRequests.deletedComment')} disabled />
              ) : editModes[componentId] ? (
                <PullRequestCommentBox
                  autofocus
                  principalsMentionMap={principalsMentionMap}
                  setPrincipalsMentionMap={setPrincipalsMentionMap}
                  principalProps={principalProps}
                  handleUpload={handleUpload}
                  isEditMode
                  onSaveComment={() => {
                    if (commentItem.id) {
                      return handleUpdateComment?.(
                        commentItem.id,
                        replaceMentionEmailWithId(editComments[componentId], principalsMentionMap)
                      ).then(() => {
                        toggleEditMode(componentId, '')
                      })
                    }
                  }}
                  currentUser={currentUser?.display_name}
                  onCancelClick={() => toggleEditMode(componentId, '')}
                  comment={replaceMentionIdWithEmail(editComments[componentId], commentItem?.payload?.mentions || {})}
                  setComment={text => setEditComments(prev => ({ ...prev, [componentId]: text }))}
                />
              ) : (
                <ComponentViewBase parentItem={parentItem} commentItem={commentItem} />
              )
            }}
            customHeaderData={{
              name,
              avatar: undefined,
              description: <TimeAgoCard timestamp={commentItem.created} />
            }}
          />
        )
      })}
    </div>
  )

  return isCode ? (
    <BaseComp
      principalsMentionMap={principalsMentionMap}
      setPrincipalsMentionMap={setPrincipalsMentionMap}
      payload={payload}
      principalProps={principalProps}
      handleUpload={handleUpload}
      hideReplyHeres={hideReplyHeres}
      toggleReplyBox={toggleReplyBox}
      quoteReplies={quoteReplies}
      handleQuoteReply={(commentId: number, originalText: string) =>
        handleQuoteReply(commentId, originalText, parentItem?.payload?.mentions || {})
      }
      currentUser={currentUser}
      toggleConversationStatus={toggleConversationStatus}
      headerData={headerData}
      customHeaderData={
        payload?.created
          ? {
              description: (
                <Layout.Horizontal align="center" gap="3xs">
                  <Text variant="body-single-line-normal">reviewed</Text>
                  <TimeAgoCard timestamp={payload.created} />
                  {payload?.code_comment?.outdated && (
                    <>
                      <Separator orientation="vertical" className="h-3.5 mx-1" />
                      <Tag key={'outdated'} value="OUTDATED" theme="orange" />
                    </>
                  )}
                </Layout.Horizontal>
              )
            }
          : {}
      }
      customProps={{
        isResolved: !!payload?.resolved,
        icon: <IconV2 name="eye" size="xs" />,
        isLast,
        handleSaveComment,
        isNotCodeComment: true,
        contentHeader: (
          <Layout.Horizontal gap="sm" align="center">
            <Text variant="body-single-line-normal">{payload?.code_comment?.path}</Text>
            <CopyButton name={payload?.code_comment?.path || ''} size="xs" color="gray" />
          </Layout.Horizontal>
        ),
        content: (
          <div className="flex flex-col">
            {!!startingLine && (
              <div className="bg-[--diff-hunk-lineNumber--]">
                <div className="ml-16 w-full px-8 py-1">{startingLine}</div>
              </div>
            )}
            <PullRequestDiffViewer
              principalProps={principalProps}
              handleUpload={handleUpload}
              data={removeLastPlus(codeDiffSnapshot)}
              fileName={payload?.code_comment?.path ?? ''}
              lang={(payload?.code_comment?.path && payload?.code_comment?.path.split('.').pop()) || ''}
              fontsize={fontsize}
              highlight={highlight}
              mode={DiffModeEnum.Unified}
              wrap={wrap}
              addWidget={false}
            />
            {renderContentItemsBlock()}
          </div>
        )
      }}
    />
  ) : (
    <BaseComp
      principalsMentionMap={principalsMentionMap}
      setPrincipalsMentionMap={setPrincipalsMentionMap}
      payload={payload}
      principalProps={principalProps}
      handleUpload={handleUpload}
      hideReplyHeres={hideReplyHeres}
      toggleReplyBox={toggleReplyBox}
      quoteReplies={quoteReplies}
      handleQuoteReply={(commentId: number, originalText: string) =>
        handleQuoteReply(commentId, originalText, parentItem?.payload?.mentions || {})
      }
      currentUser={currentUser}
      toggleConversationStatus={toggleConversationStatus}
      headerData={headerData}
      customHeaderData={
        payload?.created
          ? {
              description: (
                <Layout.Horizontal align="center" gap="3xs">
                  <Text variant="body-normal">commented</Text>
                  <TimeAgoCard timestamp={payload.created} />
                </Layout.Horizontal>
              )
            }
          : {}
      }
      customProps={{
        titleClassName: '!flex max-w-full',
        isResolved: !!payload?.resolved,
        icon: <IconV2 name="pr-comment" size="xs" />,
        isLast,
        handleSaveComment,
        content: renderContentItemsBlock()
      }}
    />
  )
}

export const PullRequestRegularAndCodeComment = memo(PullRequestRegularAndCodeCommentInternal)
PullRequestRegularAndCodeComment.displayName = 'PullRequestRegularAndCodeComment'
