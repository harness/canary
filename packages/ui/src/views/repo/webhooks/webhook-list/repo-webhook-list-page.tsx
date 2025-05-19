import { FC, useCallback, useMemo } from 'react'

import { Button, ListActions, SearchInput, SkeletonList, Spacer } from '@/components'
import { useRouterContext } from '@/context'
import { SandboxLayout } from '@/views'

import { RepoWebhookList } from './components/repo-webhook-list'
import { RepoWebhookListPageProps } from './types'

const RepoWebhookListPage: FC<RepoWebhookListPageProps> = ({
  useWebhookStore,
  useTranslationStore,
  openDeleteWebhookDialog,
  searchQuery,
  setSearchQuery,
  webhookLoading,
  handleEnableWebhook,
  toRepoWebhookDetails,
  toRepoWebhookCreate
}) => {
  const { Link } = useRouterContext()
  const { t } = useTranslationStore()
  const { webhooks, totalItems, pageSize, page, setPage, error } = useWebhookStore()

  const handleSearchChange = useCallback(
    (val: string) => {
      setSearchQuery(val.length ? val : null)
    },
    [setSearchQuery]
  )

  const handleResetSearch = () => {
    setSearchQuery('')
  }

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery
  }, [page, searchQuery])

  const handleResetFiltersQueryAndPages = () => {
    handleResetSearch()
    setPage(1)
  }

  return (
    <SandboxLayout.Content className="px-0">
      <h1 className="text-2xl font-medium text-cn-foreground-1">Webhooks</h1>
      <Spacer size={6} />

      {error ? (
        <span className="text-2 text-cn-foreground-danger">{error || 'Something went wrong'}</span>
      ) : (
        <>
          {(!!webhooks?.length || (!webhooks?.length && isDirtyList)) && (
            <>
              <ListActions.Root>
                <ListActions.Left>
                  <SearchInput
                    id="search"
                    size="sm"
                    defaultValue={searchQuery || ''}
                    inputContainerClassName="max-w-96"
                    placeholder={t('views:repos.search', 'Search')}
                    onChange={handleSearchChange}
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
              totalItems={totalItems}
              pageSize={pageSize}
              page={page}
              setPage={setPage}
              openDeleteWebhookDialog={openDeleteWebhookDialog}
              handleEnableWebhook={handleEnableWebhook}
              toRepoWebhookDetails={toRepoWebhookDetails}
              toRepoWebhookCreate={toRepoWebhookCreate}
            />
          )}
        </>
      )}
    </SandboxLayout.Content>
  )
}

export { RepoWebhookListPage }
