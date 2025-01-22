import { ChangeEvent, ReactNode, useCallback, useMemo, useState } from 'react'

import { Command, Popover, PopoverAnchor, PopoverContent, SearchBox, Text } from '@/components'
import { TranslationStore } from '@/views'
import { debounce } from 'lodash-es'

const markedFileClassName = 'w-full text-foreground-8'

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
  const [query, setQuery] = useState('')
  const [filteredFiles, setFilteredFiles] = useState<FilteredFile[]>([])
  const { t } = useTranslationStore()

  /**
   * Debounced function for filtering files
   */
  const debouncedFilter = useMemo(
    () =>
      debounce((query: string) => {
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
              element: getMarkedFileElement(lowerCaseFile, lowerCaseQuery, matchIndex)
            })
          }

          return acc
        }, [])

        setFilteredFiles(filtered)
      }, 300),
    [filesList]
  )

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setQuery(value)
      setIsOpen(value !== '')
      debouncedFilter(value)
    },
    [debouncedFilter]
  )

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverAnchor asChild>
        <div>
          <SearchBox.Root
            width="full"
            placeholder={t('component:searchFile.input', 'Search files...')}
            handleChange={handleInputChange}
            value={query}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="w-[300px] p-0"
        align="start"
        onOpenAutoFocus={event => {
          event.preventDefault()
        }}
      >
        <Command.Root>
          <Command.List heightClassName="max-h-60">
            <Command.Empty>{t('component:searchFile.noFile', 'No file found.')}</Command.Empty>
            {!!filteredFiles.length && (
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
            )}
          </Command.List>
        </Command.Root>
      </PopoverContent>
    </Popover>
  )
}
