import React, { useCallback, useMemo, useState } from 'react'

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

interface SearchFilesProps {
  navigateToFile: (file: string) => void
  filesList: string[] | undefined
}

export const SearchFiles = ({ navigateToFile, filesList }: SearchFilesProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setQuery(value)
    setIsOpen(value !== '')
  }, [])

  const filteredFiles = useMemo(() => {
    return filesList?.filter(file => file.toLowerCase().includes(query.toLowerCase()))
  }, [query, filesList])

  const fileText = useCallback(
    (file: string) => {
      const lowerCaseFile = file.toLowerCase()
      const lowerCaseQuery = query.toLowerCase()
      const matchIndex = lowerCaseFile.indexOf(lowerCaseQuery)

      if (matchIndex === -1) {
        return <Text>{file}</Text>
      }

      const startText = file.slice(0, matchIndex)
      const matchedText = file.slice(matchIndex, matchIndex + query.length)
      const endText = file.slice(matchIndex + query.length)

      return (
        <Text>
          {startText && <span>{startText}</span>}
          {matchedText && <mark>{matchedText}</mark>}
          {endText && <span>{endText}</span>}
        </Text>
      )
    },
    [query]
  )

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverAnchor asChild>
        <div>
          <SearchBox.Root
            width="full"
            placeholder="Search files..."
            className="searchbox h-9"
            handleChange={handleInputChange}
            value={query}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="max-h-60 w-[600px] overflow-auto p-0"
        align="start"
        onOpenAutoFocus={event => {
          event.preventDefault()
        }}
      >
        <Command>
          <CommandList>
            <CommandEmpty>No file found.</CommandEmpty>
            <CommandGroup>
              {filteredFiles?.map((file: string, idx: number) => (
                <CommandItem
                  key={idx}
                  value={file}
                  onSelect={() => {
                    navigateToFile(file)
                    setIsOpen(false)
                  }}
                >
                  {fileText(file)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
