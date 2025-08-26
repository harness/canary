import { FC, useCallback, useMemo } from 'react'

import { Button, IconV2, Layout, ListActions, SearchInput, Skeleton, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'

import { RepoWebhookList } from './components/repo-webhook-list'
import { RepoWebhookListPageProps } from './types'

const RepoWebhookListPage: FC<RepoWebhookListPageProps> = ({
  useWebhookStore,
  openDeleteWebhookDialog,
  searchQuery,
  setSearchQuery,
  webhookLoading,
  handleEnableWebhook,
  toRepoWebhookDetails,
  toRepoWebhookCreate
}) => {
  const { t } = useTranslation()
  const { webhooks, totalItems, pageSize, page, setPage, error } = useWebhookStore()

  const { Link } = useRouterContext()

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
    <Layout.Vertical gap="xl" grow>
      <Text as="h1" variant="heading-section">
        Webhooks
      </Text>

      {error ? (
        <Text color="danger">{error || 'Something went wrong'}</Text>
      ) : (
        <Layout.Vertical grow>
          {(!!webhooks?.length || (!webhooks?.length && isDirtyList)) && (
            <ListActions.Root>
              <ListActions.Left>
                <SearchInput
                  id="search"
                  defaultValue={searchQuery || ''}
                  inputContainerClassName="w-80"
                  placeholder={t('views:repos.search', 'Search')}
                  onChange={handleSearchChange}
                />
              </ListActions.Left>
              <ListActions.Right>
                <Button asChild>
                  <Link to="create">
                    <IconV2 name="plus" />
                    {t('views:webhookData.create', 'Create Webhook')}
                  </Link>
                </Button>
              </ListActions.Right>
            </ListActions.Root>
          )}

          {webhookLoading ? (
            <Skeleton.List />
          ) : (
            <RepoWebhookList
              error={error}
              isDirtyList={isDirtyList}
              webhooks={webhooks || []}
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
        </Layout.Vertical>
      )}
    </Layout.Vertical>
  )
}

export { RepoWebhookListPage }
