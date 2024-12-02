import { ChangeEvent, useCallback, useMemo, useState } from 'react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  Popover,
  PopoverAnchor,
  PopoverContent,
  SearchBox,
  Text
} from '@/components'
import { debounce } from 'lodash-es'

const markedFileClassName = 'w-full text-foreground-8'

/**
 * Get marked file component with query
 * @param file
 * @param query
 * @param matchIndex
 */
const getMarkedFileElement = (file: string, query: string, matchIndex: number) => {
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
  element: JSX.Element
}

interface SearchFilesProps {
  navigateToFile: (file: string) => void
  filesList?: string[]
}

export const SearchFiles = ({ navigateToFile, filesList }: SearchFilesProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [filteredFiles, setFilteredFiles] = useState<FilteredFile[]>([])

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
          <SearchBox.Root width="full" placeholder="Search files..." handleChange={handleInputChange} value={query} />
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="w-[300px] p-0"
        align="start"
        onOpenAutoFocus={event => {
          event.preventDefault()
        }}
      >
        <Command>
          <CommandList heightClassName="max-h-60">
            <CommandEmpty>No file found.</CommandEmpty>
            {!!filteredFiles.length && (
              <CommandGroup>
                {filteredFiles?.map(({ file, element }) => (
                  <CommandItem
                    key={file}
                    className="break-words"
                    value={file}
                    onSelect={() => {
                      navigateToFile(file)
                      setIsOpen(false)
                    }}
                  >
                    {element}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
