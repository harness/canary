import { useMemo, useRef } from 'react'

import {
  Button,
  DropdownMenu,
  IconV2,
  Layout,
  SearchInput,
  Text,
  useSearchableDropdownKeyboardNavigation
} from '@/components'
import { useTranslation } from '@/context'
import { PrincipalType } from '@/types'
import { PRReviewer } from '@/views'
import { debounce } from 'lodash-es'

import { ReviewerInfo } from './reviewer-info'

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

  const filteredUsersList = useMemo(() => {
    return usersList ? usersList.filter(user => user?.uid !== currentUserId) : []
  }, [currentUserId, usersList])

  const { searchInputRef, handleSearchKeyDown, getItemProps } = useSearchableDropdownKeyboardNavigation({
    itemsLength: filteredUsersList.length
  })

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query)
  }

  const handleCloseValuesView = useRef(debounce(() => handleSearchQuery(''), 300)).current

  return (
    <Layout.Flex align="center" justify="between">
      <Text as="h5" variant="body-strong" color="foreground-1">
        {t('views:pullRequests.reviewers', 'Reviewers')}
      </Text>

      <DropdownMenu.Root onOpenChange={isOpen => !isOpen && handleCloseValuesView()}>
        <DropdownMenu.Trigger asChild>
          <Button iconOnly variant="ghost" size="sm" tooltipProps={{ content: 'Manage reviewers' }}>
            <IconV2 name="more-vert" size="2xs" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-80" align="end" sideOffset={2}>
          <DropdownMenu.Header role="presentation">
            <SearchInput
              ref={searchInputRef}
              id="search"
              size="sm"
              defaultValue={searchQuery}
              onChange={handleSearchQuery}
              autoFocus
              onKeyDown={handleSearchKeyDown}
            />
          </DropdownMenu.Header>

          {!!isReviewersLoading && <DropdownMenu.Spinner />}

          {!filteredUsersList.length && !isReviewersLoading && (
            <DropdownMenu.NoOptions>{t('views:pullRequests.noUsers', 'No users found.')}</DropdownMenu.NoOptions>
          )}

          {filteredUsersList.map(({ display_name, email, id, uid }, index) => {
            const isSelected = reviewers.find(reviewer => reviewer?.reviewer?.id === id)
            const { ref, onKeyDown } = getItemProps(index)

            return (
              <DropdownMenu.AvatarItem
                ref={ref}
                name={display_name}
                title={<ReviewerInfo display_name={display_name || ''} email={email || ''} />}
                checkmark={!!isSelected}
                key={uid ?? index}
                onClick={() => (isSelected ? handleDelete(id as number) : addReviewers?.(id))}
                onKeyDown={onKeyDown}
              />
            )
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Layout.Flex>
  )
}

export { ReviewersHeader }
