import { FC, useCallback, useMemo } from 'react'

import { ListActions, NoData, Pagination, SearchInput, Spacer, SplitButton, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { SandboxLayout } from '@/views'

import { RepoList } from './repo-list'
import { RepoListProps } from './types'

const SandboxRepoListPage: FC<RepoListProps> = ({
  useRepoStore,
  isLoading,
  isError,
  errorMessage,
  searchQuery,
  setSearchQuery,
  setQueryPage,
  toCreateRepo,
  toImportRepo,
  toImportMultipleRepos,
  ...routingProps
}) => {
  const { t } = useTranslation()
  const { navigate } = useRouterContext()

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query.length ? query : null)
      setQueryPage(1)
    },
    [setSearchQuery, setQueryPage]
  )

  // State for storing saved filters and sorts
  // null means no saved state exists
  const { repositories, totalItems, page, setPage, pageSize } = useRepoStore()

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery
  }, [page, searchQuery])

  if (isError) {
    return (
      <NoData
        textWrapperClassName="max-w-[350px]"
        imageName="no-data-error"
        title={t('views:noData.errorApiTitle', 'Failed to load', {
          type: 'repositories'
        })}
        description={[
          errorMessage ||
            t(
              'views:noData.errorApiDescription',
              'An error occurred while loading the data. Please try again and reload the page.'
            )
        ]}
        primaryButton={{
          label: t('views:notFound.button', 'Reload page'),
          onClick: () => {
            navigate(0) // Reload the page
          }
        }}
      />
    )
  }

  const noData = !(repositories && !!repositories.length)
  const showTopBar = !noData || !!searchQuery?.length || page !== 1

  const handleResetFiltersQueryAndPages = () => {
    handleSearch('')
    setPage(1)
  }

  // return null

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        {showTopBar && (
          <>
            <Spacer size={8} />
            <div className="flex items-end">
              <Text variant="heading-section" as="h1" color="foreground-1">
                {t('views:repos.repositories', 'Repositories')}
              </Text>
            </div>
            <Spacer size={6} />
            <ListActions.Root>
              <ListActions.Left>
                <SearchInput
                  inputContainerClassName="max-w-96"
                  defaultValue={searchQuery || ''}
                  placeholder={t('views:repos.search', 'Search')}
                  size="sm"
                  onChange={handleSearch}
                />
              </ListActions.Left>
              <ListActions.Right>
                <SplitButton<string>
                  dropdownContentClassName="mt-0 min-w-[170px]"
                  handleButtonClick={() => navigate(toCreateRepo?.() || '')}
                  handleOptionChange={option => {
                    if (option === 'import') {
                      navigate(toImportRepo?.() || '')
                    } else if (option === 'import-multiple') {
                      navigate(toImportMultipleRepos?.() || '')
                    }
                  }}
                  options={[
                    {
                      value: 'import',
                      label: t('views:repos.import-repository', 'Import Repository')
                    },
                    {
                      value: 'import-multiple',
                      label: t('views:repos.import-repositories', 'Import Repositories')
                    }
                  ]}
                >
                  {t('views:repos.create-repository', 'Create Repository')}
                </SplitButton>
              </ListActions.Right>
            </ListActions.Root>
          </>
        )}
        <Spacer size={5} />
        <RepoList
          repos={repositories || []}
          handleResetFiltersQueryAndPages={handleResetFiltersQueryAndPages}
          isDirtyList={isDirtyList}
          isLoading={isLoading}
          toCreateRepo={toCreateRepo}
          toImportRepo={toImportRepo}
          {...routingProps}
        />
        {!!repositories?.length && (
          <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={page} goToPage={setPage} />
        )}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SandboxRepoListPage }
