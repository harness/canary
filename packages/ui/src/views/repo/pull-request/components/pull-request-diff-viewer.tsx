import { useCallback, useEffect, useRef, useState } from 'react'

import { Avatar, Layout } from '@/components'
import {
  CommentItem,
  CommitSuggestion,
  CreateCommentPullReqRequest,
  HandleUploadType,
  PullRequestCommentBox,
  TranslationStore,
  TypesPullReqActivity
} from '@/views'
import { DiffFile, DiffModeEnum, DiffView, DiffViewProps, SplitSide } from '@git-diff-view/react'
import { useCustomEventListener } from '@hooks/use-event-listener'
import { useMemoryCleanup } from '@hooks/use-memory-cleanup'
import { getInitials, timeAgo } from '@utils/utils'
import { DiffBlock } from 'diff2html/lib/types'
import { debounce, get } from 'lodash-es'
import { OverlayScrollbars } from 'overlayscrollbars'

import PRCommentView from '../details/components/common/pull-request-comment-view'
import PullRequestTimelineItem from '../details/components/conversation/pull-request-timeline-item'
import { useDiffHighlighter } from '../hooks/useDiffHighlighter'
import { quoteTransform } from '../utils'

interface Thread {
  parent: CommentItem<TypesPullReqActivity>
  replies: CommentItem<TypesPullReqActivity>[]
}

export enum DiffViewerEvent {
  SCROLL_INTO_VIEW = 'scrollIntoView'
}

export interface DiffViewerCustomEvent {
  action: DiffViewerEvent
  commentId?: string
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
  onCopyClick?: (commentId?: number) => void
  suggestionsBatch?: CommitSuggestion[]
  onCommitSuggestion?: (suggestion: CommitSuggestion) => void
  addSuggestionToBatch?: (suggestion: CommitSuggestion) => void
  removeSuggestionFromBatch?: (commentId: number) => void
  filenameToLanguage?: (fileName: string) => string | undefined
  toggleConversationStatus?: (status: string, parentId?: number) => void
  handleUpload?: HandleUploadType
  scrolledToComment?: boolean
  setScrolledToComment?: (val: boolean) => void
  collapseDiff?: () => void
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
  currentUser,
  comments,
  handleSaveComment,
  deleteComment,
  updateComment,
  useTranslationStore,
  onCopyClick,
  suggestionsBatch,
  onCommitSuggestion,
  addSuggestionToBatch,
  removeSuggestionFromBatch,
  filenameToLanguage,
  toggleConversationStatus,
  handleUpload,
  scrolledToComment,
  setScrolledToComment,
  collapseDiff
}: PullRequestDiffviewerProps) => {
  const { t } = useTranslationStore()
  const ref = useRef<{ getDiffFileInstance: () => DiffFile }>(null)
  const [, setLoading] = useState(false)
  const highlighter = useDiffHighlighter({ setLoading })
  const reactWrapRef = useRef<HTMLDivElement>(null)
  const reactRef = useRef<HTMLDivElement | null>(null)
  const highlightRef = useRef(highlight)
  highlightRef.current = highlight
  const [diffFileInstance, setDiffFileInstance] = useState<DiffFile>()
  const overlayScrollbarsInstances = useRef<OverlayScrollbars[]>([])
  const diffInstanceRef = useRef<HTMLDivElement | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
      }
    )

    const currentRef = diffInstanceRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  const cleanup = useCallback(() => {
    // clean up diff instance if it is not in view
    if (!isInView && diffFileInstance) {
      const diffRect = diffInstanceRef.current?.getBoundingClientRect()
      // check if diff is below viewport and collapse it, collapsing a diff on top of viewport impacts scroll position
      if (diffRect?.top && diffRect?.top >= (window.innerHeight || document.documentElement.clientHeight)) {
        collapseDiff?.()
      }
    }
  }, [diffFileInstance, isInView, collapseDiff])

  // Use memory cleanup hook
  useMemoryCleanup(cleanup)

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [])

  const [quoteReplies, setQuoteReplies] = useState<Record<number, { text: string }>>({})
  const handleQuoteReply = useCallback((parentId: number, originalText: string) => {
    const quoted = quoteTransform(originalText)
    setQuoteReplies(prev => ({
      ...prev,
      [parentId]: {
        text: quoted
      }
    }))
  }, [])

  const [
    scrollBar
    //  setScrollBar
  ] = useState(true)
  const [
    expandAll
    //  setExpandAll
  ] = useState(false)
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
            const instances = [
              OverlayScrollbars({ target: left, scrollbars: { slot: leftScrollbar } }, { overflow: { y: 'hidden' } }),
              OverlayScrollbars({ target: right, scrollbars: { slot: rightScrollbar } }, { overflow: { y: 'hidden' } })
            ]
            overlayScrollbarsInstances.current = instances
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
            overlayScrollbarsInstances.current = [i]
          }
        }
      }
      const id = setTimeout(init, 1000)
      return () => {
        clearTimeout(id)
        overlayScrollbarsInstances.current.forEach(instance => {
          instance.destroy()
        })
        overlayScrollbarsInstances.current = []
      }
    }
  }, [diffFileInstance, scrollBar, wrap, mode])

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
  const [hideReplyHeres, setHideReplyHeres] = useState<{ [key: string]: boolean }>({})

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
    setHideReplyHeres(prev => ({ ...prev, [id]: state }))
  }

  const [newComments, setNewComments] = useState<Record<string, string>>({})

  const renderWidgetLine = useCallback<NonNullable<DiffViewProps<Thread[]>['renderWidgetLine']>>(
    ({ onClose, side, lineNumber }) => {
      const sideKey = side === SplitSide.old ? 'oldFile' : 'newFile'
      const commentKey = `${side}:${lineNumber}`
      const commentText = newComments[commentKey] ?? ''

      return (
        <div className="flex w-full flex-col border-l border-borders-1 bg-background-1 p-4">
          <PullRequestCommentBox
            handleUpload={handleUpload}
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
              setNewComments(prev => ({ ...prev, [commentKey]: '' }))
            }}
            currentUser={currentUser}
            onCancelClick={() => {
              onClose()
              setNewComments(prev => ({ ...prev, [commentKey]: '' }))
            }}
            comment={commentText}
            setComment={value => setNewComments(prev => ({ ...prev, [commentKey]: value }))}
          />
        </div>
      )
    },
    [handleSaveComment, fileName, newComments, currentUser, handleUpload]
  )

  const renderExtendLine = useCallback<NonNullable<DiffViewProps<Thread[]>['renderExtendLine']>>(
    ({ data: threads }) => {
      if (!threads) return <></>

      return (
        <div className="border-l border-borders-1 bg-background-1">
          {threads.map(thread => {
            const parent = thread.parent
            const componentId = `activity-code-${parent?.id}`
            const parentIdAttr = `comment-${parent?.id}`
            const replies = thread.replies
            const parentInitials = getInitials(parent.author ?? '', 2)
            return (
              <PullRequestTimelineItem
                wrapperClassName="pb-3"
                key={parent.id}
                id={parentIdAttr}
                parentCommentId={parent.id}
                handleSaveComment={handleSaveComment}
                isLast={true}
                contentWrapperClassName="col-start-1 row-start-1 col-end-3 row-end-3 px-4 pt-4 pb-1"
                header={[]}
                currentUser={currentUser}
                isComment
                replyBoxClassName="p-4"
                hideReplyHere={hideReplyHeres[parent?.id]}
                setHideReplyHere={state => toggleReplyBox(state, parent?.id)}
                isResolved={!!parent.payload?.resolved}
                toggleConversationStatus={toggleConversationStatus}
                onQuoteReply={handleQuoteReply}
                quoteReplyText={quoteReplies[parent.id]?.text || ''}
                contentHeader={
                  !!parent.payload?.resolved && (
                    <div className="flex items-center gap-x-1">
                      <span className="font-medium text-foreground-1">{parent.payload?.resolver?.display_name}</span>
                      <span className="text-foreground-4">marked this conversation as resolved</span>
                    </div>
                  )
                }
                content={
                  <div className="px-4 pt-4">
                    <PullRequestTimelineItem
                      titleClassName="w-full"
                      parentCommentId={parent.id}
                      handleSaveComment={handleSaveComment}
                      isLast={replies.length === 0}
                      hideReplySection
                      isComment
                      replyBoxClassName=""
                      handleDeleteComment={() => deleteComment?.(parent?.id)}
                      onEditClick={() => toggleEditMode(componentId, parent?.payload?.payload?.text || '')}
                      data={parent?.payload?.payload?.text}
                      contentClassName="border-transparent"
                      onCopyClick={onCopyClick}
                      commentId={parent.id}
                      setHideReplyHere={state => toggleReplyBox(state, parent?.id)}
                      onQuoteReply={handleQuoteReply}
                      icon={
                        <Avatar.Root>
                          <Avatar.Fallback>{parentInitials}</Avatar.Fallback>
                        </Avatar.Root>
                      }
                      header={[
                        {
                          name: parent.author,
                          description: (
                            <Layout.Horizontal className="text-foreground-4">
                              <span>{timeAgo(parent?.created as number)}</span>
                              {parent?.deleted ? (
                                <>
                                  <span>&nbsp;|&nbsp;</span>
                                  <span>{t('views:pullRequests.deleted')} </span>
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
                            handleUpload={handleUpload}
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
                              hideReplySection
                              isComment
                              onCopyClick={onCopyClick}
                              commentId={reply.id}
                              isDeleted={!!reply?.deleted}
                              handleDeleteComment={() => deleteComment?.(reply?.id)}
                              onEditClick={() => toggleEditMode(replyComponentId, reply?.payload?.payload?.text || '')}
                              data={reply?.payload?.payload?.text}
                              contentClassName="border-transparent"
                              titleClassName="!flex max-w-full"
                              setHideReplyHere={state => toggleReplyBox(state, parent?.id)}
                              onQuoteReply={handleQuoteReply}
                              icon={
                                <Avatar.Root>
                                  <Avatar.Fallback>{replyInitials}</Avatar.Fallback>
                                </Avatar.Root>
                              }
                              header={[
                                {
                                  name: reply.author,
                                  description: (
                                    <Layout.Horizontal className="text-foreground-4">
                                      <span>{timeAgo(reply?.created as number)}</span>
                                      {reply?.deleted ? (
                                        <>
                                          <span>&nbsp;|&nbsp;</span>
                                          <span>{t('views:pullRequests.deleted')} </span>
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
                                    handleUpload={handleUpload}
                                    isEditMode
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
    [currentUser, handleSaveComment, updateComment, deleteComment, fileName, hideReplyHeres, editModes, editComments, t]
  )

  useCustomEventListener<DiffViewerCustomEvent>(
    fileName,
    useCallback(
      event => {
        const { action, commentId } = event.detail
        if (!commentId || scrolledToComment || action !== DiffViewerEvent.SCROLL_INTO_VIEW) return
        // Slight timeout so the UI has time to expand/hydrate
        const timeoutId = setTimeout(() => {
          const elem = document.getElementById(`comment-${commentId}`)
          if (!elem) return
          elem.scrollIntoView({ behavior: 'smooth', block: 'center' })
          setScrolledToComment?.(true)
        }, 500)

        return () => clearTimeout(timeoutId)
      },
      [scrolledToComment, setScrolledToComment]
    ),
    () => !!fileName
  )

  return (
    <div data-diff-file-path={fileName}>
      {diffFileInstance && (
        <div ref={diffInstanceRef}>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
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
        </div>
      )}
    </div>
  )
}

export default PullRequestDiffViewer
