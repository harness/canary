import { TranslationStore } from '@/views'
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  SearchBox,
  Text
} from '@components/index'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/stringUtils'

import { PRReviewer, PRReviewUsers } from '../pull-request.types'

interface ReviewersHeaderProps {
  usersList?: PRReviewUsers[]
  reviewers: PRReviewer[]
  addReviewers?: (id?: number) => void
  currentUserId?: string
  searchQuery: string
  setSearchQuery: (query: string) => void
  useTranslationStore: () => TranslationStore
}

const ReviewersHeader = ({
  usersList,
  reviewers,
  addReviewers,
  currentUserId,
  searchQuery,
  setSearchQuery,
  useTranslationStore
}: ReviewersHeaderProps) => {
  const { t } = useTranslationStore()
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  return (
    <div className="flex items-center justify-between">
      <Text size={2} weight="medium">
        {t('views:pullRequests.reviewers')}
      </Text>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" className="px-2 py-1 text-tertiary-background">
            <Icon name="vertical-ellipsis" size={12} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[298px] p-0" align="start">
          <div className="px-3 pt-2">
            <div role="presentation" onKeyDown={e => e.stopPropagation()}>
              <SearchBox.Root
                className="mt-2 w-full"
                placeholder={t('views:pullRequests.searchUsers')}
                value={searchQuery}
                handleChange={handleSearchChange}
                showOnFocus
              />
            </div>
            <div className="mt-1">
              {usersList?.length === 0 && (
                <div className="px-5 py-4 text-center">
                  <span className="text-14 leading-tight text-foreground-2">{t('views:pullRequests.searchUsers')}</span>
                </div>
              )}
              <div className="max-h-[360px] overflow-y-auto px-1">
                {usersList?.map(({ display_name, id, uid }) => {
                  if (uid === currentUserId) return null
                  const isSelected = reviewers.find(reviewer => reviewer?.reviewer?.id === id)
                  return (
                    <DropdownMenuItem
                      className={cn('hover:bg-background-4 cursor-pointer py-1', {
                        'bg-background-4': isSelected,
                        'pl-7': !isSelected
                      })}
                      key={uid}
                      onClick={() => {
                        if (display_name) {
                          addReviewers?.(id)
                        }
                      }}
                    >
                      <div className="flex w-full min-w-0 items-center gap-x-2">
                        {isSelected && <Icon name="tick" size={12} className="min-w-[12px] text-foreground-1" />}
                        <Avatar className="size-6 rounded-full">
                          <AvatarFallback>
                            <Text size={1} color="tertiaryBackground">
                              {getInitials(display_name || '')}
                            </Text>
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={cn('text-foreground-2 truncate', {
                            'text-foreground-1': isSelected
                          })}
                        >
                          {display_name}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  )
                })}
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export { ReviewersHeader }
