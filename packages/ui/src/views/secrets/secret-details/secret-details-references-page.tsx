import { FC, useCallback, useMemo } from 'react'

import { IconV2, Layout, ListActions, NoData, Pagination, SearchInput } from '@/components'
import { useRouterContext, useTranslation } from '@/context'

import { SecretReferencesList } from './secret-details-references-list'
import { SecretReference } from './types'

interface SecretsReferencePageProps {
  searchQuery: string
  setSearchQuery: (query: string | undefined) => void
  isError: boolean
  errorMessage: string
  currentPage: number
  totalItems: number
  pageSize: number
  goToPage: (page: number) => void
  isLoading: boolean
  secretReferences: SecretReference[]
}

const SecretReferencesPage: FC<SecretsReferencePageProps> = ({
  searchQuery,
  setSearchQuery,
  isError,
  errorMessage,
  currentPage,
  totalItems,
  pageSize,
  goToPage,
  isLoading,
  secretReferences
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
    return !isLoading && !!secretReferences.length
  }, [isLoading, secretReferences])

  if (isError) {
    return (
      <NoData
        textWrapperClassName="max-w-[350px]"
        imageName="no-data-error"
        title={t('views:noData.errorApiTitle', 'Failed to load', {
          type: 'secret references'
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

  if (!secretReferences.length && !isLoading && !isDirtyList) {
    return (
      <NoData
        withBorder
        imageName="no-data-cog"
        title={t('views:noData.noSecretReferences', 'No secret references yet')}
        description={[t('views:noData.noSecretReferencesDescription', 'There are no references to this secret yet.')]}
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
              placeholder={t('views:secrets.search.placeholder', 'Search')}
              inputContainerClassName="max-w-80"
              onChange={handleSearchChange}
              autoFocus
            />
          </ListActions.Left>
        </ListActions.Root>
      </Layout.Grid>
      <SecretReferencesList
        secretReferences={secretReferences}
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

export { SecretReferencesPage }
