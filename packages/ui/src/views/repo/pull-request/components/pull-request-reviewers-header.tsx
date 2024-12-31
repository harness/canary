import { useState } from 'react'

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text
} from '@components/index'

interface ReviewersHeaderProps {
  usersList?: { display_name?: string; id?: number; uid?: string }[]
  addReviewers?: (id?: number) => void
  currentUserId?: string
}

const ReviewersHeader = ({ usersList, addReviewers, currentUserId }: ReviewersHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <Text size={2} weight="medium">
        Reviewers
      </Text>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button size="sm" variant="ghost" className="px-2 py-1 text-tertiary-background">
            <Icon name="vertical-ellipsis" size={12} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput className="focus-visible:ring-1" placeholder="Search users..." />
            <CommandList>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup>
                {usersList?.map(({ display_name, id, uid }, idx: number) => {
                  if (uid === currentUserId) return null
                  return (
                    <CommandItem
                      key={idx}
                      value={uid}
                      onSelect={() => {
                        if (display_name) {
                          addReviewers?.(id)
                          setIsOpen(false)
                        }
                      }}
                    >
                      {display_name}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { ReviewersHeader }
