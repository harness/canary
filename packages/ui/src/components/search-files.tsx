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

interface SearchFilesProps {
  navigateToFile: (file: string) => void
  filesList?: string[]
}

export const SearchFiles = ({ navigateToFile, filesList }: SearchFilesProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setQuery(value)
    setIsOpen(value !== '')
  }, [])

  const filteredFiles = useMemo(() => {
    if (!filesList) return [] as string[]

    return filesList.filter(file => file.toLowerCase().includes(query.toLowerCase()))
  }, [query, filesList])

  const fileText = useCallback(
    (file: string) => {
      const lowerCaseFile = file.toLowerCase()
      const lowerCaseQuery = query.toLowerCase()
      const matchIndex = lowerCaseFile.indexOf(lowerCaseQuery)
      const classes = 'w-full text-foreground-8'

      if (matchIndex === -1) {
        return <Text className={classes}>{file}</Text>
      }

      const startText = file.slice(0, matchIndex)
      const matchedText = file.slice(matchIndex, matchIndex + query.length)
      const endText = file.slice(matchIndex + query.length)

      return (
        <Text className={classes}>
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
            {filteredFiles && !!filteredFiles.length && (
              <CommandGroup>
                {filteredFiles?.map((file: string, idx: number) => (
                  <CommandItem
                    key={idx}
                    className="break-words"
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
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
