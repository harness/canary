import { useCallback, useEffect, useRef, useState } from 'react'

import { Avatar, Text, TextInput, TimeAgoCard } from '@/components'
import { useTheme, useTranslation } from '@/context'
import {
  activitiesToDiffCommentItems,
  CommentItem,
  CommitSuggestion,
  CreateCommentPullReqRequest,
  HandleUploadType,
  PrincipalPropsType,
  PrincipalsMentionMap,
  PullRequestCommentBox,
  TypesPullReqActivity
} from '@/views'
import { DiffFile, DiffModeEnum, DiffViewProps, SplitSide } from '@git-diff-view/react'
import { useCustomEventListener } from '@hooks/use-event-listener'
import { useMemoryCleanup } from '@hooks/use-memory-cleanup'
import { getInitials } from '@utils/stringUtils'
import { DiffBlock } from 'diff2html/lib/types'
import { debounce, get } from 'lodash-es'
import { OverlayScrollbars } from 'overlayscrollbars'

import PRCommentView from '../details/components/common/pull-request-comment-view'
import PullRequestTimelineItem from '../details/components/conversation/pull-request-timeline-item'
import { replaceMentionEmailWithId, replaceMentionIdWithEmail } from '../details/components/conversation/utils'
import { useDiffHighlighter } from '../hooks/useDiffHighlighter'
import { quoteTransform } from '../utils'
import { ExtendedDiffView } from './extended-diff-view/extended-diff-view'
import { ExtendedDiffViewProps } from './extended-diff-view/extended-diff-view-types'

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
  deletedLines?: number
  isBinary?: boolean
  deleted?: boolean
  unchangedPercentage?: number
  blocks?: DiffBlock[]
  currentUser?: string
  comments?: CommentItem<TypesPullReqActivity>[][]
  handleSaveComment?: (comment: string, parentId?: number, extra?: CreateCommentPullReqRequest) => void
  deleteComment?: (id: number) => void
  updateComment?: (id: number, comment: string) => void
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
  principalProps: PrincipalPropsType
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
  collapseDiff,
  principalProps
}: PullRequestDiffviewerProps) => {
  const { t } = useTranslation()
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
  const [principalsMentionMap, setPrincipalsMentionMap] = useState<PrincipalsMentionMap>({})
  const { isLightTheme } = useTheme()

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

  const handleQuoteReply = useCallback((parentId: number, originalText: string, mentions: PrincipalsMentionMap) => {
    const quoted = quoteTransform(originalText)
    setQuoteReplies(prev => ({
      ...prev,
      [parentId]: {
        text: replaceMentionIdWithEmail(quoted, mentions)
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
    oldFile: Record<number, { data: Thread[]; fromLine: number }>
    newFile: Record<number, { data: Thread[]; fromLine: number }>
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
      oldFile: Record<number, { data: Thread[]; fromLine: number }>
      newFile: Record<number, { data: Thread[]; fromLine: number }>
    }

    comments.forEach(threadArr => {
      if (threadArr.length === 0) return
      const parentComment = threadArr[0]
      const codeComment = parentComment.payload?.payload?.code_comment
      if (!codeComment) return

      const rightSide = get(parentComment.payload?.payload?.payload, 'line_start_new', false)

      const span = rightSide ? codeComment.span_new || 0 : codeComment.span_old || 0
      const lineNumberStart = (rightSide ? codeComment.line_new : codeComment.line_old) as number
      const lineNumberEnd = lineNumberStart + span - 1

      const side: 'oldFile' | 'newFile' = rightSide ? 'newFile' : 'oldFile'

      if (isNaN(lineNumberEnd)) return

      const parent = {
        author: parentComment.author,
        created: parentComment.created,
        content: parentComment.content,
        id: parentComment.id,
        edited: parentComment.edited,
        updated: parentComment.updated,
        deleted: parentComment.deleted,
        outdated: parentComment.outdated,
        payload: parentComment.payload,
        codeBlockContent: activitiesToDiffCommentItems(parentComment).codeBlockContent,
        appliedCheckSum: parentComment.payload?.metadata?.suggestions?.applied_check_sum,
        appliedCommitSha: parentComment.payload?.metadata?.suggestions?.applied_commit_sha,
        checkSums: parentComment.payload?.metadata?.suggestions?.check_sums
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
        outdated: reply.outdated,
        codeBlockContent: activitiesToDiffCommentItems(reply).codeBlockContent,
        appliedCheckSum: reply.payload?.metadata?.suggestions?.applied_check_sum,
        appliedCommitSha: reply.payload?.metadata?.suggestions?.applied_commit_sha,
        checkSums: reply.payload?.metadata?.suggestions?.check_sums
      }))

      if (!newExtend[side][lineNumberEnd]) {
        newExtend[side][lineNumberEnd] = { data: [], fromLine: lineNumberStart }
      }
      newExtend[side][lineNumberEnd].data.push({ parent, replies })
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
        // alert((e as Error).message)
        console.error(e)
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

  // comment widget (add comment)
  const renderWidgetLine = useCallback<NonNullable<ExtendedDiffViewProps<Thread[]>['renderWidgetLine']>>(
    ({ onClose, side, lineNumber, lineFromNumber }) => {
      const sideKey = side === SplitSide.old ? 'oldFile' : 'newFile'
      const commentKey = `${side}:${lineNumber}`
      const commentText = newComments[commentKey] ?? ''

      return (
        <div className="flex w-full flex-col bg-cn-background-1 p-4">
          <PullRequestCommentBox
            handleUpload={handleUpload}
            principalsMentionMap={principalsMentionMap}
            setPrincipalsMentionMap={setPrincipalsMentionMap}
            isEditMode
            principalProps={principalProps}
            onSaveComment={() => {
              onClose()
              const trimmedComment = commentText.trim()
              if (trimmedComment && handleSaveComment) {
                handleSaveComment(replaceMentionEmailWithId(trimmedComment, principalsMentionMap), undefined, {
                  line_end: lineNumber,
                  line_end_new: sideKey === 'newFile',
                  line_start: lineFromNumber,
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
            lineNumber={lineNumber}
            lineFromNumber={lineFromNumber}
            sideKey={sideKey}
            diff={data}
            lang={lang}
            comment={commentText}
            setComment={value => setNewComments(prev => ({ ...prev, [commentKey]: value }))}
          />
        </div>
      )
    },
    [handleSaveComment, fileName, newComments, currentUser, handleUpload, principalProps]
  )

  // comment display
  const renderExtendLine = useCallback<NonNullable<DiffViewProps<Thread[]>['renderExtendLine']>>(
    ({ data: threads }) => {
      if (!threads) return <></>

      return (
        <div className="bg-cn-background-1">
          {threads.map(thread => {
            const parent = thread.parent
            const componentId = `activity-code-${parent?.id}`
            const parentIdAttr = `comment-${parent?.id}`
            const replies = thread.replies
            const parentInitials = getInitials(parent.author ?? '', 2)
            return (
              <PullRequestTimelineItem
                principalsMentionMap={principalsMentionMap}
                setPrincipalsMentionMap={setPrincipalsMentionMap}
                mentions={parent?.payload?.mentions}
                payload={parent?.payload}
                wrapperClassName="pb-3"
                key={parent.id}
                id={parentIdAttr}
                principalProps={principalProps}
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
                onQuoteReply={(parentId: number, originalText: string) =>
                  handleQuoteReply(parentId, originalText, parent?.payload?.mentions || {})
                }
                quoteReplyText={quoteReplies[parent.id]?.text || ''}
                contentHeader={
                  !!parent.payload?.resolved && (
                    <Text variant="body-normal" color="foreground-3">
                      <Text as="span" variant="body-strong" color="foreground-1">
                        {parent.payload?.resolver?.display_name}
                      </Text>
                      &nbsp; marked this conversation as resolved.
                    </Text>
                  )
                }
                content={
                  <div className="px-4 pt-4">
                    <PullRequestTimelineItem
                      isReply={false}
                      mentions={parent?.payload?.mentions}
                      payload={parent?.payload}
                      principalsMentionMap={principalsMentionMap}
                      setPrincipalsMentionMap={setPrincipalsMentionMap}
                      titleClassName="w-full"
                      parentCommentId={parent.id}
                      principalProps={principalProps}
                      handleSaveComment={handleSaveComment}
                      isLast={replies.length === 0}
                      hideReplySection
                      isResolved={!!parent.payload?.resolved}
                      isComment
                      replyBoxClassName=""
                      handleDeleteComment={() => deleteComment?.(parent?.id)}
                      onEditClick={() => toggleEditMode(componentId, parent?.payload?.payload?.text || '')}
                      data={parent?.payload?.payload?.text}
                      contentClassName="border-transparent"
                      onCopyClick={onCopyClick}
                      commentId={parent.id}
                      setHideReplyHere={state => toggleReplyBox(state, parent?.id)}
                      onQuoteReply={(parentId: number, rawText: string) =>
                        handleQuoteReply(parentId, rawText, parent?.payload?.mentions || {})
                      }
                      icon={<Avatar name={parentInitials} rounded />}
                      header={[
                        {
                          name: parent.author,
                          description: <TimeAgoCard timestamp={parent?.created} />
                        }
                      ]}
                      content={
                        parent?.deleted ? (
                          <TextInput value={t('views:pullRequests.deletedComment')} disabled />
                        ) : editModes[componentId] ? (
                          <PullRequestCommentBox
                            principalsMentionMap={principalsMentionMap}
                            setPrincipalsMentionMap={setPrincipalsMentionMap}
                            principalProps={principalProps}
                            handleUpload={handleUpload}
                            isEditMode
                            onSaveComment={() => {
                              if (parent?.id) {
                                updateComment?.(
                                  parent?.id,
                                  replaceMentionEmailWithId(editComments[componentId], principalsMentionMap)
                                )
                                toggleEditMode(componentId, '')
                              }
                            }}
                            currentUser={currentUser}
                            onCancelClick={() => {
                              toggleEditMode(componentId, '')
                            }}
                            diff={data}
                            lang={lang}
                            comment={replaceMentionIdWithEmail(
                              editComments[componentId],
                              parent?.payload?.mentions || {}
                            )}
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
                              isReply
                              principalsMentionMap={principalsMentionMap}
                              setPrincipalsMentionMap={setPrincipalsMentionMap}
                              key={reply.id}
                              payload={parent?.payload}
                              id={replyIdAttr}
                              principalProps={principalProps}
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
                              onQuoteReply={(parentId: number, rawText: string) =>
                                handleQuoteReply(parentId, rawText, reply?.payload?.mentions || {})
                              }
                              icon={<Avatar name={replyInitials} rounded />}
                              header={[
                                {
                                  name: reply.author,
                                  description: <TimeAgoCard timestamp={reply?.created} />
                                }
                              ]}
                              content={
                                reply?.deleted ? (
                                  <TextInput value={t('views:pullRequests.deletedComment')} disabled />
                                ) : editModes[replyComponentId] ? (
                                  <PullRequestCommentBox
                                    principalsMentionMap={principalsMentionMap}
                                    setPrincipalsMentionMap={setPrincipalsMentionMap}
                                    principalProps={principalProps}
                                    handleUpload={handleUpload}
                                    isEditMode
                                    onSaveComment={() => {
                                      if (reply?.id) {
                                        updateComment?.(
                                          reply?.id,
                                          replaceMentionEmailWithId(
                                            editComments[replyComponentId],
                                            principalsMentionMap
                                          )
                                        )
                                        toggleEditMode(replyComponentId, '')
                                      }
                                    }}
                                    currentUser={currentUser}
                                    onCancelClick={() => {
                                      toggleEditMode(replyComponentId, '')
                                    }}
                                    diff={data}
                                    lang={lang}
                                    comment={replaceMentionIdWithEmail(
                                      editComments[replyComponentId],
                                      reply?.payload?.mentions || {}
                                    )}
                                    setComment={text =>
                                      setEditComments(prev => ({ ...prev, [replyComponentId]: text }))
                                    }
                                  />
                                ) : (
                                  <PRCommentView
                                    parentItem={parent as CommentItem<TypesPullReqActivity>}
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
    [
      currentUser,
      handleSaveComment,
      updateComment,
      deleteComment,
      fileName,
      hideReplyHeres,
      editModes,
      editComments,
      t,
      principalProps
    ]
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
          <ExtendedDiffView<Thread[]>
            ref={ref}
            className="bg-tr w-full text-cn-foreground-3"
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
            diffViewTheme={isLightTheme ? 'light' : 'dark'}
          />
        </div>
      )}
    </div>
  )
}

PullRequestDiffViewer.displayName = 'PullRequestDiffViewer'
export default PullRequestDiffViewer
