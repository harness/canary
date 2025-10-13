import { FC, useCallback, useMemo } from 'react'

import { IconV2, Layout, ListActions, NoData, Pagination, SearchInput } from '@/components'
import { useRouterContext, useTranslation } from '@/context'

import { SecretActivityList } from './secret-details-activity-list'
import { SecretActivity } from './types'

interface SecretActivityPageProps {
  searchQuery: string
  setSearchQuery: (query: string | undefined) => void
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

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query.length ? query : undefined)
      goToPage(1)
    },
    [goToPage, setSearchQuery]
  )

  const isDirtyList = useMemo(() => {
    return currentPage !== 1 || !!searchQuery.length
  }, [currentPage, searchQuery])

  const isShowPagination = useMemo(() => {
    return !isLoading && !!secretActivity.length
  }, [isLoading, secretActivity])

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

  if (!secretActivity.length && !isLoading && !isDirtyList) {
    return (
      <NoData
        withBorder
        imageName="no-data-cog"
        title={t('views:noData.noActivity', 'No secret activity yet')}
        description={[t('views:noData.noSecretActivity', 'There is no secret activity yet.')]}
      />
    )
  }

  return (
    <>
      <Layout.Grid gapY="md" className="mb-cn-sm">
        <ListActions.Root>
          <ListActions.Left>
            <SearchInput
              defaultValue={searchQuery}
              placeholder={t('views:repos.search', 'Search')}
              inputContainerClassName="max-w-80"
              onChange={handleSearchChange}
              autoFocus
            />
          </ListActions.Left>
        </ListActions.Root>
      </Layout.Grid>
      <SecretActivityList
        secretActivity={secretActivity}
        isLoading={isLoading}
        isDirtyList={isDirtyList}
        handleResetFiltersQueryAndPages={() => handleSearchChange('')}
      />
      {isShowPagination && (
        <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={currentPage} goToPage={goToPage} />
      )}
    </>
  )
}

export { SecretActivityPage }
