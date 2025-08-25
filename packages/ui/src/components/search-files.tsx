import { KeyboardEvent, ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import { DropdownMenu, SearchInput, SearchInputProps, Text } from '@/components'
import { useTranslation } from '@/context'
import { afterFrames, getShadowActiveElement } from '@/utils'
import { cn } from '@utils/cn'

const markedFileClassName = 'w-full text-cn-foreground-1'
const MAX_FILES = 50

/**
 * Get marked file component with query
 * @param file
 * @param query
 * @param matchIndex
 */
const getMarkedFileElement = (file: string, query: string, matchIndex: number): ReactNode => {
  if (matchIndex === -1) {
    return (
      <Text className={markedFileClassName} truncate>
        {file}
      </Text>
    )
  }

  const startText = file.slice(0, matchIndex)
  const matchedText = file.slice(matchIndex, matchIndex + query.length)
  const endText = file.slice(matchIndex + query.length)

  return (
    <Text className={cn(markedFileClassName, 'break-words')}>
      {startText && <span>{startText}</span>}
      {matchedText && <mark>{matchedText}</mark>}
      {endText && <span>{endText}</span>}
    </Text>
  )
}

interface FilteredFile {
  file: string
  element: ReactNode
}

interface SearchFilesProps {
  navigateToFile: (file: string) => void
  filesList?: string[]
  searchInputSize?: SearchInputProps['size']
  inputContainerClassName?: string
  contentClassName?: string
}

export const SearchFiles = ({
  navigateToFile,
  filesList,
  searchInputSize = 'md',
  inputContainerClassName,
  contentClassName
}: SearchFilesProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredFiles, setFilteredFiles] = useState<FilteredFile[]>([])
  const [currentQuery, setCurrentQuery] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (!filesList || !currentQuery) {
      setFilteredFiles([])
      return
    }

    const lowerCaseQuery = currentQuery.toLowerCase()
    const _filteredFiles: FilteredFile[] = []

    for (const file of filesList) {
      const lowerCaseFile = file.toLowerCase()
      const matchIndex = lowerCaseFile.indexOf(lowerCaseQuery)

      if (matchIndex > -1) {
        _filteredFiles.push({
          file,
          element: getMarkedFileElement(file, lowerCaseQuery, matchIndex)
        })
      }

      // Limiting the result to 50, refactor this once backend supports pagination
      if (_filteredFiles.length === MAX_FILES) {
        break
      }
    }

    setFilteredFiles(_filteredFiles)
  }, [filesList, currentQuery])

  const handleInputChange = useCallback((searchQuery: string) => {
    setIsOpen(searchQuery !== '')
    setCurrentQuery(searchQuery)
  }, [])

  const getItems = useCallback(() => {
    if (!contentRef.current) return []
    return Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>('[data-radix-collection-item]:not([data-disabled])')
    )
  }, [])

  const focusItem = useCallback(
    (isFirst = true) => {
      const items = getItems()
      items[isFirst ? 0 : items.length - 1]?.focus()
    },
    [getItems]
  )

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      afterFrames(() => focusItem(e.key === 'ArrowDown'))
    }
  }

  const handleContentKeyDownCapture = (e: KeyboardEvent<HTMLDivElement>) => {
    const rootEl = contentRef.current
    if (!rootEl) return

    const { activeEl } = getShadowActiveElement(rootEl)
    const items = getItems()

    if (!items.length) return

    const first = items[0]
    const last = items[items.length - 1]

    if ((e.key === 'ArrowUp' && activeEl === first) || (e.key === 'ArrowDown' && activeEl === last)) {
      e.preventDefault()
      inputRef.current?.focus()
      setIsOpen(true)
      return
    }
  }

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <div className={cn('relative', inputContainerClassName)}>
        <DropdownMenu.Trigger className="pointer-events-none absolute inset-0 -z-0" tabIndex={-1} />
        <SearchInput
          ref={inputRef}
          size={searchInputSize}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
      </div>

      <DropdownMenu.Content
        ref={contentRef}
        className={cn('w-[800px]', contentClassName)}
        align="start"
        onKeyDownCapture={handleContentKeyDownCapture}
        onOpenAutoFocus={event => event.preventDefault()}
      >
        {filteredFiles.length ? (
          filteredFiles?.map(({ file, element }) => (
            <DropdownMenu.IconItem
              key={file}
              onSelect={() => {
                navigateToFile(file)
                setIsOpen(false)
              }}
              title={element}
              icon="empty-page"
            />
          ))
        ) : (
          <DropdownMenu.NoOptions className="!p-2">
            {t('component:searchFile.noFile', 'No file found.')}
          </DropdownMenu.NoOptions>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
