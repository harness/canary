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

const markedFileClassName = 'w-full text-cn-1'
const MAX_FILES = 50

export interface FileItem {
  label: string
  value: string
}

/**
 * Get marked file component with query
 * @param text - The text to display (label)
 * @param query - The search query
 * @param matchIndex - The index where the match starts
 */
const getMarkedFileElement = (text: string, query: string, matchIndex: number): ReactNode => {
  if (matchIndex === -1) {
    return (
      <Text className={markedFileClassName} truncate>
        {text}
      </Text>
    )
  }

  const startText = text.slice(0, matchIndex)
  const matchedText = text.slice(matchIndex, matchIndex + query.length)
  const endText = text.slice(matchIndex + query.length)

  return (
    <Text className={cn(markedFileClassName, 'break-words')}>
      {startText && <span>{startText}</span>}
      {matchedText && <mark>{matchedText}</mark>}
      {endText && <span>{endText}</span>}
    </Text>
  )
}

interface FilteredFile {
  label: string
  value: string
  element: ReactNode
}

interface SearchFilesProps {
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

  useEffect(() => {
    if (!filesList || !currentQuery) {
      setFilteredFiles([])
      return
    }

    const lowerCaseQuery = currentQuery.toLowerCase()
    const _filteredFiles: FilteredFile[] = []

    for (const item of filesList) {
      const { label, value } = normalizeFileItem(item)
      const lowerCaseLabel = label.toLowerCase()
      const matchIndex = lowerCaseLabel.indexOf(lowerCaseQuery)

      if (matchIndex > -1) {
        _filteredFiles.push({
          label,
          value,
          element: getMarkedFileElement(label, lowerCaseQuery, matchIndex)
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

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <div className={cn('relative', inputContainerClassName)}>
        <DropdownMenu.Trigger className="pointer-events-none absolute inset-0 -z-0 !outline-0" tabIndex={-1} />
        <SearchInput
          ref={searchInputRef}
          size={searchInputSize}
          onChange={handleInputChange}
          onKeyDown={handleSearchKeyDown}
          autoFocus
        />
      </div>

      <DropdownMenu.Content
        className={cn('w-[800px]', contentClassName)}
        align="start"
        onOpenAutoFocus={event => event.preventDefault()}
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
