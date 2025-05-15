import { ReactNode, useCallback, useState } from 'react'

import { Command, Popover, SearchInput, Text } from '@/components'
import { TranslationStore } from '@/views'

const markedFileClassName = 'w-full text-cn-foreground-1'

/**
 * Get marked file component with query
 * @param file
 * @param query
 * @param matchIndex
 */
const getMarkedFileElement = (file: string, query: string, matchIndex: number): ReactNode => {
  if (matchIndex === -1) {
    return <Text className={markedFileClassName}>{file}</Text>
  }

  const startText = file.slice(0, matchIndex)
  const matchedText = file.slice(matchIndex, matchIndex + query.length)
  const endText = file.slice(matchIndex + query.length)

  return (
    <Text className={markedFileClassName}>
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
  useTranslationStore: () => TranslationStore
}

export const SearchFiles = ({ navigateToFile, filesList, useTranslationStore }: SearchFilesProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredFiles, setFilteredFiles] = useState<FilteredFile[]>([])
  const { t } = useTranslationStore()

  const filterQuery = useCallback(
    (query: string) => {
      if (!filesList) {
        setFilteredFiles([])
        return
      }

      const lowerCaseQuery = query.toLowerCase()

      const filtered = filesList.reduce<FilteredFile[]>((acc, file) => {
        const lowerCaseFile = file.toLowerCase()
        const matchIndex = lowerCaseFile.indexOf(lowerCaseQuery)

        if (matchIndex > -1) {
          acc.push({
            file,
            element: getMarkedFileElement(file, lowerCaseQuery, matchIndex)
          })
        }

        return acc
      }, [])

      setFilteredFiles(filtered)
    },
    [filesList]
  )

  const handleInputChange = useCallback(
    (searchQuery: string) => {
      setIsOpen(searchQuery !== '')
      filterQuery(searchQuery)
    },
    [filterQuery]
  )

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Anchor asChild>
        <div>
          <SearchInput
            placeholder={t('component:searchFile.input', 'Search files...')}
            size="sm"
            onChange={handleInputChange}
          />
        </div>
      </Popover.Anchor>
      <Popover.Content
        className="w-[300px] p-0"
        align="start"
        onOpenAutoFocus={event => {
          event.preventDefault()
        }}
      >
        <Command.Root>
          <Command.List heightClassName="max-h-60">
            {filteredFiles.length ? (
              <Command.Group>
                {filteredFiles?.map(({ file, element }) => (
                  <Command.Item
                    key={file}
                    className="break-words"
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
