import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'

import { IconV2, Textarea, TextareaProps } from '@/components'
import { PrincipalType } from '@/types'
import { Command } from '@components/command'
import { cn } from '@utils/cn'
import { Command as CommandPrimitive } from 'cmdk'

import { getCaretCoordinates, getCurrentWord, replaceWord } from './utils'

interface PullRequestCommentTextareaProps extends TextareaProps {
  value: string
  setValue: (value: string) => void
  users?: PrincipalType[]
  setSearchPrincipalsQuery: (query: string) => void
  searchPrincipalsQuery: string
}

export const PullRequestCommentTextarea = forwardRef<HTMLTextAreaElement, PullRequestCommentTextareaProps>(
  (
    {
      value,
      setValue,
      users = [],
      setSearchPrincipalsQuery,
      onChange,
      searchPrincipalsQuery,
      ...textareaProps
    }: PullRequestCommentTextareaProps,
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [commandValue, setCommandValue] = useState('')

    const [dropdownOpen, setDropdownOpen] = useState(false)

    const handleBlur = useCallback((e: Event) => {
      const dropdown = dropdownRef.current
      if (dropdown) {
        setDropdownOpen(false)
        setCommandValue('')
      }
    }, [])

    useEffect(() => {
      if (commandValue) {
        const searchQuery = commandValue.replace('@', '')
        setSearchPrincipalsQuery(searchQuery)
      } else {
        setSearchPrincipalsQuery('')
      }
    }, [commandValue, setSearchPrincipalsQuery])

    // Combine refs to handle both forward ref and internal ref
    const setRefs = (element: HTMLTextAreaElement | null) => {
      // Save to local ref
      textareaRef.current = element

      // Forward to external ref
      if (typeof ref === 'function') {
        ref(element)
      } else if (ref) {
        ref.current = element
      }
    }

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        const textarea = textareaRef.current
        const input = inputRef.current

        if (e.key === 'Escape') {
          setDropdownOpen(false)
          setCommandValue('')
          return
        }

        if (textarea && input) {
          const currentWord = getCurrentWord(textarea)

          if (currentWord.startsWith('@')) {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter' || e.key === 'Escape') {
              e.preventDefault()

              input.dispatchEvent(new KeyboardEvent('keydown', e))
            }
          }
        }
      },
      [setCommandValue]
    )

    const onTextValueChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value
        const textarea = textareaRef.current
        const dropdown = dropdownRef.current

        console.log('onChange')

        if (textarea && dropdown) {
          const caret = getCaretCoordinates(textarea, textarea.selectionEnd)
          const currentWord = getCurrentWord(textarea)
          setValue(text)
          console.log({ currentWord })
          // Only show dropdown when typing @ followed by at least one character
          if (currentWord.startsWith('@')) {
            setCommandValue(currentWord)
            dropdown.style.left = caret.left + 'px'
            dropdown.style.top = caret.top + caret.height + 'px'
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
        replaceWord(textarea, `${value}`)
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
      if (typeof users === 'undefined') {
        return (
          <Command.Loading className="text-cn-foreground-3 min-w-52 px-2 py-4 text-sm">
            <div className="flex place-content-center space-x-2">
              <IconV2 className="animate-spin" name="loader" />
            </div>
          </Command.Loading>
        )
      }

      if (users === null || (Array.isArray(users) && users.length === 0)) {
        return <Command.Empty className="text-cn-foreground-3 px-2 py-4 text-sm">No results.</Command.Empty>
      }

      console.log(users)

      return (
        <Command.Group className="min-w-52 max-w-min overflow-auto">
          {users?.map(user => {
            return (
              <Command.Item key={user.uid} value={user.email} onSelect={onCommandSelect}>
                {user.email}
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
          resizable
          value={value}
          onChange={e => {
            onTextValueChange(e)
            onChange?.(e)
          }}
          ref={setRefs}
          className="bg-cn-background-2 text-cn-foreground-1 h-auto min-h-36 resize-none p-3 pb-10"
          autoComplete="off"
          autoCorrect="off"
          placeholder="Add your comment here"
        />
        {/* <p className="prose-none mt-1 text-sm text-muted-foreground">Supports markdown.</p> */}

        <Command.Root
          ref={dropdownRef}
          shouldFilter={false}
          className={cn('absolute z-[10000] h-auto max-h-32 max-w-min overflow-y-scroll border border-popover shadow', {
            hidden: !dropdownOpen
          })}
        >
          <div className="hidden">
            {/* Input is needed for accessibility features */}
            <CommandPrimitive.Input ref={inputRef} />
          </div>

          <Command.List>{renderCommandList()}</Command.List>
        </Command.Root>
      </div>
    )
  }
)
PullRequestCommentTextarea.displayName = 'PullRequestCommentTextarea'
