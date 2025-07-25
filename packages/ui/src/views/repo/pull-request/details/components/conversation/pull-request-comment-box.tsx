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

import { Avatar, Button, IconV2, IconV2NamesType, Layout, MarkdownViewer, Tabs, Textarea } from '@/components'
import { PrincipalType } from '@/types'
import { handleFileDrop, handlePaste, HandleUploadType, PrincipalsMentionMap, ToolbarAction } from '@/views'
import { cn } from '@utils/cn'
import { isEmpty, isUndefined } from 'lodash-es'

import { PullRequestCommentTextarea } from './pull-request-comment-textarea'
import { replaceMentionEmailWithId } from './utils'

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
  searchPrincipalsQuery: string
  setSearchPrincipalsQuery: (query: string) => void
  principals?: PrincipalType[]
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
  handleUpload,
  searchPrincipalsQuery,
  setSearchPrincipalsQuery,
  principals
}: PullRequestCommentBoxProps) => {
  const [__file, setFile] = useState<File>()
  const [activeTab, setActiveTab] = useState<typeof TABS_KEYS.WRITE | typeof TABS_KEYS.PREVIEW>(TABS_KEYS.WRITE)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [textSelection, setTextSelection] = useState({ start: 0, end: 0 })
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const [principalsMentionMap, setPrincipalsMentionMap] = useState<PrincipalsMentionMap>({})

  const handleTabChange = (tab: typeof TABS_KEYS.WRITE | typeof TABS_KEYS.PREVIEW) => {
    setActiveTab(tab)
  }

  useEffect(() => {
    console.log('principals', principals)
  }, [principals])

  const handleSaveComment = () => {
    if (comment.trim()) {
      const formattedComment = replaceMentionEmailWithId(comment, principalsMentionMap)
      onSaveComment(formattedComment)
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
          ? `${injectedPreString}${parseDiff(diff, sideKey, lineNumber)}${injectedPostString}`
          : `${injectedPreString}${parsedComment.selection}${injectedPostString}`
        break
    }

    setCommentAndTextSelection(`${parsedComment.beforeSelection}${injectedString}${parsedComment.afterSelection}`, {
      start: parsedComment.selectionStart,
      end: parsedComment.selectionEnd
    })
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
      case ToolbarAction.UNORDER_LIST:
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
          handleActionClick(ToolbarAction.UNORDER_LIST, comment, textSelection)
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
    <div className={cn('flex items-start gap-x-3 font-sans', className)} data-comment-editor-shown="true">
      {!inReplyMode && !isEditMode && avatar}
      <div
        className={cn('pb-4 pt-1.5 px-4 flex-1 bg-cn-background-2 border-border-1', {
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
              {/* <Textarea
                ref={textAreaRef}
                className="bg-cn-background-2 text-cn-foreground-1 min-h-36 p-3 pb-10"
                autoFocus={!!inReplyMode}
                placeholder="Add your comment here"
                value={comment}
                onChange={e => onCommentChange(e)}
                onKeyUp={e => onKeyUp(e)}
                onMouseUp={() => onMouseUp()}
                onPaste={e => {
                  if (e.clipboardData.files.length > 0) {
                    handlePasteForUpload(e)
                  }
                }}
                resizable
              /> */}

              <PullRequestCommentTextarea
                resizable
                ref={textAreaRef}
                users={principals}
                className="bg-cn-background-2 text-cn-foreground-1 min-h-36 p-3 pb-10"
                autoFocus={!!inReplyMode}
                setSearchPrincipalsQuery={setSearchPrincipalsQuery}
                searchPrincipalsQuery={searchPrincipalsQuery}
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
              {isDragging && (
                <div className="border-cn-borders-2 absolute inset-1 cursor-copy rounded-sm border border-dashed z-[100]" />
              )}

              <Layout.Flex align="center" className="bg-cn-background-2 pb-2 pt-1">
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
                        <IconV2 name={item.icon} />
                      </Button>
                      {isFirst && <div className="bg-cn-background-3 h-4 w-px" />}
                    </Fragment>
                  )
                })}
              </Layout.Flex>
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
PullRequestCommentBox.displayName = 'PullRequestCommentBox'
