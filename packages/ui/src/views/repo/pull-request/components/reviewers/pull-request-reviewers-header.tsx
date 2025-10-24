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
import { EnumBypassListType, NormalizedPrincipal, PRReviewer } from '@/views'
import { getIcon } from '@views/repo/utils'
import { debounce } from 'lodash-es'

import { ReviewerInfo } from './reviewer-info'

interface ReviewersHeaderProps {
  usersList?: NormalizedPrincipal[]
  reviewers: PRReviewer[]
  userGroupReviewers: PRReviewer[]
  addReviewer?: (id?: number) => void
  addUserGroupReviewer?: (id?: number) => void
  handleDelete?: (id: number) => void
  handleUserGroupReviewerDelete?: (id: number) => void
  authorId?: number
  searchQuery: string
  setSearchQuery: (query: string) => void
  isReviewersLoading?: boolean
}

const ReviewersHeader = ({
  usersList,
  reviewers,
  userGroupReviewers,
  addReviewer,
  addUserGroupReviewer,
  handleDelete,
  handleUserGroupReviewerDelete,
  authorId,
  searchQuery,
  setSearchQuery,
  isReviewersLoading
}: ReviewersHeaderProps) => {
  const { t } = useTranslation()

  const filteredUsersList = useMemo(() => {
    return usersList ? usersList.filter(user => user?.id !== authorId) : []
  }, [authorId, usersList])

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
          <Button iconOnly variant="ghost" size="sm" tooltipProps={{ content: 'Manage reviewers', align: 'end' }}>
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

          {filteredUsersList.map(({ display_name, email_or_identifier, id, type }, index) => {
            const isSelected = [...reviewers, ...userGroupReviewers].find(reviewer => reviewer?.reviewer?.id === id)
            const { ref, onKeyDown } = getItemProps(index)
            const commonProps = {
              ref,
              title: <ReviewerInfo display_name={display_name || ''} email={email_or_identifier || ''} />,
              checkmark: !!isSelected,
              key: `${type}-${id}`,
              onKeyDown
            }

            return type === EnumBypassListType.USER_GROUP ? (
              <DropdownMenu.IconItem
                {...commonProps}
                icon={getIcon(type)}
                iconSize={'lg'}
                iconClassName={'ml-cn-4xs'}
                onClick={() => (isSelected ? handleUserGroupReviewerDelete?.(id) : addUserGroupReviewer?.(id))}
              />
            ) : (
              <DropdownMenu.AvatarItem
                {...commonProps}
                name={display_name}
                onClick={() => (isSelected ? handleDelete?.(id) : addReviewer?.(id))}
              />
            )
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Layout.Flex>
  )
}

export { ReviewersHeader }
