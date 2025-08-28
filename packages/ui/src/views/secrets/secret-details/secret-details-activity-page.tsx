import { FC } from 'react'

import { IconV2, ListActions, NoData, Pagination, SearchBox, Spacer } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { useDebounceSearch } from '@/hooks'
import { cn } from '@utils/cn'
import { SandboxLayout } from '@views/layouts/SandboxLayout'

import { SecretActivityList } from './secret-details-activity-list'
import { SecretActivity } from './types'

interface SecretActivityPageProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  isError: boolean
  errorMessage: string
  currentPage: number
  totalItems: number
  pageSize: number
  goToPage: (page: number) => void
  isLoading: boolean
  secretActivity: SecretActivity[]
}

const SecretActivityPage: FC<SecretActivityPageProps> = ({
  searchQuery,
  setSearchQuery,
  isError,
  errorMessage,
  currentPage,
  totalItems,
  pageSize,
  goToPage,
  isLoading,
  secretActivity
}) => {
  const { t } = useTranslation()
  const { navigate } = useRouterContext()

  const { search: searchInput, handleSearchChange: handleInputChange } = useDebounceSearch({
    handleChangeSearchValue: setSearchQuery,
    searchValue: searchQuery || ''
  })

  if (isError) {
    return (
      <NoData
        textWrapperClassName="max-w-[350px]"
        imageName="no-data-error"
        title={t('views:noData.errorApiTitle', 'Failed to load', {
          type: 'secret activity'
        })}
        description={[
          errorMessage ||
            t(
              'views:noData.errorApiDescription',
              'An error occurred while loading the data. Please try again and reload the page.'
            )
        ]}
        primaryButton={{
          label: (
            <>
              <IconV2 name="refresh" />
              {t('views:notFound.button', 'Reload Page')}
            </>
          ),
          onClick: () => {
            navigate(0) // Reload the page
          }
        }}
      />
    )
  }

  return (
    <SandboxLayout.Content className={cn({ 'h-full': !isLoading && !secretActivity.length && !searchQuery }, 'px-0')}>
      <ListActions.Root className="mb-1">
        <ListActions.Left>
          <SearchBox.Root
            width="full"
            className="max-w-80"
            value={searchInput}
            handleChange={handleInputChange}
            placeholder={t('views:search', 'Search')}
          />
        </ListActions.Left>
      </ListActions.Root>
      <Spacer size={4} />
      <SecretActivityList secretActivity={secretActivity} isLoading={isLoading} />
      <Spacer size={8} />
      <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={currentPage} goToPage={goToPage} />
    </SandboxLayout.Content>
  )
}

export { SecretActivityPage }
