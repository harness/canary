import { KeyboardEvent, useCallback, useRef } from 'react'

import { Button, DropdownMenu, IconV2, SearchInput, Text } from '@/components'
import { useTranslation } from '@/context'
import { PrincipalType } from '@/types'
import { afterFrames, getShadowActiveElement } from '@/utils'
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
  const contentRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query)
  }

  const getItems = useCallback(() => {
    if (!contentRef.current) return []
    return Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>('[data-radix-collection-item]:not([data-disabled])')
    )
  }, [])

  const focusItem = useCallback(() => {
    const items = getItems()
    items[0]?.focus()
  }, [getItems])

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      afterFrames(focusItem)
    }
  }

  const handleContentKeyDownCapture = (e: KeyboardEvent<HTMLDivElement>) => {
    const rootEl = contentRef.current
    if (!rootEl) return

    const { activeEl } = getShadowActiveElement(rootEl)
    const items = getItems()

    if (!items.length) return

    const first = items[0]
    const last = items[items.length - 1]

    if (
      (e.key === 'ArrowUp' && activeEl === first) ||
      (e.key === 'ArrowDown' && activeEl === last) ||
      e.key === 'Tab'
    ) {
      e.preventDefault()
      inputRef.current?.focus()
      return
    }
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
        <DropdownMenu.Content
          ref={contentRef}
          className="w-80"
          align="end"
          sideOffset={2}
          onKeyDownCapture={handleContentKeyDownCapture}
        >
          <DropdownMenu.Header role="presentation">
            <SearchInput
              ref={inputRef}
              id="search"
              size="sm"
              defaultValue={searchQuery}
              onChange={handleSearchQuery}
              autoFocus
              onKeyDown={handleInputKeyDown}
            />
          </DropdownMenu.Header>

          {isReviewersLoading && <DropdownMenu.Spinner />}

          {!usersList?.length && !isReviewersLoading && (
            <DropdownMenu.NoOptions>{t('views:pullRequests.noUsers', 'No users found.')}</DropdownMenu.NoOptions>
          )}
          {usersList?.length === 1 && usersList[0].uid === currentUserId ? (
            <DropdownMenu.NoOptions>{t('views:pullRequests.noUsers', 'No users found.')}</DropdownMenu.NoOptions>
          ) : (
            <>
              {usersList?.map(({ display_name, email, id, uid }) => {
                if (uid === currentUserId) return null

                const isSelected = reviewers.find(reviewer => reviewer?.reviewer?.id === id)

                return (
                  <DropdownMenu.AvatarItem
                    name={display_name}
                    title={<ReviewerInfo display_name={display_name || ''} email={email || ''} />}
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
