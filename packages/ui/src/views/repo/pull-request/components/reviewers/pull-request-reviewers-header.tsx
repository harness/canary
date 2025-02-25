import { Avatar, DropdownMenu, Icon, SearchBox } from '@/components'
import { PrincipalType } from '@/types'
import { TranslationStore } from '@/views'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/stringUtils'

import { PRReviewer } from '../../pull-request.types'

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
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-14 font-medium text-foreground-1">{t('views:pullRequests.reviewers')}</span>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="group flex h-6 items-center px-2">
          <Icon
            className="text-icons-1 transition-colors duration-200 group-hover:text-icons-2"
            name="vertical-ellipsis"
            size={12}
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-[280px] p-0" align="end">
          <div
            className="relative flex items-center justify-between border-b border-borders-1 px-3 py-2.5"
            role="presentation"
            onKeyDown={e => e.stopPropagation()}
          >
            <SearchBox.Root
              className="w-full"
              placeholder={t('views:pullRequests.searchUsers')}
              value={searchQuery}
              handleChange={handleSearchChange}
              showOnFocus
            />
          </div>

          <div className="p-1">
            {usersList?.length === 0 && (
              <div className="px-5 py-4 text-center">
                <span className="text-14 leading-tight text-foreground-2">{t('views:pullRequests.searchUsers')}</span>
              </div>
            )}
            <div className="max-h-[360px] overflow-y-auto">
              {usersList?.length === 1 && usersList[0].uid === currentUserId ? (
                <div className="px-5 py-4 text-center">
                  <span className="text-14 leading-tight text-foreground-2">{t('views:pullRequests.noUsers')}</span>
                </div>
              ) : (
                usersList?.map(({ display_name, id, uid }) => {
                  if (uid === currentUserId) return null
                  const isSelected = reviewers.find(reviewer => reviewer?.reviewer?.id === id)
                  return (
                    <DropdownMenu.Item
                      className={cn('py-2', {
                        'pl-7': !isSelected
                      })}
                      key={uid}
                      onClick={() => {
                        if (isSelected) {
                          handleDelete(id as number)
                        } else {
                          addReviewers?.(id)
                        }
                      }}
                    >
                      <div className="flex w-full min-w-0 items-center gap-x-2">
                        {isSelected && <Icon name="tick" size={12} className="shrink-0 text-icons-2" />}
                        <Avatar.Root>
                          <Avatar.Fallback>{getInitials(display_name || '')}</Avatar.Fallback>
                        </Avatar.Root>
                        <span className="truncate text-14 font-medium text-foreground-8">{display_name}</span>
                      </div>
                    </DropdownMenu.Item>
                  )
                })
              )}
            </div>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

export { ReviewersHeader }
