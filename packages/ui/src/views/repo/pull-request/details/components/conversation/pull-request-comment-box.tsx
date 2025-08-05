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
  HandleAiPullRequestSummaryType,
  handleFileDrop,
  handlePaste,
  HandleUploadType,
  PrincipalsMentionMap,
  ToolbarAction,
  type PrincipalPropsType
} from '@/views'
import { cn } from '@utils/cn'
import { getErrorMessage } from '@utils/utils'
import { isEmpty, isUndefined } from 'lodash-es'

import { PullRequestCommentTextarea } from './pull-request-comment-textarea'
import { replaceMentionEmailWithDisplayName, replaceMentionEmailWithId } from './utils'

interface TextSelection {
  start: number
  end: number
}

enum TextSelectionBehavior {
  Capture = 'capture',
  Split = 'split',
  Parse = 'parse'
}

interface StringSelection {
  beforeSelection: string
  selection: string
  selectionLines: string[]
  selectionStart: number
  selectionEnd: number
  afterSelection: string
  previousLine: string
}

interface ToolbarItem {
  icon: IconV2NamesType
  variant?: ButtonVariants
  action: ToolbarAction
  title?: string
  size?: number
}

export interface PullRequestCommentBoxProps {
  className?: string
  comment: string
  lang?: string
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
  onCommentSubmit?: () => void
  inReplyMode?: boolean
  isEditMode?: boolean
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
  onCancelClick,
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
  const [textSelection, setTextSelection] = useState({ start: 0, end: 0 })
  const [showAiLoader, setShowAiLoader] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const [commentError, setCommentError] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const [localPrincipalsMentionMap, setLocalPrincipalsMentionMap] = useState<PrincipalsMentionMap>({})

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
      setComment('') // Clear the comment box after saving
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

    handleUpload?.(file, setComment, comment)
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleAiSummary = (currentTextSelection: TextSelection) => {
    if (handleAiPullRequestSummary) {
      setShowAiLoader(true)

      const originalComment = comment

      parseAndSetComment(comment, currentTextSelection, TextSelectionBehavior.Parse, 'Generating AI Summary...')

      handleAiPullRequestSummary()
        .then(response => {
          parseAndSetComment(originalComment, currentTextSelection, TextSelectionBehavior.Parse, response.summary)
        })
        .finally(() => {
          setShowAiLoader(false)
        })
    }
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
    if (textAreaRef.current) {
      textAreaRef.current.setSelectionRange(textSelection.start, textSelection.end)
    }
  }, [comment, textSelection])

  const parseComment = (comment: string, textSelection: TextSelection, injectedPreString: string): StringSelection => {
    const isStartOfLineSelected = textSelection.start === 0 || comment.substring(0, textSelection.start).endsWith('\n')
    const isEndOfLineSelected =
      textSelection.end === comment.length || comment.substring(textSelection.end).startsWith('\n')

    const injectNewline = !isStartOfLineSelected && isEndOfLineSelected && injectedPreString.includes('\n')
    const injectedNewline = injectNewline ? '\n' : ''

    const beforeSelection = comment.substring(0, textSelection.start) + injectedNewline
    const selection = comment.substring(textSelection.start, textSelection.end)
    const afterSelection = comment.substring(textSelection.end)

    const selectionLines = selection.split('\n')

    const beforeSelectionParts = beforeSelection.split('\n')
    const previousLine = beforeSelectionParts.at(beforeSelectionParts.length - 2) ?? ''

    const newTextSelectionStart = textSelection.start + injectedPreString.length + injectedNewline.length
    const newTextSelectionEnd =
      newTextSelectionStart + (textSelection.end - textSelection.start) + injectedNewline.length

    return {
      beforeSelection: beforeSelection,
      selection: selection,
      selectionLines: selectionLines,
      afterSelection: afterSelection,
      previousLine: previousLine,
      selectionStart: newTextSelectionStart,
      selectionEnd: newTextSelectionEnd
    }
  }

  const parseAndSetComment = (
    comment: string,
    textSelection: TextSelection,
    textSelectionBehavrior: TextSelectionBehavior,
    injectedPreString: string,
    injectedPostString: string = ''
  ) => {
    const parsedComment = parseComment(comment, textSelection, injectedPreString)

    let injectedString = ''

    switch (textSelectionBehavrior) {
      case TextSelectionBehavior.Capture:
        injectedString = `${injectedPreString}${parsedComment.selection}${injectedPostString}`
        break
      case TextSelectionBehavior.Split:
        injectedString = parsedComment.selectionLines.reduce((prev, selectionLine, currentIndex, array) => {
          return `${prev}${injectedPreString}${selectionLine}${injectedPostString}${currentIndex < array.length - 1 ? '\n' : ''}`
        }, '')
        break
      case TextSelectionBehavior.Parse:
        injectedString = isEmpty(parsedComment.selection)
          ? `${injectedPreString}${parseDiff(diff, sideKey, lineNumber, lineFromNumber)}${injectedPostString}`
          : `${injectedPreString}${parsedComment.selection}${injectedPostString}`
        break
    }

    setCommentAndTextSelection(`${parsedComment.beforeSelection}${injectedString}${parsedComment.afterSelection}`, {
      start: parsedComment.selectionStart,
      end: parsedComment.selectionEnd
    })
  }

  const parseDiff = (
    diff: string = '',
    sideKey?: 'oldFile' | 'newFile',
    lineNumber?: number,
    lineFromNumber?: number
  ): string => {
    if (isUndefined(sideKey) || isUndefined(lineNumber) || isUndefined(lineFromNumber)) {
      return ''
    }

    const diffLines = diff.split('\n')

    const sideChangedLineToken = sideKey === 'newFile' ? '+' : '-'
    const otherSideChangedLineToken = sideKey === 'newFile' ? '-' : '+'

    const sideDiffLines = diffLines.filter(diffLine => !diffLine.startsWith(otherSideChangedLineToken))

    const found = sideDiffLines.reduce((previousValue, currentValue, currentIndex): string => {
      if (isEmpty(previousValue) && currentValue.startsWith('@@')) {
        const sectionInfoParts = currentValue.split(' ')

        const sideHeader = sectionInfoParts.find(part => part.startsWith(sideChangedLineToken))

        const fileLineNumber = +(sideHeader?.split(',')[0].substring(1) ?? '')

        const fromOffset = lineFromNumber - fileLineNumber + 1
        const toOffset = lineNumber - fileLineNumber + 1

        const selectedLines = sideDiffLines.slice(currentIndex + fromOffset, currentIndex + toOffset + 1)

        const cleanedLines = selectedLines.map(line =>
          line.startsWith(sideChangedLineToken) ? ` ${line.substring(1)}` : line
        )

        return cleanedLines.join('\n')
      }

      return previousValue
    }, '')

    return found
  }

  const toolbar: ToolbarItem[] = useMemo(() => {
    const initial: ToolbarItem[] = handleAiPullRequestSummary
      ? [{ icon: 'ai' as IconV2NamesType, variant: 'ai', action: ToolbarAction.AI_SUMMARY }]
      : []

    // TODO: Design system: Update icons once they are available in IconV2
    return [
      ...initial,
      { icon: 'suggestion', action: ToolbarAction.SUGGESTION },
      { icon: 'header', action: ToolbarAction.HEADER },
      { icon: 'bold', action: ToolbarAction.BOLD },
      { icon: 'italic', action: ToolbarAction.ITALIC },
      { icon: 'attachment', action: ToolbarAction.UPLOAD },
      { icon: 'list', action: ToolbarAction.UNORDERED_LIST },
      { icon: 'list-select', action: ToolbarAction.CHECK_LIST },
      { icon: 'code', action: ToolbarAction.CODE_BLOCK }
    ]
  }, [])

  const handleActionClick = (type: ToolbarAction, comment: string, textSelection: TextSelection) => {
    switch (type) {
      case ToolbarAction.AI_SUMMARY:
        handleAiSummary(textSelection)
        break
      case ToolbarAction.SUGGESTION:
        parseAndSetComment(comment, textSelection, TextSelectionBehavior.Parse, '```suggestion\n', '\n```')
        break
      case ToolbarAction.HEADER:
        parseAndSetComment(comment, textSelection, TextSelectionBehavior.Capture, '# ')
        break
      case ToolbarAction.BOLD:
        parseAndSetComment(comment, textSelection, TextSelectionBehavior.Capture, '**', '**')
        break
      case ToolbarAction.ITALIC:
        parseAndSetComment(comment, textSelection, TextSelectionBehavior.Capture, '*', '*')
        break
      case ToolbarAction.UPLOAD:
        handleFileSelect()
        break
      case ToolbarAction.UNORDERED_LIST:
        parseAndSetComment(comment, textSelection, TextSelectionBehavior.Split, '- ')
        break
      case ToolbarAction.CHECK_LIST:
        parseAndSetComment(comment, textSelection, TextSelectionBehavior.Split, '- [ ] ')
        break
      case ToolbarAction.CODE_BLOCK:
        parseAndSetComment(comment, textSelection, TextSelectionBehavior.Capture, '```' + lang + '\n', '\n```')
        break
    }

    // Return cursor to proper place to continue typing based on where action above set selection index
    textAreaRef.current && textAreaRef.current.focus()
  }

  const setCommentAndTextSelection = (comment: string, textSelection: TextSelection) => {
    setTextSelection(textSelection)
    setComment(comment)
  }

  const onCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentAndTextSelection(e.target.value, { start: e.target.selectionStart, end: e.target.selectionEnd })
  }

  const onCommentSelect = () => {
    if (textAreaRef.current) {
      const target = textAreaRef.current

      setTextSelection({ start: target.selectionStart, end: target.selectionEnd })
    }
  }

  const onMouseUp = () => {
    if (textAreaRef.current) {
      const target = textAreaRef.current

      setTextSelection({ start: target.selectionStart, end: target.selectionEnd })
    }
  }

  const onKeyUp = (e: KeyboardEvent<HTMLTextAreaElement>) => {
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
        const parsedComment = parseComment(comment, textSelection, '')

        if (isListString(parsedComment.previousLine)) {
          handleActionClick(ToolbarAction.UNORDERED_LIST, comment, textSelection)
        }
        if (isListSelectString(parsedComment.previousLine)) {
          handleActionClick(ToolbarAction.CHECK_LIST, comment, textSelection)
        }
        break
      }
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
                className="min-h-24 pb-9 text-cn-foreground-1"
                autoFocus={!!inReplyMode}
                principalProps={principalProps}
                setPrincipalsMentionMap={setPrincipalsMentionMap}
                value={comment}
                setValue={setComment}
                onChange={e => onCommentChange(e)}
                onKeyUp={e => onKeyUp(e)}
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

              <Layout.Flex align="center" className="absolute bottom-px left-px w-min rounded bg-cn-background-1">
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
            <div className="min-h-24 w-full">
              {comment ? (
                <MarkdownViewer
                  markdownClassName="bg-transparent w-full"
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

              {isEditMode ? (
                <Button loading={parentIsLoading || isLoading} onClick={handleSaveComment}>
                  {buttonTitle || 'Save'}
                </Button>
              ) : (
                <Button loading={parentIsLoading || isLoading} onClick={handleSaveComment}>
                  {buttonTitle || 'Comment'}
                </Button>
              )}
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
