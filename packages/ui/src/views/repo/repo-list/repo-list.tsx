import { useMemo } from 'react'
import { DataTable, NoData, Skeleton } from '@/components'
import { getRepoListColumns } from './repo-list-columns'
import { RepoListProps } from './types'



export function RepoList({
    repositories,
    visibleColumns,
    currentSorting,
    onSortingChange,
    paginationProps,
    isLoading,
    isDirtyList,
    handleResetFiltersQueryAndPages,
    onRowClick,
    t,
    scope,
    showScope = false,
    onFavoriteToggle,
    onCancelImport,
    toUpstreamRepo
}: RepoListProps) {
    const columns = useMemo(
        () =>
            getRepoListColumns({
                t,
                scope,
                showScope,
                onFavoriteToggle,
                onCancelImport,
                toUpstreamRepo
            }),
        [t, scope, showScope, onFavoriteToggle, onCancelImport, toUpstreamRepo]
    )

    if (isLoading) {
        return <Skeleton.Table countRows={10} countColumns={5} />
    }

    if (!repositories?.length && isDirtyList) {
        return (
            <NoData
                withBorder
                imageName="no-search-magnifying-glass"
                title={t('views:noData.noResults', 'No search results')}
                description={[
                    t('views:noData.noRepoResults', 'No repositories match your search or filter criteria.'),
                    t('views:noData.adjustFilters', 'Try adjusting your filters or clearing them to see all repositories.')
                ]}
                secondaryButton={{
                    icon: 'trash',
                    label: t('views:noData.clearFilters', 'Clear filters'),
                    onClick: handleResetFiltersQueryAndPages
                }}
            />
        )
    }

    if (!repositories?.length) {
        return null
    }

    return (
        <DataTable
            data={repositories}
            columns={columns}
            visibleColumns={visibleColumns}
            paginationProps={paginationProps}
            currentSorting={currentSorting}
            onSortingChange={onSortingChange}
            onRowClick={onRowClick ? (repo) => onRowClick(repo) : undefined}
        />
    )
}