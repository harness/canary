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

import { Avatar, Button, IconV2, IconV2NamesType, MarkdownViewer, Tabs, Textarea } from '@/components'
import { handleFileDrop, handlePaste, HandleUploadType, ToolbarAction } from '@/views'
import { cn } from '@utils/cn'
import { isEmpty, isUndefined } from 'lodash-es'

interface TextSelection {
  start: number
  end: number
}

interface StringSelection {
  beforeSelection: string
  selection: string
  afterSelection: string
  previousLine: string
  textSelectionStart: number
  textSelectionEnd: number
}

interface ToolbarItem {
  icon: IconV2NamesType
  action: ToolbarAction
  title?: string
  size?: number
}

export interface PullRequestCommentBoxProps {
  className?: string
  onSaveComment: (comment: string) => void
  comment: string
  lang?: string
  diff?: string
  lineNumber?: number
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
  onCancelClick?: () => void
  handleUpload?: HandleUploadType
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
  comment,
  setComment,
  isEditMode,
  handleUpload
}: PullRequestCommentBoxProps) => {
  const [__file, setFile] = useState<File>()
  const [activeTab, setActiveTab] = useState<typeof TABS_KEYS.WRITE | typeof TABS_KEYS.PREVIEW>(TABS_KEYS.WRITE)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [textSelection, setTextSelection] = useState({ start: 0, end: 0 })
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleSaveComment = () => {
    if (comment.trim()) {
      onSaveComment(comment)
      setComment('') // Clear the comment box after saving
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

    const beforeSelectionParts = beforeSelection.split('\n')
    const previousLine = beforeSelectionParts.at(beforeSelectionParts.length - 2) ?? ''

    const newTextSelectionStart = textSelection.start + injectedPreString.length + injectedNewline.length
    const newTextSelectionEnd =
      newTextSelectionStart + (textSelection.end - textSelection.start) + injectedNewline.length

    return {
      beforeSelection: beforeSelection,
      selection: selection,
      afterSelection: afterSelection,
      previousLine: previousLine,
      textSelectionStart: newTextSelectionStart,
      textSelectionEnd: newTextSelectionEnd
    }
  }

  const parseAndSetComment = (
    comment: string,
    textSelection: TextSelection,
    injectedPreString: string,
    injectedPostString: string = '',
    injectedString: string = ''
  ) => {
    const parsedComment = parseComment(comment, textSelection, injectedPreString)

    setCommentAndTextSelection(
      `${parsedComment.beforeSelection}${injectedPreString}${injectedString}${parsedComment.selection}${injectedPostString}${parsedComment.afterSelection}`,
      { start: parsedComment.textSelectionStart, end: parsedComment.textSelectionEnd }
    )
  }

  const parseDiff = (diff: string = '', sideKey?: 'oldFile' | 'newFile', lineNumber?: number): string => {
    if (isUndefined(sideKey) || isUndefined(lineNumber)) {
      return ''
    }

    const diffLines = diff.split('\n')

    const sideChangedLineToken = sideKey === 'newFile' ? '+' : '-'
    const otherSideChangedLineToken = sideKey === 'newFile' ? '-' : '+'

    const sideDiffLines = diffLines.filter(diffLine => !diffLine.startsWith(otherSideChangedLineToken))

    const found = sideDiffLines.reduce((previousValue, currentValue, currentIndex): string => {
      if (isEmpty(previousValue) && currentValue.startsWith('@@')) {
        const sectionInfoParts = currentValue.split(' ')

        const fileLineNumber = +(
          sectionInfoParts
            .find(part => part.startsWith(sideChangedLineToken))
            ?.split(',')
            .at(0)
            ?.substring(1) ?? ''
        )
        const fileLineOffset = lineNumber - fileLineNumber + 1

        const sideDiffLine = sideDiffLines.at(currentIndex + fileLineOffset) ?? ''

        const modifiedSideDiffLine = sideDiffLine.startsWith(sideChangedLineToken)
          ? ` ${sideDiffLine.substring(1)}`
          : sideDiffLine

        return modifiedSideDiffLine
      }

      return previousValue
    }, '')

    return found
  }

  const toolbar: ToolbarItem[] = useMemo(() => {
    const initial: ToolbarItem[] = []
    // TODO: Design system: Update icons once they are available in IconV2
    return [
      ...initial,
      { icon: 'suggestion', action: ToolbarAction.SUGGESTION },
      { icon: 'header', action: ToolbarAction.HEADER },
      { icon: 'bold', action: ToolbarAction.BOLD },
      { icon: 'italic', action: ToolbarAction.ITALIC },
      { icon: 'attachment', action: ToolbarAction.UPLOAD },
      { icon: 'list', action: ToolbarAction.UNORDER_LIST },
      { icon: 'list-select', action: ToolbarAction.CHECK_LIST },
      { icon: 'code', action: ToolbarAction.CODE_BLOCK }
    ]
  }, [])

  const handleActionClick = (type: ToolbarAction, comment: string, textSelection: TextSelection) => {
    switch (type) {
      case ToolbarAction.SUGGESTION:
        parseAndSetComment(comment, textSelection, '```suggestion\n', '\n```', parseDiff(diff, sideKey, lineNumber))
        break
      case ToolbarAction.HEADER:
        parseAndSetComment(comment, textSelection, '# ')
        break
      case ToolbarAction.BOLD:
        parseAndSetComment(comment, textSelection, '**', '**')
        break
      case ToolbarAction.ITALIC:
        parseAndSetComment(comment, textSelection, '*', '*')
        break
      case ToolbarAction.UPLOAD:
        handleFileSelect()
        break
      case ToolbarAction.UNORDER_LIST:
        parseAndSetComment(comment, textSelection, '- ')
        break
      case ToolbarAction.CHECK_LIST:
        parseAndSetComment(comment, textSelection, '- [ ] ')
        break
      case ToolbarAction.CODE_BLOCK:
        parseAndSetComment(comment, textSelection, '```' + lang + '\n', '\n```')
        break
    }
  }

  const handleTabChange = (tab: typeof TABS_KEYS.WRITE | typeof TABS_KEYS.PREVIEW) => {
    setActiveTab(tab)
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

  const onKeyUp = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === 'Enter') {
      const parsedComment = parseComment(comment, textSelection, '')

      if (isListString(parsedComment.previousLine)) {
        handleActionClick(ToolbarAction.UNORDER_LIST, comment, textSelection)
      }
      if (isListSelectString(parsedComment.previousLine)) {
        handleActionClick(ToolbarAction.CHECK_LIST, comment, textSelection)
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
    <div className={cn('flex items-start gap-x-3 font-sans', className)} data-comment-editor-shown="true">
      {!inReplyMode && !isEditMode && avatar}
      <div
        className={cn('pb-4 pt-1.5 px-4 flex-1 bg-cn-background-2 border-border-1 overflow-auto', {
          'border rounded-md': !inReplyMode || isEditMode,
          'border-t': inReplyMode
        })}
      >
        <Tabs.Root defaultValue={TABS_KEYS.WRITE} value={activeTab} onValueChange={handleTabChange}>
          <Tabs.List className="-mx-4 px-4" activeClassName="bg-cn-background-2" variant="overlined">
            <Tabs.Trigger value={TABS_KEYS.WRITE}>Write</Tabs.Trigger>
            <Tabs.Trigger value={TABS_KEYS.PREVIEW}>Preview</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content className="mt-4" value={TABS_KEYS.WRITE}>
            <div
              className="relative"
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              ref={dropZoneRef}
            >
              <Textarea
                ref={textAreaRef}
                className="bg-cn-background-2 text-cn-foreground-1 min-h-36 p-3 pb-10"
                autoFocus={!!inReplyMode}
                placeholder="Add your comment here"
                value={comment}
                onChange={e => onCommentChange(e)}
                onKeyUpCapture={e => onKeyUp(e)}
                onPaste={e => {
                  if (e.clipboardData.files.length > 0) {
                    handlePasteForUpload(e)
                  }
                }}
                resizable
              />
              {isDragging && (
                <div className="border-cn-borders-2 absolute inset-1 cursor-copy rounded-sm border border-dashed" />
              )}

              <div className="bg-cn-background-2 absolute bottom-px left-1/2 -ml-0.5 flex w-[calc(100%-16px)] -translate-x-1/2 items-center pb-2 pt-1">
                {toolbar.map((item, index) => {
                  const isFirst = index === 0
                  return (
                    <Fragment key={`${comment}-${index}`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        iconOnly
                        onClick={() => handleActionClick(item.action, comment, textSelection)}
                      >
                        <IconV2 className="text-icons-9" name={item.icon} />
                      </Button>
                      {isFirst && <div className="bg-cn-background-3 h-4 w-px" />}
                    </Fragment>
                  )
                })}
              </div>
            </div>
          </Tabs.Content>
          <Tabs.Content className="mt-4 w-full" value={TABS_KEYS.PREVIEW}>
            <div className="min-h-24 w-full">
              {comment ? (
                <MarkdownViewer markdownClassName="!bg-cn-background-2 w-full" source={comment} />
              ) : (
                <span className="text-cn-foreground-1">Nothing to preview</span>
              )}
            </div>
          </Tabs.Content>
        </Tabs.Root>

        <div className="mt-4 flex items-center justify-between">
          {activeTab === TABS_KEYS.WRITE && (
            <div>
              <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              <Button size="sm" variant="ghost" onClick={handleFileSelect}>
                <IconV2 name="attachment-image" />
                <span>Drag & drop, select, or paste to attach files</span>
              </Button>
            </div>
          )}

          <div className="ml-auto flex gap-x-3">
            {(inReplyMode || isEditMode) && (
              <Button variant="outline" onClick={onCancelClick}>
                Cancel
              </Button>
            )}

            {isEditMode ? (
              <Button onClick={handleSaveComment}>Save</Button>
            ) : (
              <Button onClick={handleSaveComment}>Comment</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
