import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'

import { IconV2, Textarea, TextareaProps } from '@/components'
import { Command } from '@components/command'
import { cn } from '@utils/cn'
import { Command as CommandPrimitive } from 'cmdk'

import { PrincipalPropsType, PrincipalsMentionMap } from '../../pull-request-details-types'
import { getCaretCoordinates, getCurrentWord, replaceWord } from './utils'

interface PullRequestCommentTextareaProps extends TextareaProps {
  value: string
  setValue: (value: string) => void
  setPrincipalsMentionMap: React.Dispatch<React.SetStateAction<PrincipalsMentionMap>>
  principalProps: PrincipalPropsType
}

export const PullRequestCommentTextarea = forwardRef<HTMLTextAreaElement, PullRequestCommentTextareaProps>(
  (
    {
      value,
      setValue,
      principalProps,
      onChange,
      className,
      setPrincipalsMentionMap,
      ...textareaProps
    }: PullRequestCommentTextareaProps,
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [commandValue, setCommandValue] = useState('')

    const [dropdownOpen, setDropdownOpen] = useState(false)

    const { setSearchPrincipalsQuery, principals, isPrincipalsLoading } = principalProps || {}

    const handleBlur = useCallback(() => {
      const dropdown = dropdownRef.current
      if (dropdown) {
        setDropdownOpen(false)
        setCommandValue('')
      }
    }, [])

    useEffect(() => {
      if (commandValue) {
        const searchQuery = commandValue.replace('@', '')
        setSearchPrincipalsQuery?.(searchQuery)
      } else {
        setSearchPrincipalsQuery?.('')
      }
    }, [commandValue, setSearchPrincipalsQuery])

    // Combine refs to handle both forward ref and internal ref
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
          setCommandValue('')
          return
        }

        // Only handle keyboard events when dropdown is open
        if (textarea && input && dropdownOpen) {
          const currentWord = getCurrentWord(textarea)

          if (currentWord.startsWith('@')) {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter' || e.key === 'Escape') {
              e.preventDefault()

              input.dispatchEvent(new KeyboardEvent('keydown', e))
            }
          }
        }
      },
      [setCommandValue, dropdownOpen]
    )

    const onTextValueChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value
        const textarea = textareaRef.current
        const dropdown = dropdownRef.current

        if (textarea && dropdown) {
          const currentWord = getCurrentWord(textarea)
          setValue(text)

          // Only show dropdown when typing @ followed by at least one character
          if (currentWord.startsWith('@')) {
            const caret = getCaretCoordinates(textarea, textarea.selectionEnd)
            setCommandValue(currentWord)

            // Account for textarea scroll position when positioning dropdown
            const adjustedTop = caret.top - textarea.scrollTop

            dropdown.style.left = caret.left + 'px'
            // Position relative to the visible caret position, not the absolute position
            dropdown.style.top = adjustedTop + caret.height + 'px'
            setDropdownOpen(true)
          } else {
            // Hide dropdown when not typing @ mention or when @ is deleted
            if (commandValue !== '') {
              setCommandValue('')
              setDropdownOpen(false)
            }
          }
        }
      },
      [setValue, commandValue]
    )

    const onCommandSelect = useCallback((value: string) => {
      const textarea = textareaRef.current
      const dropdown = dropdownRef.current
      if (textarea && dropdown) {
        replaceWord(textarea, `@[${value}]`)
        setCommandValue('')
        setDropdownOpen(false)
      }
    }, [])

    const handleMouseDown = useCallback((e: Event) => {
      e.preventDefault()
      e.stopPropagation()
    }, [])

    const handleSelectionChange = useCallback(() => {
      const textarea = textareaRef.current
      const dropdown = dropdownRef.current
      if (textarea && dropdown) {
        const currentWord = getCurrentWord(textarea)
        if (!currentWord.startsWith('@')) {
          setCommandValue('')
          setDropdownOpen(false)
        }
      }
    }, [])

    const renderCommandList = () => {
      if (isPrincipalsLoading) {
        return (
          <Command.Loading className="min-w-52 px-cn-xs py-cn-md text-cn-3">
            <div className="grid place-content-center space-x-2">
              <IconV2 className="animate-spin" name="loader" />
            </div>
          </Command.Loading>
        )
      }

      if (principals === null || (Array.isArray(principals) && principals.length === 0)) {
        return <Command.Empty className="min-w-max p-cn-xs text-2">User not found</Command.Empty>
      }

      return (
        <Command.Group className="min-w-52 max-w-min overflow-auto">
          {principals?.map(principal => {
            return (
              <Command.Item
                key={principal.uid}
                value={principal.email}
                onSelect={(...args) => {
                  onCommandSelect(...args)
                  setPrincipalsMentionMap((prev: PrincipalsMentionMap) => ({
                    ...prev,
                    [principal.email || '']: principal
                  }))
                }}
              >
                {principal.email}
              </Command.Item>
            )
          })}
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

    return (
      <div className="relative w-full">
        <Textarea
          {...textareaProps}
          autoResize
          resizable
          className={cn('min-h-cn-textarea max-h-cn-textarea', className)}
          value={value}
          onChange={e => {
            onTextValueChange(e)
            onChange?.(e)
          }}
          ref={setRefs}
          autoComplete="off"
          autoCorrect="off"
        />

        <Command.Root
          ref={dropdownRef}
          shouldFilter={false}
          className={cn('absolute z-[10000] h-auto max-w-min border', {
            hidden: !dropdownOpen
          })}
        >
          <div className="hidden">
            {/* Input is needed for accessibility features */}
            <CommandPrimitive.Input ref={inputRef} />
          </div>

          {/* max-h-52 - setting max height of the list to 208px */}
          <Command.List scrollAreaProps={{ className: 'max-h-52' }}>{renderCommandList()}</Command.List>
        </Command.Root>
      </div>
    )
  }
)
PullRequestCommentTextarea.displayName = 'PullRequestCommentTextarea'
