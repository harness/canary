import { ReactNode, useCallback, useEffect, useState } from 'react'

import {
  DropdownMenu,
  SearchInput,
  SearchInputProps,
  Text,
  useSearchableDropdownKeyboardNavigation
} from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@utils/cn'
import fuzzysort from 'fuzzysort'

const markedFileClassName = 'w-full text-cn-1'
const MAX_FILES = 50

export interface FileItem {
  label: string
  value: string
}

/**
 * Highlight matched characters based on fuzzysort match indices
 * @param text - The text to display
 * @param indexes - Array of character positions that matched (from fuzzysort)
 */
const getMarkedFileElement = (result: Fuzzysort.KeyResult<FileItem>): ReactNode => {
  let spanKeyIndex = 0
  const parts = result
    .highlight((m, index) => <mark key={'m-' + index}>{m}</mark>)
    .filter(part => typeof part !== 'string' || part.length > 0)
    .map(part => {
      if (typeof part === 'string') {
        return <span key={'s-' + spanKeyIndex++}>{part}</span>
      }
      return part
    })

  return <Text className={cn(markedFileClassName, 'break-words')}>{parts}</Text>
}

interface FilteredFile {
  label: string
  value: string
  element: ReactNode
}

interface SearchFilesProps {
  onSearch?: (query: string) => void
  navigateToFile: (file: string) => void
  filesList?: string[] | FileItem[]
  searchInputSize?: SearchInputProps['size']
  inputContainerClassName?: string
  contentClassName?: string
}

/**
 * Normalizes a file item to the { label, value } format
 */
const normalizeFileItem = (item: string | FileItem): FileItem => {
  if (typeof item === 'string') {
    return { label: item, value: item }
  }
  return item
}

export const SearchFiles = ({
  navigateToFile,
  filesList,
  searchInputSize = 'md',
  inputContainerClassName,
  onSearch,
  contentClassName
}: SearchFilesProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredFiles, setFilteredFiles] = useState<FilteredFile[]>([])
  const [currentQuery, setCurrentQuery] = useState('')
  const { t } = useTranslation()

  const { searchInputRef, handleSearchKeyDown, getItemProps } = useSearchableDropdownKeyboardNavigation({
    onFirstItemKeyDown: () => setIsOpen(true),
    onLastItemKeyDown: () => setIsOpen(true),
    itemsLength: filteredFiles.length
  })

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // add additional handling of escape key clearing the search input and removing the focus
      if (e.key === 'Escape') {
        setCurrentQuery('')
        searchInputRef.current?.blur()
        return
      }

      handleSearchKeyDown(e)
    },
    [handleSearchKeyDown, searchInputRef, setCurrentQuery]
  )

  useEffect(() => {
    if (!filesList || !currentQuery) {
      setFilteredFiles([])
      return
    }

    const normalizedFiles = filesList.map(normalizeFileItem)

    // Use fuzzysort for strict subsequence matching (like VS Code)
    const results = fuzzysort.go(currentQuery, normalizedFiles, {
      key: 'label',
      limit: MAX_FILES
    })

    // Map results with highlighted matches
    const _filteredFiles: FilteredFile[] = results.map(result => {
      const { label, value } = result.obj
      return {
        label,
        value,
        element: getMarkedFileElement(result)
      }
    })

    setFilteredFiles(_filteredFiles)
  }, [filesList, currentQuery, setFilteredFiles])

  const handleInputChange = useCallback(
    (searchQuery: string) => {
      setIsOpen(searchQuery !== '')
      setCurrentQuery(searchQuery)
      onSearch?.(searchQuery)
    },
    [onSearch, setCurrentQuery, setIsOpen]
  )

  const handleFocus = useCallback(() => {
    // Show dropdown if there's already content in the search box
    if (currentQuery) {
      setIsOpen(true)
    }
  }, [currentQuery, setIsOpen])

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <div className={cn('relative', inputContainerClassName)}>
        <DropdownMenu.Trigger className="pointer-events-none absolute inset-0 -z-0 !outline-0" tabIndex={-1} />
        <SearchInput
          ref={searchInputRef}
          size={searchInputSize}
          searchValue={currentQuery}
          debounce={false} // all data is local, no need to debounce
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          autoFocus
        />
      </div>

      <DropdownMenu.Content
        className={cn('w-[800px]', contentClassName)}
        align="start"
        onOpenAutoFocus={event => event.preventDefault()}
        onCloseAutoFocus={event => event.preventDefault()}
        onInteractOutside={event => {
          // Prevent closing when clicking the search input
          if (searchInputRef.current?.contains(event.target as Node)) {
            event.preventDefault()
          }
        }}
      >
        {filteredFiles.length ? (
          filteredFiles?.map(({ value, element }, index) => {
            const { ref, onKeyDown } = getItemProps(index)
            return (
              <DropdownMenu.IconItem
                key={value}
                ref={ref}
                onKeyDown={onKeyDown}
                onSelect={() => {
                  navigateToFile(value)
                  setIsOpen(false)
                }}
                title={element}
                icon="empty-page"
              />
            )
          })
        ) : (
          <DropdownMenu.NoOptions className="!p-cn-xs">
            {t('component:searchFile.noFile', 'No file found.')}
          </DropdownMenu.NoOptions>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
