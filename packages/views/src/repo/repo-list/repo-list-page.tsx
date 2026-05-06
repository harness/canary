import { FC, useCallback, useMemo, useRef, useState } from 'react'

import { FilterGroup, FilterGroupRef } from '@harnessio/filters'
import { DataTable, IconV2, NoData, Page, PermissionIdentifier, ResourceType } from '@harnessio/ui/components'
import { useComponents, useRouterContext, useTranslation } from '@harnessio/ui/context'
import { useColumnFilter } from '@harnessio/ui/hooks'

import { ExtendedScope } from '../common'
import { COLUMN_OPTIONS, DEFAULT_VISIBLE_COLUMNS } from './constant'
import { getRepoListFilterOptions, REPO_SORT_OPTIONS } from './repo-filters'
import { RepoList } from './repo-list'
import { RepoListFilters, RepoListPageProps, RepoSortMethod } from './types'

const SandboxRepoListPage: FC<RepoListPageProps> = ({
  useRepoStore,
  isLoading,
  isError,
  errorMessage,
  queryFilterValues,
  searchQuery,
  setSearchQuery,
  setQueryPage,
  toCreateRepo,
  toImportRepo,
  toImportMultipleRepos,
  onFavoriteToggle,
  onCancelImport,
  onFilterChange,
  onSortChange,
  scope,
  onClickRepo,
  toUpstreamRepo
}) => {
  const { t } = useTranslation()
  const { RbacSplitButton } = useComponents()
  const { navigate } = useRouterContext()
  const [showScope, setShowScope] = useState(false)
  const filterRef = useRef<FilterGroupRef>(null)

  const { visibleColumns, toggleColumn, resetColumns } = useColumnFilter({
    storageKey: 'repo-list-visible-columns',
    columns: COLUMN_OPTIONS,
    defaultVisibleColumns: DEFAULT_VISIBLE_COLUMNS
  })

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query.length ? query : null)
      setQueryPage(1)
    },
    [setSearchQuery, setQueryPage]
  )

  const { repositories, totalItems, page, setPage, pageSize, setPageSize } = useRepoStore()

  const filterOptions = useMemo(
    () => getRepoListFilterOptions(t, scope, queryFilterValues),
    [t, scope, queryFilterValues]
  )

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery || filterOptions.some(filter => !filter.isDefaultValue)
  }, [page, searchQuery, filterOptions])

  if (isError) {
    return (
      <NoData
        textWrapperClassName="max-w-[350px]"
        imageName="no-data-error"
        title={t('views:noData.errorApiTitle', 'Failed to load', { type: 'repositories' })}
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
          onClick: () => navigate(0)
        }}
      />
    )
  }

  const handleResetFiltersQueryAndPages = () => {
    filterRef.current?.resetSearch?.()
    filterRef.current?.resetFilters?.()
    setSearchQuery(null)
    setPage(1)
  }

  const onFilterValueChange = (filterValues: RepoListFilters) => {
    onFilterChange(filterValues)
    setShowScope([ExtendedScope.All, ExtendedScope.OrgProg].includes(filterValues.recursive?.value as ExtendedScope))
  }

  if (!repositories?.length && !isDirtyList && !isLoading) {
    return (
      <Page.Root>
        <Page.Content>
          <NoData
            withBorder
            imageName="no-repository"
            title={t('views:noData.noRepos', 'No repositories yet')}
            description={[
              t('views:noData.noReposProject', 'There are no repositories in this project yet.'),
              t('views:noData.createOrImportRepos', 'Create new or import an existing repository.')
            ]}
          >
            <RbacSplitButton<string>
              dropdownContentClassName="mt-0 min-w-[208px]"
              handleButtonClick={() => navigate(toCreateRepo?.() || '')}
              handleOptionChange={option => {
                if (option === 'new') navigate(toCreateRepo?.() || '')
                if (option === 'import') navigate(toImportRepo?.() || '')
                if (option === 'import-multiple') navigate(toImportMultipleRepos?.() || '')
              }}
              options={[
                { value: 'new', label: t('views:repos.createRepository', 'Create Repository') },
                { value: 'import', label: t('views:repos.importRepository', 'Import Repository') },
                { value: 'import-multiple', label: t('views:repos.importRepositories', 'Import Repositories') }
              ]}
              rbac={{
                resource: { resourceType: ResourceType.CODE_REPOSITORY },
                permissions: [PermissionIdentifier.CODE_REPO_CREATE]
              }}
            >
              <IconV2 name="plus" />
              {t('views:repos.createRepository', 'Create Repository')}
            </RbacSplitButton>
          </NoData>
        </Page.Content>
      </Page.Root>
    )
  }

  return (
    <Page.Root>
      <Page.HeaderV2
        breadcrumbs={[{ label: t('views:repos.repositories', 'Repositories') }]}
        title={t('views:repos.repositories', 'Repositories')}
        iconName="repository"
        actions={
          <RbacSplitButton<string>
            dropdownContentClassName="mt-0 min-w-[208px]"
            handleButtonClick={() => navigate(toCreateRepo?.() || '')}
            handleOptionChange={option => {
              if (option === 'new') navigate(toCreateRepo?.() || '')
              if (option === 'import') navigate(toImportRepo?.() || '')
              if (option === 'import-multiple') navigate(toImportMultipleRepos?.() || '')
            }}
            options={[
              { value: 'new', label: t('views:repos.createRepository', 'Create Repository') },
              { value: 'import', label: t('views:repos.importRepository', 'Import Repository') },
              { value: 'import-multiple', label: t('views:repos.importRepositories', 'Import Repositories') }
            ]}
            rbac={{
              resource: { resourceType: ResourceType.CODE_REPOSITORY },
              permissions: [PermissionIdentifier.CODE_REPO_CREATE]
            }}
          >
            <IconV2 name="plus" />
            {t('views:repos.createRepository', 'Create Repository')}
          </RbacSplitButton>
        }
      >
        <FilterGroup<RepoListFilters, keyof RepoListFilters>
          simpleSortConfig={{
            sortOptions: REPO_SORT_OPTIONS,
            defaultSort: RepoSortMethod.LastPush,
            onSortChange
          }}
          onFilterValueChange={onFilterValueChange}
          searchValue={searchQuery || ''}
          ref={filterRef}
          handleInputChange={handleSearch}
          headerAction={
            <DataTable.ColumnFilter
              columns={COLUMN_OPTIONS}
              visibleColumns={visibleColumns}
              onCheckedChange={toggleColumn}
              onReset={resetColumns}
            />
          }
          filterOptions={filterOptions}
        />
      </Page.HeaderV2>
      <Page.Content>
        <RepoList
          repositories={repositories ?? []}
          visibleColumns={visibleColumns}
          isLoading={isLoading}
          isDirtyList={isDirtyList}
          handleResetFiltersQueryAndPages={handleResetFiltersQueryAndPages}
          t={t}
          scope={scope}
          showScope={showScope}
          onFavoriteToggle={onFavoriteToggle}
          onCancelImport={onCancelImport}
          paginationProps={{
            totalItems,
            pageSize,
            onPageSizeChange: setPageSize,
            currentPage: page,
            goToPage: setPage
          }}
          onRowClick={
            onClickRepo
              ? repo => {
                  if (repo.importing) return
                  onClickRepo(repo)
                }
              : undefined
          }
          toUpstreamRepo={toUpstreamRepo}
        />
      </Page.Content>
    </Page.Root>
  )
}

export { ExtendedScope, SandboxRepoListPage }
