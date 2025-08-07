import { ReactNode, useCallback, useEffect, useState } from 'react'

import { Command, Popover, SearchInput, SearchInputProps, Text } from '@/components'
import { useTranslation } from '@/context'
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
  searchInputSize = 'sm',
  inputContainerClassName,
  contentClassName
}: SearchFilesProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredFiles, setFilteredFiles] = useState<FilteredFile[]>([])
  const [currentQuery, setCurrentQuery] = useState('')
  const { t } = useTranslation()

  useEffect(() => {
    if (!filesList || !currentQuery) {
      setFilteredFiles([])
      return
    }

    const lowerCaseQuery = currentQuery.toLowerCase()
    const filteredFiles: FilteredFile[] = []

    for (const file of filesList) {
      const lowerCaseFile = file.toLowerCase()
      const matchIndex = lowerCaseFile.indexOf(lowerCaseQuery)

      if (matchIndex > -1) {
        filteredFiles.push({
          file,
          element: getMarkedFileElement(file, lowerCaseQuery, matchIndex)
        })
      }

      // Limiting the result to 50, refactor this once backend supports pagination
      if (filteredFiles.length === MAX_FILES) {
        break
      }
    }

    setFilteredFiles(filteredFiles)
  }, [filesList, currentQuery])

  const handleInputChange = useCallback((searchQuery: string) => {
    setIsOpen(searchQuery !== '')
    setCurrentQuery(searchQuery)
  }, [])

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Anchor asChild>
        <div className={inputContainerClassName}>
          <SearchInput size={searchInputSize} onChange={handleInputChange} />
        </div>
      </Popover.Anchor>
      <Popover.Content
        align="start"
        hideArrow
        onOpenAutoFocus={event => {
          event.preventDefault()
        }}
        className={cn('!p-1', 'width-popover-max-width', contentClassName)}
      >
        <Command.Root className="bg-transparent">
          <Command.List
            scrollAreaProps={{ className: 'max-h-96', classNameContent: 'overflow-hidden [&>[cmdk-group]]:!p-0' }}
          >
            {filteredFiles.length ? (
              <Command.Group>
                {filteredFiles?.map(({ file, element }) => (
                  <Command.Item
                    key={file}
                    className="!cn-dropdown-menu-item"
                    value={file}
                    onSelect={() => {
                      navigateToFile(file)
                      setIsOpen(false)
                    }}
                  >
                    {element}
                  </Command.Item>
                ))}
              </Command.Group>
            ) : (
              <Command.Empty>{t('component:searchFile.noFile', 'No file found.')}</Command.Empty>
            )}
          </Command.List>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
  )
}
