import { useCallback, useEffect, useRef, useState } from 'react'

import { Textarea } from '@/components'
import { PrincipalType } from '@/types'
import { Command } from '@components/command'
import { cn } from '@utils/cn'

import { getCaretCoordinates, getCurrentWord, replaceWord } from './utils'

interface Props {
  value: string
  setValue: (value: string) => void
  users?: PrincipalType[]
  setSearchPrincipalsQuery: (query: string) => void
  searchPrincipalsQuery: string
}

export function PullRequestCommentTextarea({
  value,
  setValue,
  users,
  setSearchPrincipalsQuery,
  searchPrincipalsQuery
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [commandValue, setCommandValue] = useState('')

  const [dropdownOpen, setDropdownOpen] = useState(false)

  // TODO: check if this is possible?!?
  // const texarea = textareaRef.current;
  // const dropdown = dropdownRef.current;

  const handleBlur = useCallback((e: Event) => {
    const dropdown = dropdownRef.current
    if (dropdown) {
      setDropdownOpen(false)
      // dropdown.classList.add('hidden')
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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const textarea = textareaRef.current
    const input = inputRef.current
    const dropdown = dropdownRef.current
    // if (textarea && input && dropdown) {
    if (textarea && input) {
      const currentWord = getCurrentWord(textarea)
      // const isDropdownHidden = dropdown.classList.contains('hidden')
      if (currentWord.startsWith('@') && dropdownOpen) {
        // FIXME: handle Escape
        if (
          e.key === 'ArrowUp' ||
          e.keyCode === 38 ||
          e.key === 'ArrowDown' ||
          e.keyCode === 40 ||
          e.key === 'Enter' ||
          e.keyCode === 13 ||
          e.key === 'Escape' ||
          e.keyCode === 27
        ) {
          e.preventDefault()
          input.dispatchEvent(new KeyboardEvent('keydown', e))
        }
      }
    }
  }, [])

  const onTextValueChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value
      const textarea = textareaRef.current
      const dropdown = dropdownRef.current

      if (textarea && dropdown) {
        const caret = getCaretCoordinates(textarea, textarea.selectionEnd)
        const currentWord = getCurrentWord(textarea)
        setValue(text)
        console.log({ currentWord })
        if (currentWord.startsWith('@') && currentWord.length > 1) {
          setCommandValue(currentWord)
          dropdown.style.left = caret.left + 'px'
          dropdown.style.top = caret.top + caret.height + 'px'
          setDropdownOpen(true)
          console.log('Dropdown opened')
        } else {
          // Hide dropdown when not typing @ mention or when @ is deleted
          setCommandValue('')
          setDropdownOpen(false)
        }
      }
    },
    [setValue]
  )

  const onCommandSelect = useCallback((value: string) => {
    const textarea = textareaRef.current
    const dropdown = dropdownRef.current
    if (textarea && dropdown) {
      replaceWord(textarea, `${value}`)
      setCommandValue('')
      setDropdownOpen(false)
      // dropdown.classList.add('hidden')
    }
  }, [])

  const handleMouseDown = useCallback((e: Event) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleSectionChange = useCallback((e: Event) => {
    const textarea = textareaRef.current
    const dropdown = dropdownRef.current
    if (textarea && dropdown) {
      const currentWord = getCurrentWord(textarea)
      console.log(currentWord)
      if (!currentWord.startsWith('@')) {
        setCommandValue('')
        setDropdownOpen(false)
      }
    }
  }, [])

  useEffect(() => {
    const textarea = textareaRef.current
    const dropdown = dropdownRef.current
    textarea?.addEventListener('keydown', handleKeyDown)
    textarea?.addEventListener('blur', handleBlur)
    document?.addEventListener('selectionchange', handleSectionChange)
    dropdown?.addEventListener('mousedown', handleMouseDown)
    return () => {
      textarea?.removeEventListener('keydown', handleKeyDown)
      textarea?.removeEventListener('blur', handleBlur)
      document?.removeEventListener('selectionchange', handleSectionChange)
      dropdown?.removeEventListener('mousedown', handleMouseDown)
    }
  }, [handleBlur, handleKeyDown, handleMouseDown, handleSectionChange])

  return (
    <div className="relative w-full">
      <Textarea
        resizable
        value={value}
        onChange={onTextValueChange}
        ref={textareaRef}
        className="bg-cn-background-2 text-cn-foreground-1 h-auto min-h-36 resize-none p-3 pb-10"
        autoComplete="off"
        autoCorrect="off"
        placeholder="Add your comment here"
      />
      {/* <p className="prose-none mt-1 text-sm text-muted-foreground">Supports markdown.</p> */}
      <Command.Root
        ref={dropdownRef}
        className={cn('absolute z-[10000] h-auto max-h-32 max-w-min overflow-y-scroll border border-popover shadow', {
          // hidden: !dropdownOpen
        })}
      >
        <div className="hidden">
          {/* REMINDER: className="hidden" won't hide the SearchIcon and border */}
          <Command.Input ref={inputRef} value={commandValue} />
        </div>
        <Command.List>
          <Command.Group className="max-w-min overflow-auto">
            {users?.map(user => {
              return (
                <Command.Item key={user.id} value={user.email} onSelect={onCommandSelect}>
                  {user.email}
                </Command.Item>
              )
            })}
          </Command.Group>
        </Command.List>
      </Command.Root>
    </div>
  )
}
PullRequestCommentTextarea.displayName = 'PullRequestCommentTextarea'
