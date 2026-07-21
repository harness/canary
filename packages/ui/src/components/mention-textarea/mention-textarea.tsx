import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'

import { Command } from '@/components/command'
import { Textarea, TextareaProps } from '@/components/form-primitives'
import { IconV2 } from '@/components/icon-v2'
import { usePortal } from '@/context'
import { cn } from '@/utils/cn'
import { getCaretCoordinates, getCurrentWord, replaceWord } from '@/utils/textarea-utils'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Command as CommandPrimitive } from 'cmdk'

import { getViewportShift } from './clamp-dropdown-position'

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

    const updateDropdownPosition = useCallback(() => {
      const textarea = textareaRef.current
      const dropdown = dropdownRef.current
      if (!textarea || !dropdown) return

      const caret = getCaretCoordinates(textarea, textarea.selectionEnd)
      const rect = textarea.getBoundingClientRect()
      const top = rect.top + caret.top - textarea.scrollTop + caret.height
      const left = rect.left + caret.left

      dropdown.style.top = `${top}px`
      dropdown.style.left = `${left}px`

      const { dx, dy } = getViewportShift(dropdown.getBoundingClientRect())
      if (dx !== 0) dropdown.style.left = `${left + dx}px`
      if (dy !== 0) dropdown.style.top = `${top + dy}px`
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
            setDropdownOpen(true)
            requestAnimationFrame(updateDropdownPosition)
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
      const dropdown = dropdownRef.current
      textarea?.addEventListener('keydown', handleKeyDown)
      textarea?.addEventListener('blur', handleBlur)
      document?.addEventListener('selectionchange', handleSelectionChange)
      dropdown?.addEventListener('mousedown', handleMouseDown)
      return () => {
        textarea?.removeEventListener('keydown', handleKeyDown)
        textarea?.removeEventListener('blur', handleBlur)
        document?.removeEventListener('selectionchange', handleSelectionChange)
        dropdown?.removeEventListener('mousedown', handleMouseDown)
      }
    }, [handleBlur, handleKeyDown, handleMouseDown, handleSelectionChange])

    useEffect(() => {
      if (!dropdownOpen) return

      updateDropdownPosition()
      const handleReposition = () => updateDropdownPosition()
      window.addEventListener('scroll', handleReposition, true)
      window.addEventListener('resize', handleReposition)

      return () => {
        window.removeEventListener('scroll', handleReposition, true)
        window.removeEventListener('resize', handleReposition)
      }
    }, [dropdownOpen, updateDropdownPosition, items.length, isLoading])

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

        <DropdownMenuPrimitive.Portal container={portalContainer}>
          <Command.Root
            ref={dropdownRef}
            shouldFilter={false}
            className={cn('fixed z-[10000] h-auto min-w-52 border', {
              hidden: !dropdownOpen
            })}
          >
            <div className="hidden">
              <CommandPrimitive.Input ref={inputRef} />
            </div>

            <Command.List scrollAreaProps={{ className: 'max-h-52' }}>{renderDropdownContent()}</Command.List>
          </Command.Root>
        </DropdownMenuPrimitive.Portal>
      </div>
    )
  }
)

MentionTextarea.displayName = 'MentionTextarea'
