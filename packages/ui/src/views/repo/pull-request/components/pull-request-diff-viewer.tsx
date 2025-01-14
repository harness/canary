import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  CommentItem,
  CommitSuggestion,
  CreateCommentPullReqRequest,
  PullRequestCommentBox,
  TranslationStore,
  TypesPullReqActivity
} from '@/views'
import { Avatar, AvatarFallback, Layout, Text } from '@components/index'
import { DiffFile, DiffModeEnum, DiffView, DiffViewProps, SplitSide } from '@git-diff-view/react'
import { getInitials, timeAgo } from '@utils/utils'
import { DiffBlock } from 'diff2html/lib/types'
import { debounce, get } from 'lodash-es'
import { OverlayScrollbars } from 'overlayscrollbars'

import constants from '../constants'
import PRCommentView from '../details/components/common/pull-request-comment-view'
import PullRequestTimelineItem from '../details/components/conversation/pull-request-timeline-item'
import { useDiffHighlighter } from '../hooks/useDiffHighlighter'

interface Thread {
  parent: CommentItem<TypesPullReqActivity>
  replies: CommentItem<TypesPullReqActivity>[]
}

interface PullRequestDiffviewerProps {
  data?: string
  fontsize: number
  highlight: boolean
  mode: DiffModeEnum
  wrap: boolean
  addWidget: boolean
  fileName: string
  lang: string
  fullContent?: string
  addedLines?: number
  removedLines?: number
  isBinary?: boolean
  deleted?: boolean
  unchangedPercentage?: number
  blocks?: DiffBlock[]
  currentUser?: string
  comments?: CommentItem<TypesPullReqActivity>[][]
  handleSaveComment?: (comment: string, parentId?: number, extra?: CreateCommentPullReqRequest) => void
  deleteComment?: (id: number) => void
  updateComment?: (id: number, comment: string) => void
  useTranslationStore: () => TranslationStore
  commentId?: string
  onCopyClick?: (commentId?: number) => void
  onCommentSaveAndStatusChange?: (comment: string, status: string, parentId?: number) => void
  suggestionsBatch?: CommitSuggestion[]
  onCommitSuggestion?: (suggestion: CommitSuggestion) => void
  addSuggestionToBatch?: (suggestion: CommitSuggestion) => void
  removeSuggestionFromBatch?: (commentId: number) => void
  filenameToLanguage?: (fileName: string) => string | undefined
  toggleConversationStatus?: (status: string, parentId?: number) => void
}

const PullRequestDiffViewer = ({
  data,
  highlight,
  fontsize,
  mode,
  wrap,
  addWidget,
  lang,
  fileName,
  fullContent,
  addedLines,
  removedLines,
  unchangedPercentage,
  deleted,
  isBinary,
  blocks,
  currentUser,
  comments,
  handleSaveComment,
  deleteComment,
  updateComment,
  useTranslationStore,
  commentId,
  onCopyClick,
  onCommentSaveAndStatusChange,
  suggestionsBatch,
  onCommitSuggestion,
  addSuggestionToBatch,
  removeSuggestionFromBatch,
  filenameToLanguage,
  toggleConversationStatus
}: PullRequestDiffviewerProps) => {
  const { t } = useTranslationStore()
  const ref = useRef<{ getDiffFileInstance: () => DiffFile }>(null)
  const [, setLoading] = useState(false)
  const highlighter = useDiffHighlighter({ setLoading })
  const reactWrapRef = useRef<HTMLDivElement>(null)
  const reactRef = useRef<HTMLDivElement | null>(null)
  const highlightRef = useRef(highlight)
  const fileUnchanged = useMemo(
    () => unchangedPercentage === 100 || (addedLines === 0 && removedLines === 0),
    [addedLines, removedLines, unchangedPercentage]
  )
  const diffHasVeryLongLine = useMemo(
    () => blocks?.some(block => block.lines?.some(line => line.content?.length > constants.MAX_TEXT_LINE_SIZE_LIMIT)),
    [blocks]
  )
  const fileDeleted = useMemo(() => deleted, [deleted])
  const isDiffTooLarge = useMemo(
    () => addedLines && removedLines && addedLines + removedLines > constants.PULL_REQUEST_LARGE_DIFF_CHANGES_LIMIT,
    [addedLines, removedLines]
  )
  const [renderCustomContent] = useState(
    // !shouldDiffBeShownByDefault &&
    fileUnchanged || fileDeleted || isDiffTooLarge || isBinary || diffHasVeryLongLine
  )
  highlightRef.current = highlight
  const [diffFileInstance, setDiffFileInstance] = useState<DiffFile>()

  const [
    scrollBar
    //  setScrollBar
  ] = useState(true)
  const [
    expandAll
    //  setExpandAll
  ] = useState(false)
  const [isScrolledToComment, setIsScrolledToComment] = useState(false)
  const [extend, setExtend] = useState<{
    oldFile: Record<number, { data: Thread[] }>
    newFile: Record<number, { data: Thread[] }>
  }>({ oldFile: {}, newFile: {} })

  useEffect(() => {
    if (expandAll && diffFileInstance) {
      diffFileInstance.onAllExpand(mode & DiffModeEnum.Split ? 'split' : 'unified')
    } else if (diffFileInstance) {
      diffFileInstance.onAllCollapse(mode & DiffModeEnum.Split ? 'split' : 'unified')
    }
  }, [expandAll, diffFileInstance, mode])

  // Build extendData from comments as threads
  useEffect(() => {
    if (!comments) return
    const newExtend = { oldFile: {}, newFile: {} } as {
      oldFile: Record<number, { data: Thread[] }>
      newFile: Record<number, { data: Thread[] }>
    }

    comments.forEach(threadArr => {
      if (threadArr.length === 0) return
      const parentComment = threadArr[0]
      const codeComment = parentComment.payload?.payload?.code_comment
      if (!codeComment) return
      const rightSide = get(parentComment.payload?.payload?.payload, 'line_start_new', false)
      const side: 'oldFile' | 'newFile' = rightSide ? 'newFile' : 'oldFile'
      const lineNumber = rightSide ? codeComment.line_new : codeComment.line_old
      if (lineNumber == null) return

      const parent = {
        author: parentComment.author,
        created: parentComment.created,
        content: parentComment.content,
        id: parentComment.id,
        edited: parentComment.edited,
        updated: parentComment.updated,
        deleted: parentComment.deleted,
        outdated: parentComment.outdated,
        payload: parentComment.payload
      }

      const replies = threadArr.slice(1).map(reply => ({
        author: reply.author,
        created: reply.created,
        content: reply.content,
        id: reply.id,
        payload: reply.payload,
        edited: reply.edited,
        updated: reply.updated,
        deleted: reply.deleted,
        outdated: reply.outdated
      }))

      if (!newExtend[side][lineNumber]) {
        newExtend[side][lineNumber] = { data: [] }
      }
      newExtend[side][lineNumber].data.push({ parent, replies })
    })

    setExtend(newExtend)
  }, [comments])

  useEffect(() => {
    if (diffFileInstance && scrollBar && !wrap) {
      const instanceArray: OverlayScrollbars[] = []
      const init = () => {
        const isSplitMode = mode & DiffModeEnum.Split
        if (isSplitMode) {
          const leftScrollbar = reactWrapRef.current?.querySelector('[data-left]') as HTMLDivElement
          const rightScrollbar = reactWrapRef.current?.querySelector('[data-right]') as HTMLDivElement
          const scrollContainers = Array.from(
            reactRef.current?.querySelectorAll('.scrollbar-hide') || []
          ) as HTMLDivElement[]
          const [left, right] = scrollContainers
          if (left && right) {
            const i1 = OverlayScrollbars(
              { target: left, scrollbars: { slot: leftScrollbar } },
              {
                overflow: {
                  y: 'hidden'
                }
              }
            )
            const i2 = OverlayScrollbars(
              { target: right, scrollbars: { slot: rightScrollbar } },
              {
                overflow: {
                  y: 'hidden'
                }
              }
            )
            instanceArray.push(i1, i2)
            const leftScrollEle = i1.elements().scrollEventElement as HTMLDivElement
            const rightScrollEle = i2.elements().scrollEventElement as HTMLDivElement
            i1.on('scroll', () => {
              rightScrollEle.scrollLeft = leftScrollEle.scrollLeft
            })
            i2.on('scroll', () => {
              leftScrollEle.scrollLeft = rightScrollEle.scrollLeft
            })
          }
        } else {
          const scrollBarContainer = reactWrapRef.current?.querySelector('[data-full]') as HTMLDivElement
          const scrollContainer = reactRef.current?.querySelector('.scrollbar-hide') as HTMLDivElement
          if (scrollContainer) {
            const i = OverlayScrollbars(
              { target: scrollContainer, scrollbars: { slot: scrollBarContainer } },
              {
                overflow: {
                  y: 'hidden'
                }
              }
            )
            instanceArray.push(i)
          }
        }
      }
      const id = setTimeout(init, 1000)
      return () => {
        clearTimeout(id)
        instanceArray.forEach(i => i.destroy())
      }
    }
  }, [diffFileInstance, scrollBar, wrap, mode, data])

  const setDiffInstanceCb = useCallback(
    debounce((fileName: string, lang: string, diffString: string, content?: string) => {
      if (!diffString) {
        setDiffFileInstance(undefined)
        return
      }
      const data = DiffFile.createInstance({
        newFile: { fileName: fileName, fileLang: lang, content: content },
        hunks: [diffString]
      })
      try {
        data?.init()
        if (mode === DiffModeEnum.Split) {
          data?.buildSplitDiffLines()
        } else {
          data?.buildUnifiedDiffLines()
        }

        setDiffFileInstance(data)
      } catch (e) {
        alert((e as Error).message)
      }
    }, 100),
    []
  )

  useEffect(() => {
    if (data) {
      setDiffInstanceCb(fileName, lang, data, fullContent)
    }
  }, [data, fileName, lang, fullContent, setDiffInstanceCb])

  const [editModes, setEditModes] = useState<{ [key: string]: boolean }>({})
  const [editComments, setEditComments] = useState<{ [key: string]: string }>({})
  const [hideReplyBoxes, setHideReplyBoxes] = useState<{ [key: string]: boolean }>({})

  const toggleEditMode = (id: string, initialText: string) => {
    setEditModes(prev => ({ ...prev, [id]: !prev[id] }))
    if (!editModes[id]) {
      setEditComments(prev => ({ ...prev, [id]: initialText }))
    }
  }

  const toggleReplyBox = (state: boolean, id?: number) => {
    if (id === undefined) {
      console.error('toggleEditMode called with undefined id')
      return
    }
    setHideReplyBoxes(prev => ({ ...prev, [id]: state }))
  }

  const [newComments, setNewComments] = useState<Record<string, string>>({})

  function getNewCommentKey(side: SplitSide, lineNumber: number) {
    return `${side}:${lineNumber}`
  }
  function getNewCommentValue(side: SplitSide, lineNumber: number) {
    return newComments[getNewCommentKey(side, lineNumber)] ?? ''
  }
  function setNewCommentValue(side: SplitSide, lineNumber: number, text: string) {
    setNewComments(prev => ({ ...prev, [getNewCommentKey(side, lineNumber)]: text }))
  }

  const renderWidgetLine = useCallback<NonNullable<DiffViewProps<Thread[]>['renderWidgetLine']>>(
    ({ onClose, side, lineNumber }) => {
      const sideKey = side === SplitSide.old ? 'oldFile' : 'newFile'
      const commentText = getNewCommentValue(side, lineNumber)

      return (
        <div className="flex w-full flex-col border px-[4px] py-[8px]">
          <PullRequestCommentBox
            isEditMode
            onSaveComment={() => {
              onClose()
              if (commentText.trim() && handleSaveComment) {
                handleSaveComment(commentText.trim(), undefined, {
                  line_end: lineNumber,
                  line_end_new: sideKey === 'newFile',
                  line_start: lineNumber,
                  line_start_new: sideKey === 'newFile',
                  path: fileName
                })
              }
              setNewCommentValue(side, lineNumber, '')
            }}
            currentUser={currentUser}
            onCancelClick={() => {
              onClose()
              setNewCommentValue(side, lineNumber, '')
            }}
            comment={commentText}
            setComment={value => setNewCommentValue(side, lineNumber, value)}
          />
        </div>
      )
    },
    [handleSaveComment, fileName, newComments, currentUser]
  )

  const renderExtendLine = useCallback<NonNullable<DiffViewProps<Thread[]>['renderExtendLine']>>(
    ({ data: threads }) => {
      if (!threads) return <></>

      return (
        <div className="w- rounded border bg-background">
          {threads.map(thread => {
            const parent = thread.parent
            const componentId = `activity-code-${parent?.id}`
            const parentIdAttr = `comment-${parent?.id}`
            const replies = thread.replies
            const parentInitials = getInitials(parent.author ?? '', 2)
            return (
              <PullRequestTimelineItem
                key={parent.id}
                id={parentIdAttr}
                parentCommentId={parent.id}
                handleSaveComment={handleSaveComment}
                isLast={true}
                contentClassName="px-4 py-2 w-[calc(100%-38px)]"
                header={[]}
                currentUser={currentUser}
                isComment
                replyBoxClassName="py-4"
                hideReplyBox={hideReplyBoxes[parent?.id]}
                setHideReplyBox={state => toggleReplyBox(state, parent?.id)}
                isResolved={!!parent.payload?.resolved}
                toggleConversationStatus={toggleConversationStatus}
                onCommentSaveAndStatusChange={onCommentSaveAndStatusChange}
                content={
                  <div className="flex-col">
                    <PullRequestTimelineItem
                      titleClassName="!flex max-w-full"
                      parentCommentId={parent.id}
                      handleSaveComment={handleSaveComment}
                      isLast={replies.length === 0}
                      hideReply
                      isComment
                      replyBoxClassName=""
                      handleDeleteComment={() => deleteComment?.(parent?.id)}
                      onEditClick={() => toggleEditMode(componentId, parent?.payload?.payload?.text || '')}
                      contentClassName="border-transparent"
                      onCopyClick={onCopyClick}
                      commentId={parent.id}
                      icon={
                        <Avatar className="size-6 rounded-full p-0">
                          <AvatarFallback>
                            <Text size={1} color="tertiaryBackground">
                              {parentInitials}
                            </Text>
                          </AvatarFallback>
                        </Avatar>
                      }
                      header={[
                        {
                          name: parent.author,
                          description: (
                            <Layout.Horizontal>
                              <span className="text-foreground-3">{timeAgo(parent?.created as number)}</span>
                              {parent?.deleted ? (
                                <>
                                  <span className="text-foreground-3">&nbsp;|&nbsp;</span>
                                  <span className="text-foreground-3">{t('views:pullRequests.deleted')} </span>
                                </>
                              ) : null}
                            </Layout.Horizontal>
                          )
                        }
                      ]}
                      content={
                        parent?.deleted ? (
                          <div className="rounded-md border bg-primary-background p-1">
                            {t('views:pullRequests.deletedComment')}
                          </div>
                        ) : editModes[componentId] ? (
                          <PullRequestCommentBox
                            isEditMode
                            onSaveComment={() => {
                              if (parent?.id) {
                                updateComment?.(parent?.id, editComments[componentId])
                                toggleEditMode(componentId, '')
                              }
                            }}
                            currentUser={currentUser}
                            onCancelClick={() => {
                              toggleEditMode(componentId, '')
                            }}
                            comment={editComments[componentId]}
                            setComment={(text: string) => setEditComments(prev => ({ ...prev, [componentId]: text }))}
                          />
                        ) : (
                          <PRCommentView
                            commentItem={parent}
                            filenameToLanguage={filenameToLanguage}
                            suggestionsBatch={suggestionsBatch}
                            onCommitSuggestion={onCommitSuggestion}
                            addSuggestionToBatch={addSuggestionToBatch}
                            removeSuggestionFromBatch={removeSuggestionFromBatch}
                          />
                        )
                      }
                    />
                    {replies?.length > 0
                      ? replies.map((reply, idx) => {
                          const replyInitials = getInitials(reply.author ?? '', 2)
                          const isLastComment = idx === replies.length - 1
                          const replyComponentId = `activity-code-${reply?.id}`
                          const replyIdAttr = `comment-${reply?.id}`

                          return (
                            <PullRequestTimelineItem
                              key={reply.id}
                              id={replyIdAttr}
                              parentCommentId={parent?.id}
                              isLast={isLastComment}
                              handleSaveComment={handleSaveComment}
                              hideReply
                              isComment
                              onCopyClick={onCopyClick}
                              commentId={reply.id}
                              isDeleted={!!reply?.deleted}
                              handleDeleteComment={() => deleteComment?.(reply?.id)}
                              onEditClick={() => toggleEditMode(replyComponentId, reply?.payload?.payload?.text || '')}
                              contentClassName="border-transparent"
                              titleClassName="!flex max-w-full"
                              icon={
                                <Avatar className="size-6 rounded-full p-0">
                                  <AvatarFallback>
                                    <Text size={1} color="tertiaryBackground">
                                      {replyInitials}
                                    </Text>
                                  </AvatarFallback>
                                </Avatar>
                              }
                              header={[
                                {
                                  name: reply.author,
                                  description: (
                                    <Layout.Horizontal>
                                      <span className="text-foreground-3">{timeAgo(reply?.created as number)}</span>
                                      {reply?.deleted ? (
                                        <>
                                          <span className="text-foreground-3">&nbsp;|&nbsp;</span>
                                          <span className="text-foreground-3">{t('views:pullRequests.deleted')} </span>
                                        </>
                                      ) : null}
                                    </Layout.Horizontal>
                                  )
                                }
                              ]}
                              content={
                                reply?.deleted ? (
                                  <div className="rounded-md border bg-primary-background p-1">
                                    {t('views:pullRequests.deletedComment')}
                                  </div>
                                ) : editModes[replyComponentId] ? (
                                  <PullRequestCommentBox
                                    isEditMode
                                    isResolved={!!parent?.payload?.resolved}
                                    onSaveComment={() => {
                                      if (reply?.id) {
                                        updateComment?.(reply?.id, editComments[replyComponentId])
                                        toggleEditMode(replyComponentId, '')
                                      }
                                    }}
                                    currentUser={currentUser}
                                    onCancelClick={() => {
                                      toggleEditMode(replyComponentId, '')
                                    }}
                                    comment={editComments[replyComponentId]}
                                    setComment={text =>
                                      setEditComments(prev => ({ ...prev, [replyComponentId]: text }))
                                    }
                                    onCommentSaveAndStatusChange={onCommentSaveAndStatusChange}
                                  />
                                ) : (
                                  <PRCommentView
                                    commentItem={reply}
                                    filenameToLanguage={filenameToLanguage}
                                    suggestionsBatch={suggestionsBatch}
                                    onCommitSuggestion={onCommitSuggestion}
                                    addSuggestionToBatch={addSuggestionToBatch}
                                    removeSuggestionFromBatch={removeSuggestionFromBatch}
                                  />
                                )
                              }
                            />
                          )
                        })
                      : null}
                  </div>
                }
              />
            )
          })}
        </div>
      )
    },
    [currentUser, handleSaveComment, updateComment, deleteComment, fileName, hideReplyBoxes, editModes, editComments, t]
  )

  // Scroll to commentId whenever extendData or commentId changes
  useEffect(() => {
    if (!commentId || isScrolledToComment) return
    // Slight timeout so the UI has time to expand/hydrate
    const timeoutId = setTimeout(() => {
      const elem = document.getElementById(`comment-${commentId}`)
      if (!elem) return
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setIsScrolledToComment(true)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [commentId, extend])

  return (
    <>
      {diffFileInstance && !renderCustomContent && (
        <DiffView<Thread[]>
          ref={ref}
          className="bg-tr w-full text-tertiary-background"
          renderWidgetLine={renderWidgetLine}
          renderExtendLine={renderExtendLine}
          diffFile={diffFileInstance}
          extendData={extend}
          diffViewFontSize={fontsize}
          diffViewHighlight={highlight}
          diffViewMode={mode}
          registerHighlighter={highlighter}
          diffViewWrap={wrap}
          diffViewAddWidget={addWidget}
        />
      )}
      {renderCustomContent && (
        <div className="pl-6 pt-4">
          {fileDeleted
            ? 'This file was deleted.'
            : isDiffTooLarge || diffHasVeryLongLine
              ? 'Large diffs are not rendered by default.'
              : isBinary
                ? 'Binary file not shown.'
                : 'File without changes.'}
        </div>
      )}
    </>
  )
}

export default PullRequestDiffViewer
