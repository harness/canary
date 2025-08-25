import {
  ChangeEvent,
  ClipboardEvent,
  DragEvent,
  Fragment,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import {
  Alert,
  Avatar,
  Button,
  ButtonVariants,
  IconV2,
  IconV2NamesType,
  Layout,
  MarkdownViewer,
  Tabs,
  Text
} from '@/components'
import {
  DiffBlock,
  HandleAiPullRequestSummaryType,
  handleFileDrop,
  handlePaste,
  HandleUploadType,
  PrincipalsMentionMap,
  TextSelection,
  ToolbarAction,
  type PrincipalPropsType
} from '@/views'
import { cn } from '@utils/cn'
import { getErrorMessage } from '@utils/utils'
import { isEmpty, isUndefined } from 'lodash-es'

import { getLinesFromBlocks } from './diff-utils'
import { PullRequestCommentTextarea } from './pull-request-comment-textarea'
import { replaceMentionEmailWithDisplayName, replaceMentionEmailWithId } from './utils'

interface ParsedSelection extends TextSelection {
  text: string
  textLines: string[]
  textBefore: string
  textAfter: string
}

interface ParsedComment {
  text: string
  textLines: string[]
  textLinesSelectionStartIndex: number
  textLinesSelectionEndIndex: number
}

interface CommentAction {
  injectedPreString: string
  injectedPostString: string
}

interface CommentMetadata {
  action: CommentAction
  comment: ParsedComment
  selection: ParsedSelection
}

enum BuildBehavior {
  Capture = 'capture',
  Split = 'split',
  Parse = 'parse'
}

interface ToolbarItem {
  icon: IconV2NamesType
  variant?: ButtonVariants
  action: ToolbarAction
  title?: string
  size?: number
}

interface CommentHistory {
  comment: string
  selection: TextSelection
}

export interface PullRequestCommentBoxProps {
  className?: string
  comment: string
  lang?: string
  blocks?: DiffBlock[]
  diff?: string
  lineNumber?: number
  lineFromNumber?: number
  sideKey?: 'oldFile' | 'newFile'
  setComment: (comment: string) => void
  currentUser?: string
  onBoldClick?: () => void
  onItalicClick?: () => void
  onLinkClick?: () => void
  onCodeClick?: () => void
  inReplyMode?: boolean
  isEditMode?: boolean
  autofocus?: boolean
  onSaveComment?: (comment: string) => Promise<void> | void
  onCancelClick?: () => void
  handleUpload?: HandleUploadType
  handleAiPullRequestSummary?: HandleAiPullRequestSummaryType
  principalProps: PrincipalPropsType
  principalsMentionMap?: PrincipalsMentionMap
  setPrincipalsMentionMap?: React.Dispatch<React.SetStateAction<PrincipalsMentionMap>>
  preserveCommentOnSave?: boolean
  buttonTitle?: string
  textareaPlaceholder?: string
  allowEmptyValue?: boolean
  hideAvatar?: boolean
  isLoading?: boolean
}

const TABS_KEYS = {
  WRITE: 'write',
  PREVIEW: 'preview'
}

//  TODO: will have to eventually implement a commenting and reply system similiar to gitness
export const PullRequestCommentBox = ({
  className,
  onSaveComment,
  currentUser,
  inReplyMode = false,
  autofocus = false,
  onCancelClick,
  blocks,
  diff = '',
  lang = '',
  sideKey,
  lineNumber,
  lineFromNumber,
  comment,
  setComment,
  isEditMode,
  handleUpload,
  handleAiPullRequestSummary,
  principalProps,
  principalsMentionMap: parentPrincipalsMentionMap,
  setPrincipalsMentionMap: parentSetPrincipalsMentionMap,
  preserveCommentOnSave = false,
  buttonTitle,
  textareaPlaceholder,
  allowEmptyValue = false,
  hideAvatar = false,

  isLoading: parentIsLoading = false
}: PullRequestCommentBoxProps) => {
  const [__file, setFile] = useState<File>()
  const [activeTab, setActiveTab] = useState<typeof TABS_KEYS.WRITE | typeof TABS_KEYS.PREVIEW>(TABS_KEYS.WRITE)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dirty, setDirty] = useState<boolean>(false)
  const [initialComment, setInitialComment] = useState<string | undefined>(undefined)
  const [textSelection, setTextSelection] = useState({ start: 0, end: 0 })
  const [showAiLoader, setShowAiLoader] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)
  const [localPrincipalsMentionMap, setLocalPrincipalsMentionMap] = useState<PrincipalsMentionMap>({})

  const initialCommentHistory: CommentHistory = {
    comment: comment,
    selection: { start: 0, end: 0 }
  }
  const [commentHistory, setCommentHistory] = useState<CommentHistory[]>([initialCommentHistory])
  const [commentFuture, setCommentFuture] = useState<CommentHistory[]>([])

  const {
    principalsMentionMap,
    setPrincipalsMentionMap
  }: {
    principalsMentionMap: PrincipalsMentionMap
    setPrincipalsMentionMap: React.Dispatch<React.SetStateAction<PrincipalsMentionMap>>
  } = useMemo(() => {
    return {
      principalsMentionMap: parentPrincipalsMentionMap ?? localPrincipalsMentionMap,
      setPrincipalsMentionMap: parentSetPrincipalsMentionMap ?? setLocalPrincipalsMentionMap
    }
  }, [parentPrincipalsMentionMap, localPrincipalsMentionMap, parentSetPrincipalsMentionMap])

  const handleTabChange = (tab: typeof TABS_KEYS.WRITE | typeof TABS_KEYS.PREVIEW) => {
    setActiveTab(tab)
  }

  const clearComment = () => {
    if (!preserveCommentOnSave) {
      setCommentAndTextSelection('', { start: 0, end: 0 }) // Clear the comment box after saving
    }
  }

  const handleSaveComment = () => {
    if (onSaveComment && (allowEmptyValue || comment.trim())) {
      setCommentError(null)
      const formattedComment = replaceMentionEmailWithId(comment, principalsMentionMap)
      const onSaveCommentReturn = onSaveComment(formattedComment)

      if (onSaveCommentReturn instanceof Promise) {
        setIsLoading(true)
        onSaveCommentReturn
          .then(() => {
            clearComment()
          })
          .catch(e => {
            setCommentError(getErrorMessage(e, 'Failed to save comment'))
          })
          .finally(() => {
            setIsLoading(false)
          })
      } else {
        clearComment()
      }
    }
  }

  const avatar = useMemo(() => {
    return <Avatar name={currentUser} rounded />
  }, [currentUser])

  const handleUploadCallback = (file: File) => {
    setFile(file)

    handleUpload?.(file, setComment, comment, textSelection)
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleUploadCallback(file)
    }
  }

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.currentTarget === dropZoneRef.current) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.currentTarget === dropZoneRef.current && !e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleDropForUpload(e)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDropForUpload = async (event: any) => {
    handleFileDrop(event, handleUploadCallback)
  }

  const handlePasteForUpload = (event: ClipboardEvent) => {
    handlePaste(event, handleUploadCallback)
  }

  const handleAiSummary = (currentTextSelection: TextSelection) => {
    if (handleAiPullRequestSummary) {
      setShowAiLoader(true)

      const originalComment = comment

      const parsedPlaceholder = parseComment(comment, currentTextSelection, 'Generating AI Summary...')

      setCommentAndTextSelection(buildComment(parsedPlaceholder, BuildBehavior.Parse), parsedPlaceholder.selection)

      handleAiPullRequestSummary()
        .then(response => {
          const parsedResponse = parseComment(originalComment, currentTextSelection, response.summary)

          setCommentAndTextSelection(buildComment(parsedResponse, BuildBehavior.Parse), parsedResponse.selection)
        })
        .finally(() => {
          setShowAiLoader(false)
        })
    }
  }

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.addEventListener('select', onCommentSelect)
    }

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      if (textAreaRef.current) {
        textAreaRef.current.removeEventListener('select', onCommentSelect)
      }
    }
  }, [])

  useEffect(() => {
    if (!dirty) {
      setInitialComment(comment)
    }
  }, [comment])

  useEffect(() => {
    if (!isUndefined(initialComment)) {
      setTextSelection({ start: initialComment.length, end: initialComment.length })
    }
  }, [initialComment])

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.setSelectionRange(textSelection.start, textSelection.end)
    }
  }, [comment, textSelection])

  const parseComment = (
    originalComment: string,
    textSelection: TextSelection,
    injectedPreString: string = '',
    injectedPostString: string = ''
  ): CommentMetadata => {
    const action: CommentAction = {
      injectedPreString: injectedPreString,
      injectedPostString: injectedPostString
    }

    const isStartOfLineSelected =
      textSelection.start === 0 || originalComment.substring(0, textSelection.start).endsWith('\n')
    const isEndOfLineSelected =
      textSelection.end === originalComment.length || originalComment.substring(textSelection.end).startsWith('\n')

    const commentLines = originalComment.split('\n')

    const parsedComment: ParsedComment = {
      text: originalComment,
      textLines: commentLines,
      textLinesSelectionStartIndex: 0,
      textLinesSelectionEndIndex: 0
    }

    commentLines.reduce((characterIndex, line, lineIndex): number => {
      const lowerBound = lineIndex === 0 ? characterIndex : characterIndex + '\n'.length
      const upperBound = lowerBound + line.length

      const selectionStartHere = textSelection.start >= lowerBound && textSelection.start <= upperBound
      const selectionEndHere = textSelection.end >= lowerBound && textSelection.end <= upperBound

      if (selectionStartHere) {
        parsedComment.textLinesSelectionStartIndex = lineIndex
      }

      if (selectionEndHere) {
        parsedComment.textLinesSelectionEndIndex = lineIndex
      }

      return upperBound
    }, 0)

    const injectNewline = !isStartOfLineSelected && isEndOfLineSelected && injectedPreString.includes('\n')
    const injectedNewline = injectNewline ? '\n' : ''

    const selectionText = originalComment.substring(textSelection.start, textSelection.end)
    const selectionTextLines = parsedComment.textLines.slice(
      parsedComment.textLinesSelectionStartIndex,
      parsedComment.textLinesSelectionEndIndex + 1
    )
    const selectionTextBefore = originalComment.substring(0, textSelection.start) + injectedNewline
    const newTextSelectionStart = textSelection.start + injectedPreString.length + injectedNewline.length
    const newTextSelectionEnd =
      newTextSelectionStart + (textSelection.end - textSelection.start) + injectedNewline.length

    const selection: ParsedSelection = {
      text: selectionText,
      textLines: selectionTextLines,
      start: newTextSelectionStart,
      end: newTextSelectionEnd,
      textBefore: selectionTextBefore,
      textAfter: originalComment.substring(textSelection.end)
    }

    return {
      action: action,
      comment: parsedComment,
      selection: selection
    }
  }

  const buildComment = (commentMetadata: CommentMetadata, buildBehavior: BuildBehavior): string => {
    switch (buildBehavior) {
      case BuildBehavior.Capture: {
        const injectedCaptureString = `${commentMetadata.action.injectedPreString}${commentMetadata.selection.text}${commentMetadata.action.injectedPostString}`

        return `${commentMetadata.selection.textBefore}${injectedCaptureString}${commentMetadata.selection.textAfter}`
      }
      case BuildBehavior.Split: {
        const injectedSplitString = commentMetadata.comment.textLines.reduce((prev, commentLine, commentLineIndex) => {
          if (commentLineIndex > commentMetadata.comment.textLinesSelectionEndIndex) {
            return `${prev}`
          }

          if (
            commentLineIndex >= commentMetadata.comment.textLinesSelectionStartIndex &&
            commentLineIndex <= commentMetadata.comment.textLinesSelectionEndIndex
          ) {
            const useNewline = commentLineIndex !== commentMetadata.comment.textLinesSelectionEndIndex

            return `${prev}${commentMetadata.action.injectedPreString}${commentLine}${commentMetadata.action.injectedPostString}${useNewline ? '\n' : ''}`
          }

          return `${prev}${commentLine}\n`
        }, '')

        const remainingLines = commentMetadata.comment.textLines.slice(
          commentMetadata.comment.textLinesSelectionEndIndex + 1
        )
        const injectNewLine = remainingLines.length > 0

        return `${injectedSplitString}${injectNewLine ? '\n' : ''}${remainingLines.join('\n')}`
      }
      case BuildBehavior.Parse: {
        const injectedParseString = isEmpty(commentMetadata.selection.text)
          ? `${commentMetadata.action.injectedPreString}${parseDiff(blocks, sideKey, lineNumber, lineFromNumber)}${commentMetadata.action.injectedPostString}`
          : `${commentMetadata.action.injectedPreString}${commentMetadata.selection.text}${commentMetadata.action.injectedPostString}`

        return `${commentMetadata.selection.textBefore}${injectedParseString}${commentMetadata.selection.textAfter}`
      }
    }
  }

  const parseDiff = (
    blocks: DiffBlock[] = [],
    sideKey?: 'oldFile' | 'newFile',
    lineNumber?: number,
    lineFromNumber?: number
  ): string => {
    if (isUndefined(sideKey) || isUndefined(lineNumber) || isUndefined(lineFromNumber)) {
      return ''
    }

    const linesFromBlocks = getLinesFromBlocks(
      blocks,
      sideKey === 'newFile' ? 'new' : 'old',
      lineFromNumber,
      lineNumber
    )
    return linesFromBlocks.map(item => item.cleanContent).join('\n')
  }

  const toolbar: ToolbarItem[] = useMemo(() => {
    const aiButton: ToolbarItem[] = handleAiPullRequestSummary
      ? [{ icon: 'ai-solid' as IconV2NamesType, variant: 'ai', action: ToolbarAction.AI_SUMMARY }]
      : []

    const suggestionButton: ToolbarItem[] =
      diff !== '' && lineNumber !== undefined && lineFromNumber !== undefined
        ? [{ icon: 'suggestion', action: ToolbarAction.SUGGESTION }]
        : []

    // TODO: Design system: Update icons once they are available in IconV2
    return [
      ...aiButton,
      ...suggestionButton,
      { icon: 'header', action: ToolbarAction.HEADER },
      { icon: 'bold', action: ToolbarAction.BOLD },
      { icon: 'italic', action: ToolbarAction.ITALIC },
      { icon: 'attachment', action: ToolbarAction.UPLOAD },
      { icon: 'list', action: ToolbarAction.UNORDERED_LIST },
      { icon: 'list-select', action: ToolbarAction.CHECK_LIST },
      { icon: 'code', action: ToolbarAction.CODE_BLOCK }
    ]
  }, [diff, lineNumber, lineFromNumber, handleAiPullRequestSummary])

  const handleActionClick = (type: ToolbarAction, comment: string, textSelection: TextSelection) => {
    switch (type) {
      case ToolbarAction.AI_SUMMARY:
        handleAiSummary(textSelection)
        break
      case ToolbarAction.SUGGESTION: {
        const parsedSuggestion = parseComment(comment, textSelection, '```suggestion\n', '\n```')

        setCommentAndTextSelection(buildComment(parsedSuggestion, BuildBehavior.Parse), parsedSuggestion.selection)
        break
      }
      case ToolbarAction.HEADER: {
        const parsedHeader = parseComment(comment, textSelection, '# ')

        setCommentAndTextSelection(buildComment(parsedHeader, BuildBehavior.Capture), parsedHeader.selection)
        break
      }
      case ToolbarAction.BOLD: {
        const parsedBold = parseComment(comment, textSelection, '**', '**')

        setCommentAndTextSelection(buildComment(parsedBold, BuildBehavior.Capture), parsedBold.selection)
        break
      }
      case ToolbarAction.ITALIC: {
        const parsedItalic = parseComment(comment, textSelection, '*', '*')

        setCommentAndTextSelection(buildComment(parsedItalic, BuildBehavior.Capture), parsedItalic.selection)
        break
      }
      case ToolbarAction.UPLOAD:
        handleFileSelect()
        break
      case ToolbarAction.UNORDERED_LIST: {
        const parsedUnorderedList = parseComment(comment, textSelection, '- ')

        setCommentAndTextSelection(
          buildComment(parsedUnorderedList, BuildBehavior.Split),
          parsedUnorderedList.selection
        )
        break
      }
      case ToolbarAction.CHECK_LIST: {
        const parsedCheckList = parseComment(comment, textSelection, '- [ ] ')

        setCommentAndTextSelection(buildComment(parsedCheckList, BuildBehavior.Split), parsedCheckList.selection)
        break
      }
      case ToolbarAction.CODE_BLOCK: {
        const parsedCodeBlock = parseComment(comment, textSelection, '```' + lang + '\n', '\n```')

        setCommentAndTextSelection(buildComment(parsedCodeBlock, BuildBehavior.Capture), parsedCodeBlock.selection)
        break
      }
    }

    // Return cursor to proper place to continue typing based on where action above set selection index
    textAreaRef.current && textAreaRef.current.focus()
  }

  const handleUndo = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    e.preventDefault()

    if (commentHistory.length === 1) {
      return
    }

    const current = commentHistory.pop() ?? initialCommentHistory
    const undo = commentHistory.pop() ?? current

    !isUndefined(undo) &&
      !isUndefined(current) &&
      setCommentAndTextSelection(undo.comment, undo.selection, [...commentHistory, undo], [...commentFuture, current])
  }

  const handleRedo = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    e.preventDefault()

    if (commentFuture.length === 0) {
      return
    }

    const redo = commentFuture.pop()

    !isUndefined(redo) &&
      setCommentAndTextSelection(redo.comment, redo.selection, [...commentHistory, redo], commentFuture)
  }

  const setCommentAndTextSelection = (
    comment: string,
    textSelection: TextSelection,
    replaceHistory?: CommentHistory[],
    replaceFuture?: CommentHistory[]
  ): void => {
    setDirty(true)
    setTextSelection(textSelection)
    setComment(comment)

    const current = {
      comment: comment,
      selection: textSelection
    }

    setCommentHistory(replaceHistory ?? [...commentHistory, current])
    setCommentFuture(replaceFuture ? replaceFuture : [])
  }

  const onCommentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setCommentAndTextSelection(e.target.value, { start: e.target.selectionStart, end: e.target.selectionEnd })
  }

  const onCommentSelect = (): void => {
    if (textAreaRef.current) {
      const target = textAreaRef.current

      setTextSelection({ start: target.selectionStart, end: target.selectionEnd })
    }
  }

  const onMouseUp = (): void => {
    if (textAreaRef.current) {
      const target = textAreaRef.current

      setTextSelection({ start: target.selectionStart, end: target.selectionEnd })
    }
  }

  const onKeyUp = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    switch (e.code) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight': {
        if (textAreaRef.current) {
          const target = textAreaRef.current

          setTextSelection({ start: target.selectionStart, end: target.selectionEnd })
        }
        break
      }
      case 'Enter': {
        const commentMetadata = parseComment(comment, textSelection)
        const textLinesSelectionStartIndexBeforeEnter = commentMetadata.comment.textLinesSelectionStartIndex - 1
        const lineBeforeEnter = commentMetadata.comment.textLines.at(textLinesSelectionStartIndexBeforeEnter) ?? ''

        if (isListString(lineBeforeEnter)) {
          handleActionClick(ToolbarAction.UNORDERED_LIST, comment, textSelection)
        }
        if (isListSelectString(lineBeforeEnter)) {
          handleActionClick(ToolbarAction.CHECK_LIST, comment, textSelection)
        }
        break
      }
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && e.metaKey) {
      return handleSaveComment()
    }
    if (e.key === 'z' && e.metaKey && e.shiftKey) {
      return handleRedo(e)
    }
    if (e.key === 'z' && e.metaKey) {
      return handleUndo(e)
    }
  }

  const isListString = (line: string): boolean => {
    return line.startsWith('- ')
  }

  const isListSelectString = (line: string): boolean => {
    return line.startsWith('- [ ] ')
  }

  return (
    <Layout.Horizontal align="start" className={cn('gap-x-3 font-sans', className)} data-comment-editor-shown="true">
      {!inReplyMode && !isEditMode && !hideAvatar && avatar}
      <Layout.Vertical
        gap="md"
        className={cn('p-4 pt-3 flex-1', {
          'border rounded-md': !inReplyMode || isEditMode,
          'bg-cn-background-1': !inReplyMode,
          'bg-cn-background-2 border-t': inReplyMode
        })}
      >
        <Tabs.Root defaultValue={TABS_KEYS.WRITE} value={activeTab} onValueChange={handleTabChange}>
          <Tabs.List
            className="-mx-4 mb-cn-md px-4"
            activeClassName={inReplyMode ? 'bg-cn-background-2' : 'bg-cn-background-1'}
            variant="overlined"
          >
            <Tabs.Trigger value={TABS_KEYS.WRITE}>Write</Tabs.Trigger>
            <Tabs.Trigger value={TABS_KEYS.PREVIEW}>Preview</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value={TABS_KEYS.WRITE}>
            <div
              className="relative"
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              ref={dropZoneRef}
            >
              <PullRequestCommentTextarea
                resizable
                ref={textAreaRef}
                placeholder={textareaPlaceholder ?? 'Add your comment here'}
                className="min-h-32 pb-cn-3xl text-cn-foreground-1"
                autoFocus={!!autofocus || !!inReplyMode}
                principalProps={principalProps}
                setPrincipalsMentionMap={setPrincipalsMentionMap}
                value={comment}
                setValue={setComment}
                onChange={e => onCommentChange(e)}
                onKeyUp={e => onKeyUp(e)}
                onKeyDown={e => onKeyDown(e)}
                onMouseUp={() => onMouseUp()}
                onPaste={e => {
                  if (e.clipboardData.files.length > 0) {
                    handlePasteForUpload(e)
                  }
                }}
              />

              {showAiLoader && (
                <div className="absolute inset-0 flex cursor-wait items-center justify-center">
                  <IconV2 size="lg" className="animate-spin" name="loader" />
                </div>
              )}
              {isDragging && (
                <div className="absolute inset-1 z-[100] cursor-copy rounded-sm border border-dashed border-cn-borders-2" />
              )}

              <Layout.Flex
                align="center"
                className="absolute bottom-px left-px w-[calc(100%-10px)] rounded bg-cn-background-1 p-cn-3xs border-t"
              >
                {toolbar.map((item, index) => {
                  const isFirst = index === 0
                  return (
                    <Fragment key={`${comment}-${index}`}>
                      <Button
                        size="sm"
                        variant={item.variant ?? 'ghost'}
                        iconOnly
                        disabled={showAiLoader}
                        onClick={() => handleActionClick(item.action, comment, textSelection)}
                      >
                        <IconV2 name={item.icon} />
                      </Button>
                      {isFirst && <div className="h-4 w-px bg-cn-background-3" />}
                    </Fragment>
                  )
                })}
              </Layout.Flex>
            </div>
          </Tabs.Content>
          <Tabs.Content className="w-full" value={TABS_KEYS.PREVIEW}>
            <div className="min-h-32 w-full">
              {comment ? (
                <MarkdownViewer
                  markdownClassName="pr-section bg-transparent w-full"
                  source={replaceMentionEmailWithDisplayName(comment, principalsMentionMap)}
                />
              ) : (
                <Text variant="body-normal" color="foreground-1">
                  Nothing to preview
                </Text>
              )}
            </div>
          </Tabs.Content>
        </Tabs.Root>

        <Layout.Flex align="center" justify="between">
          {activeTab === TABS_KEYS.WRITE && (
            <>
              <input
                type="file"
                accept="image/*,video/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <Button variant="ghost" onClick={handleFileSelect}>
                <IconV2 name="attachment-image" />
                Drag & drop, select, or paste to attach files
              </Button>
            </>
          )}

          {onSaveComment ? (
            <Layout.Flex align="center" justify="end" gap="sm" className="ml-auto">
              {(inReplyMode || isEditMode) && (
                <Button variant="secondary" onClick={onCancelClick}>
                  Cancel
                </Button>
              )}

              <Button loading={parentIsLoading || isLoading} onClick={handleSaveComment}>
                {buttonTitle || 'Comment'}
              </Button>
            </Layout.Flex>
          ) : null}
        </Layout.Flex>

        {commentError && (
          <Alert.Root theme="danger">
            <Alert.Title>Failed to perform comment operation</Alert.Title>
            <Alert.Description>{commentError}</Alert.Description>
          </Alert.Root>
        )}
      </Layout.Vertical>
    </Layout.Horizontal>
  )
}
PullRequestCommentBox.displayName = 'PullRequestCommentBox'
