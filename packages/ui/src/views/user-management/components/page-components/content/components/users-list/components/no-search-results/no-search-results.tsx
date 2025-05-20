import { NoData } from '@/components'
import { useTranslation } from '@/context'
import { useSearch } from '@/views/user-management/providers/search-provider'

export const NoSearchResults = () => {
  const { t } = useTranslation()

  const { handleResetSearch } = useSearch()

  return (
    <NoData
      withBorder
      textWrapperClassName="max-w-[350px]"
      iconName="no-search-magnifying-glass"
      title={t('views:noData.noResults', 'No search results')}
      description={[
        t('views:noData.noResultsDescription', 'No users match your search. Try adjusting your keywords or filters.', {
          type: 'users'
        })
      ]}
      primaryButton={{
        label: t('views:noData.clearFilters', 'Clear filters'),
        onClick: handleResetSearch
      }}
    />
  )
}
