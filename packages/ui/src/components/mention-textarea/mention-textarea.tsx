import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { Command } from '@/components/command'
import { Textarea, TextareaProps } from '@/components/form-primitives'
import { IconV2 } from '@/components/icon-v2'
import { usePortal } from '@/context'
import { cn } from '@/utils/cn'
import { getCaretCoordinates, getCurrentWord, replaceWord } from '@/utils/textarea-utils'
import { Command as CommandPrimitive } from 'cmdk'

export interface MentionItem {
  /** Unique identifier for the item */
  id: string
  /** Value used for matching/searching and insertion */
  value: string
  /** Optional display label (falls back to value) */
  label?: string
}

export interface MentionTextareaProps extends Omit<TextareaProps, 'value' | 'onChange'> {
  /** Current textarea value */
  value: string
  /** Callback when value changes */
  onValueChange: (value: string) => void
  /** Character that triggers the mention dropdown (default: "@") */
  triggerChar?: string
  /** Items to display in the dropdown */
  items: MentionItem[]
  /** Whether items are currently loading */
  isLoading?: boolean
  /** Callback when search query changes (triggered text after triggerChar) */
  onSearchChange?: (query: string) => void
  /** Callback when an item is selected */
  onItemSelect?: (item: MentionItem) => void
  /** Format the mention text to insert (default: `@[${item.value}]`) */
  formatMention?: (item: MentionItem) => string
  /** Custom item renderer */
  renderItem?: (item: MentionItem) => React.ReactNode
  /** Message to show when no items match */
  emptyMessage?: React.ReactNode
  /** Content to show while loading */
  loadingContent?: React.ReactNode
}

const VIEWPORT_PADDING = 8

const clampDropdownPosition = (top: number, left: number, dropdown?: HTMLDivElement | null) => {
  const dropdownWidth = dropdown?.offsetWidth ?? 208
  const dropdownHeight = dropdown?.offsetHeight ?? 208
  const maxLeft = window.innerWidth - dropdownWidth - VIEWPORT_PADDING
  const maxTop = window.innerHeight - dropdownHeight - VIEWPORT_PADDING

  return {
    top: Math.max(VIEWPORT_PADDING, Math.min(top, maxTop)),
    left: Math.max(VIEWPORT_PADDING, Math.min(left, maxLeft))
  }
}

export const MentionTextarea = forwardRef<HTMLTextAreaElement, MentionTextareaProps>(
  (
    {
      value,
      onValueChange,
      triggerChar = '@',
      items,
      isLoading = false,
      onSearchChange,
      onItemSelect,
      formatMention,
      renderItem,
      emptyMessage = 'No results found',
      loadingContent,
      className,
      ...textareaProps
    },
    ref
  ) => {
    const { portalContainer } = usePortal()
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [currentTriggerWord, setCurrentTriggerWord] = useState('')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })

    const updateDropdownPosition = useCallback(() => {
      const textarea = textareaRef.current
      if (!textarea) return

      const caret = getCaretCoordinates(textarea, textarea.selectionEnd)
      const rect = textarea.getBoundingClientRect()
      const adjustedTop = caret.top - textarea.scrollTop
      const rawTop = rect.top + adjustedTop + caret.height
      const rawLeft = rect.left + caret.left

      setDropdownPosition(clampDropdownPosition(rawTop, rawLeft, dropdownRef.current))
    }, [])

    const handleBlur = useCallback(() => {
      setDropdownOpen(false)
      setCurrentTriggerWord('')
    }, [])

    useEffect(() => {
      if (currentTriggerWord) {
        const searchQuery = currentTriggerWord.replace(triggerChar, '')
        onSearchChange?.(searchQuery)
      } else {
        onSearchChange?.('')
      }
    }, [currentTriggerWord, onSearchChange, triggerChar])

    const setRefs = useCallback(
      (element: HTMLTextAreaElement | null) => {
        textareaRef.current = element
        if (typeof ref === 'function') {
          ref(element)
        } else if (ref) {
          ref.current = element
        }
      },
      [ref]
    )

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        const textarea = textareaRef.current
        const input = inputRef.current

        if (e.key === 'Escape') {
          setDropdownOpen(false)
          setCurrentTriggerWord('')
          return
        }

        if (textarea && input && dropdownOpen) {
          const currentWord = getCurrentWord(textarea)

          if (currentWord.startsWith(triggerChar)) {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter' || e.key === 'Escape') {
              e.preventDefault()
              input.dispatchEvent(new KeyboardEvent('keydown', e))
            }
          }
        }
      },
      [dropdownOpen, triggerChar]
    )

    const onTextValueChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value
        const textarea = textareaRef.current

        if (textarea) {
          const currentWord = getCurrentWord(textarea)
          onValueChange(text)

          if (currentWord.startsWith(triggerChar)) {
            setCurrentTriggerWord(currentWord)
            updateDropdownPosition()
            setDropdownOpen(true)
          } else if (currentTriggerWord !== '') {
            setCurrentTriggerWord('')
            setDropdownOpen(false)
          }
        }
      },
      [onValueChange, currentTriggerWord, triggerChar, updateDropdownPosition]
    )

    const handleSelect = useCallback(
      (itemValue: string) => {
        const textarea = textareaRef.current
        const item = items.find(i => i.value === itemValue)

        if (textarea && item) {
          const mentionText = formatMention ? formatMention(item) : `${triggerChar}[${item.value}]`
          replaceWord(textarea, mentionText)
          setCurrentTriggerWord('')
          setDropdownOpen(false)
          onItemSelect?.(item)
        }
      },
      [items, formatMention, triggerChar, onItemSelect]
    )

    const handleMouseDown = useCallback((e: Event) => {
      e.preventDefault()
      e.stopPropagation()
    }, [])

    const handleSelectionChange = useCallback(() => {
      const textarea = textareaRef.current
      if (textarea) {
        const currentWord = getCurrentWord(textarea)
        if (!currentWord.startsWith(triggerChar)) {
          setCurrentTriggerWord('')
          setDropdownOpen(false)
        }
      }
    }, [triggerChar])

    const renderDropdownContent = () => {
      if (isLoading) {
        return (
          <Command.Loading className="min-w-52 px-cn-xs py-cn-md text-cn-3">
            {loadingContent || (
              <div className="grid place-content-center space-x-cn-xs">
                <IconV2 className="animate-spin" name="loader" />
              </div>
            )}
          </Command.Loading>
        )
      }

      if (items.length === 0) {
        return <Command.Empty className="min-w-52 p-cn-xs">{emptyMessage}</Command.Empty>
      }

      return (
        <Command.Group className="min-w-52 overflow-auto">
          {items.map(item => (
            <Command.Item key={item.id} value={item.value} onSelect={handleSelect}>
              {renderItem ? renderItem(item) : (item.label ?? item.value)}
            </Command.Item>
          ))}
        </Command.Group>
      )
    }

    useEffect(() => {
      const textarea = textareaRef.current
      textarea?.addEventListener('keydown', handleKeyDown)
      textarea?.addEventListener('blur', handleBlur)
      document?.addEventListener('selectionchange', handleSelectionChange)
      return () => {
        textarea?.removeEventListener('keydown', handleKeyDown)
        textarea?.removeEventListener('blur', handleBlur)
        document?.removeEventListener('selectionchange', handleSelectionChange)
      }
    }, [handleBlur, handleKeyDown, handleSelectionChange])

    useEffect(() => {
      const dropdown = dropdownRef.current
      dropdown?.addEventListener('mousedown', handleMouseDown)
      return () => {
        dropdown?.removeEventListener('mousedown', handleMouseDown)
      }
    }, [handleMouseDown, dropdownOpen])

    useEffect(() => {
      if (!dropdownOpen) return

      updateDropdownPosition()

      const handleReposition = () => updateDropdownPosition()

      window.addEventListener('resize', handleReposition)
      window.addEventListener('scroll', handleReposition, true)

      return () => {
        window.removeEventListener('resize', handleReposition)
        window.removeEventListener('scroll', handleReposition, true)
      }
    }, [dropdownOpen, updateDropdownPosition, items.length, isLoading])

    useEffect(() => {
      if (!dropdownOpen) return
      updateDropdownPosition()
    }, [dropdownOpen, items.length, isLoading, updateDropdownPosition])

    const dropdown = (
      <Command.Root
        ref={dropdownRef}
        shouldFilter={false}
        className={cn('fixed z-[10000] h-auto min-w-52 border', {
          hidden: !dropdownOpen
        })}
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left
        }}
      >
        <div className="hidden">
          <CommandPrimitive.Input ref={inputRef} />
        </div>

        <Command.List scrollAreaProps={{ className: 'max-h-52' }}>{renderDropdownContent()}</Command.List>
      </Command.Root>
    )

    return (
      <div className="relative w-full">
        <Textarea
          {...textareaProps}
          autoResize
          resizable
          className={cn('min-h-cn-textarea max-h-cn-textarea', className)}
          value={value}
          onChange={onTextValueChange}
          ref={setRefs}
          autoComplete="off"
          autoCorrect="off"
        />

        {createPortal(dropdown, portalContainer ?? document.body)}
      </div>
    )
  }
)

MentionTextarea.displayName = 'MentionTextarea'
