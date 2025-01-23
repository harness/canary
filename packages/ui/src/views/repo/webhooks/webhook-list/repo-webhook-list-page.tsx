import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button, ListActions, SearchBox, SkeletonList, Spacer } from '@/components'
import { useDebounceSearch } from '@/hooks'
import { SandboxLayout } from '@/views'

// import { useCommonFilter } from '@hooks/use-common-filter'

import { RepoWebhookList } from './components/repo-webhook-list'
import { RepoWebhookListPageProps } from './types'

const RepoWebhookListPage: FC<RepoWebhookListPageProps> = ({
  useWebhookStore,
  useTranslationStore,
  openDeleteWebhookDialog,
  searchQuery,
  setSearchQuery,
  webhookLoading
}) => {
  const { t } = useTranslationStore()
  const { webhooks, totalPages, page, setPage, error } = useWebhookStore()

  // const { query, handleSearch } = useCommonFilter()
  const {
    search: searchInput,
    handleSearchChange: handleInputChange,
    handleResetSearch
  } = useDebounceSearch({
    handleChangeSearchValue: (val: string) => setSearchQuery(val.length ? val : null),
    searchValue: searchQuery || ''
  })

  // const [value, setValue] = useState('')

  // useEffect(() => {
  //   setValue(query || '')
  // }, [query])

  // const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setValue(e?.target?.value ?? '')
  //   handleSearch(e)
  // }

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery
  }, [page, searchQuery])

  const handleResetFiltersQueryAndPages = () => {
    // setValue('')
    // handleSearch({ target: { value: '' } } as ChangeEvent<HTMLInputElement>)
    handleResetSearch()
    setPage(1)
  }

  return (
    <SandboxLayout.Content className="px-0">
      <h1 className="text-2xl font-medium text-foreground-1">Webhooks</h1>
      <Spacer size={6} />

      {error ? (
        <span className="text-xs text-destructive">{error || 'Something went wrong'}</span>
      ) : (
        <>
          {(!!webhooks?.length || (!webhooks?.length && isDirtyList)) && (
            <>
              <ListActions.Root>
                <ListActions.Left>
                  <SearchBox.Root
                    width="full"
                    className="max-w-96"
                    value={searchInput || ''}
                    handleChange={handleInputChange}
                    placeholder={t('views:repos.search', 'Search')}
                  />
                </ListActions.Left>
                <ListActions.Right>
                  <Button asChild>
                    <Link to="create">New webhook</Link>
                  </Button>
                </ListActions.Right>
              </ListActions.Root>
              <Spacer size={4.5} />
            </>
          )}

          {webhookLoading ? (
            <SkeletonList />
          ) : (
            <RepoWebhookList
              error={error}
              isDirtyList={isDirtyList}
              webhooks={webhooks || []}
              useTranslationStore={useTranslationStore}
              handleReset={handleResetFiltersQueryAndPages}
              totalPages={totalPages}
              page={page}
              setPage={setPage}
              openDeleteWebhookDialog={openDeleteWebhookDialog}
            />
          )}
        </>
      )}
    </SandboxLayout.Content>
  )
}

export { RepoWebhookListPage }
