import { useRef } from 'react'

import { Button, DropdownMenu, IconV2, SearchInput, Text } from '@/components'
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
  isReviewersLoading?: boolean
}

const ReviewersHeader = ({
  usersList,
  reviewers,
  addReviewers,
  handleDelete,
  currentUserId,
  searchQuery,
  setSearchQuery,
  isReviewersLoading
}: ReviewersHeaderProps) => {
  const { t } = useTranslation()

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query)
  }

  const handleCloseValuesView = useRef(debounce(() => handleSearchQuery(''), 300)).current

  return (
    <div className="mb-0.5 flex items-center justify-between">
      <Text as="h5" variant="body-strong" color="foreground-1">
        {t('views:pullRequests.reviewers', 'Reviewers')}
      </Text>

      <DropdownMenu.Root onOpenChange={isOpen => !isOpen && handleCloseValuesView()}>
        <DropdownMenu.Trigger asChild>
          <Button iconOnly variant="ghost" size="sm">
            <IconV2 name="more-vert" size="2xs" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-80" align="end" sideOffset={-6} alignOffset={10}>
          <DropdownMenu.Header role="presentation" onKeyDown={e => e.stopPropagation()}>
            <SearchInput size="sm" autoFocus id="search" defaultValue={searchQuery} onChange={handleSearchQuery} />
          </DropdownMenu.Header>

          {isReviewersLoading && <DropdownMenu.Spinner />}

          {!usersList?.length && !isReviewersLoading && (
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
