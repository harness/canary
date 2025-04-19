import { useRef } from 'react'

import { Avatar, Button, DropdownMenu, Icon, ScrollArea, SearchBox } from '@/components'
import { useDebounceSearch } from '@/hooks'
import { PrincipalType } from '@/types'
import { PRReviewer, TranslationStore } from '@/views'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/stringUtils'
import { debounce } from 'lodash-es'

interface ReviewersHeaderProps {
  usersList?: PrincipalType[]
  reviewers: PRReviewer[]
  addReviewers?: (id?: number) => void
  handleDelete: (id: number) => void
  currentUserId?: string
  searchQuery: string
  setSearchQuery: (query: string) => void
  useTranslationStore: () => TranslationStore
}

const ReviewersHeader = ({
  usersList,
  reviewers,
  addReviewers,
  handleDelete,
  currentUserId,
  searchQuery,
  setSearchQuery,
  useTranslationStore
}: ReviewersHeaderProps) => {
  const { t } = useTranslationStore()

  const { search, handleSearchChange, handleResetSearch } = useDebounceSearch({
    handleChangeSearchValue: setSearchQuery,
    searchValue: searchQuery
  })

  const handleCloseValuesView = useRef(debounce(handleResetSearch, 300)).current

  return (
    <div className="mb-0.5 flex items-center justify-between">
      <h5 className="text-2 font-medium text-cn-foreground-1">{t('views:pullRequests.reviewers', 'Reviewers')}</h5>

      <DropdownMenu.Root onOpenChange={isOpen => !isOpen && handleCloseValuesView()}>
        <DropdownMenu.Trigger asChild>
          <Button
            className="text-icons-1 hover:text-icons-2 data-[state=open]:text-icons-2"
            size="xs_icon"
            variant="custom"
            aria-label="Open reviewers list"
          >
            <Icon name="vertical-ellipsis" size={12} />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-80" align="end" sideOffset={-6} alignOffset={10}>
          <div className="px-2 py-1.5" role="presentation" onKeyDown={e => e.stopPropagation()}>
            <SearchBox.Root
              className="w-full"
              placeholder={t('views:pullRequests.searchUsers', 'Search users')}
              value={search}
              handleChange={handleSearchChange}
              showOnFocus
            />
          </div>
          <DropdownMenu.Separator />

          {!usersList?.length && (
            <div className="px-5 py-4 text-center leading-tight text-cn-foreground-2">
              {t('views:pullRequests.noUsers', 'No users found.')}
            </div>
          )}
          {usersList?.length === 1 && usersList[0].uid === currentUserId ? (
            <div className="px-5 py-4 text-center leading-tight text-cn-foreground-2">
              {t('views:pullRequests.noUsers', 'No users found.')}
            </div>
          ) : (
            <ScrollArea viewportClassName="max-h-80">
              {usersList?.map(({ display_name, id, uid }) => {
                if (uid === currentUserId) return null

                const isSelected = reviewers.find(reviewer => reviewer?.reviewer?.id === id)

                return (
                  <DropdownMenu.Item
                    className={cn('py-2', {
                      'pl-7': !isSelected
                    })}
                    key={uid}
                    onClick={() => (isSelected ? handleDelete(id as number) : addReviewers?.(id))}
                  >
                    <div className="flex w-full min-w-0 items-center gap-x-2 pl-1">
                      {isSelected && <Icon name="tick" size={12} className="shrink-0 text-icons-2" />}
                      <Avatar.Root>
                        <Avatar.Fallback>{getInitials(display_name)}</Avatar.Fallback>
                      </Avatar.Root>
                      <span className="truncate text-2 font-medium text-cn-foreground-1">{display_name}</span>
                    </div>
                  </DropdownMenu.Item>
                )
              })}
            </ScrollArea>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

export { ReviewersHeader }
