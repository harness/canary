import { IconV2, NoData } from '@/components'
import { useTranslation } from '@/context'
import { useSearch } from '@/views/user-management/providers/search-provider'

export const NoSearchResults = () => {
  const { t } = useTranslation()

  const { handleResetSearch } = useSearch()

  return (
    <NoData
      withBorder
      textWrapperClassName="max-w-[350px]"
      imageName="no-search-magnifying-glass"
      title={t('views:noData.noResults', 'No search results')}
      description={[
        t('views:noData.noResultsDescription', 'No users match your search. Try adjusting your keywords or filters.', {
          type: 'users'
        })
      ]}
      secondaryButton={{
        label: (
          <>
            <IconV2 name="trash" />
            {t('views:noData.clearFilters', 'Clear Filters')}
          </>
        ),
        onClick: handleResetSearch
      }}
    />
  )
}
