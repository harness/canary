import { FC } from 'react'

import { Button, ListActions, NoData, Pagination, SearchBox, Spacer } from '@/components'
import { useRouterContext } from '@/context'
import { useDebounceSearch } from '@/hooks'
import { SandboxLayout } from '@/views'
import { noop } from 'lodash-es'

import { ConnectorsList } from './connectors-list'
import { ConnectorListPageProps } from './types'

const ConnectorListPage: FC<ConnectorListPageProps> = ({
  searchQuery,
  setSearchQuery,
  isError,
  errorMessage,
  useTranslationStore,
  ...props
}) => {
  const { t } = useTranslationStore()
  const { navigate } = useRouterContext()

  const { search: searchInput, handleSearchChange: handleInputChange } = useDebounceSearch({
    handleChangeSearchValue: (val: string) => setSearchQuery(val.length ? val : null),
    searchValue: searchQuery || ''
  })

  const mockPageHeaders = { totalPages: 5, currentPage: 1, setPage: noop }

  if (isError) {
    return (
      <NoData
        textWrapperClassName="max-w-[350px]"
        iconName="no-data-error"
        title={t('views:noData.errorApiTitle', 'Failed to load', {
          type: 'connectors'
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

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <h1 className="text-24 text-foreground-1 font-medium leading-snug tracking-tight">Connectors</h1>
        <Spacer size={6} />
        <ListActions.Root>
          <ListActions.Left>
            <SearchBox.Root
              width="full"
              className="max-w-96"
              value={searchInput}
              handleChange={handleInputChange}
              placeholder={'Search'}
            />
          </ListActions.Left>
          <ListActions.Right>
            <Button variant="default">Create new Connector</Button>
          </ListActions.Right>
        </ListActions.Root>
        <Spacer size={4} />
        <ConnectorsList useTranslationStore={useTranslationStore} {...props} />
        <Spacer size={8} />
        <Pagination
          totalPages={mockPageHeaders.totalPages}
          currentPage={mockPageHeaders.currentPage}
          goToPage={mockPageHeaders.setPage}
          t={t}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { ConnectorListPage }
