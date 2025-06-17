import { useRef } from 'react'

import { Button, DropdownMenu, IconV2, SearchInput } from '@/components'
import { useTranslation } from '@/context'
import { PrincipalType } from '@/types'
import { PRReviewer } from '@/views'
import { debounce } from 'lodash-es'

interface ReviewersHeaderProps {
  usersList?: PrincipalType[]
  reviewers: PRReviewer[]
  addReviewers?: (id?: number) => void
  handleDelete: (id: number) => void
  currentUserId?: string
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const ReviewersHeader = ({
  usersList,
  reviewers,
  addReviewers,
  handleDelete,
  currentUserId,
  searchQuery,
  setSearchQuery
}: ReviewersHeaderProps) => {
  const { t } = useTranslation()

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query)
  }

  const handleCloseValuesView = useRef(debounce(() => handleSearchQuery(''), 300)).current

  return (
    <div className="mb-0.5 flex items-center justify-between">
      <h5 className="text-2 font-medium text-cn-foreground-1">{t('views:pullRequests.reviewers', 'Reviewers')}</h5>

      <DropdownMenu.Root onOpenChange={isOpen => !isOpen && handleCloseValuesView()}>
        <DropdownMenu.Trigger asChild>
          <Button iconOnly variant="ghost" size="sm">
            <IconV2 name="more-vert" size="xs" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-80" align="end" sideOffset={-6} alignOffset={10}>
          <DropdownMenu.Header role="presentation" onKeyDown={e => e.stopPropagation()}>
            <SearchInput
              size="sm"
              autoFocus
              id="search"
              defaultValue={searchQuery}
              placeholder={t('views:pullRequests.searchUsers', 'Search users')}
              onChange={handleSearchQuery}
            />
          </DropdownMenu.Header>

          {!usersList?.length && (
            <DropdownMenu.NoOptions>{t('views:pullRequests.noUsers', 'No users found.')}</DropdownMenu.NoOptions>
          )}
          {usersList?.length === 1 && usersList[0].uid === currentUserId ? (
            <DropdownMenu.NoOptions>{t('views:pullRequests.noUsers', 'No users found.')}</DropdownMenu.NoOptions>
          ) : (
            <>
              {usersList?.map(({ display_name, id, uid }) => {
                if (uid === currentUserId) return null

                const isSelected = reviewers.find(reviewer => reviewer?.reviewer?.id === id)

                return (
                  <DropdownMenu.AvatarItem
                    name={display_name}
                    title={display_name}
                    checkmark={!!isSelected}
                    key={uid}
                    onClick={() => (isSelected ? handleDelete(id as number) : addReviewers?.(id))}
                  />
                )
              })}
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

export { ReviewersHeader }
