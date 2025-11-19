import { FC, useCallback, useMemo } from 'react'

import { NotFoundPage } from '@views/not-found-page'

import { Button, IconV2, Layout, ListActions, NoData, SearchInput, Skeleton, Text } from '@harnessio/ui/components'
import { useRouterContext, useTranslation } from '@harnessio/ui/context'

import { RepoWebhookList } from './components/repo-webhook-list'
import { WebhookStore } from './types'

interface RepoWebhookListPageProps {
  useWebhookStore: () => WebhookStore
  openDeleteWebhookDialog: (id: number) => void
  searchQuery?: string | null
  setSearchQuery: (query: string | null) => void
  webhookLoading: boolean
  handleEnableWebhook: (id: number, enabled: boolean) => void
  toRepoWebhookDetails?: ({ webhookId }: { webhookId: number }) => string
  toRepoWebhookCreate?: () => string
}

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
  const { navigate, Link } = useRouterContext()
  const { webhooks, page, setPage, error } = useWebhookStore()

  const handleSearchChange = useCallback(
    (val: string) => {
      setSearchQuery(val.length ? val : null)
    },
    [setSearchQuery]
  )

  const handleResetSearch = () => {
    setSearchQuery('')
  }

  const isDirtyList = useMemo(() => page !== 1 || !!searchQuery, [page, searchQuery])
  const withTopActions = !!webhooks?.length || (!webhooks?.length && isDirtyList)

  const handleResetFiltersQueryAndPages = () => {
    handleResetSearch()
    setPage(1)
  }

  const handleNavigate = () => {
    if (toRepoWebhookCreate) {
      navigate(toRepoWebhookCreate())
    }
  }

  if (error) {
    return <NotFoundPage errorMessage={error} />
  }

  if (!webhooks?.length && !isDirtyList) {
    return (
      <NoData
        textWrapperClassName="max-w-[350px]"
        imageName={'no-data-webhooks'}
        title={t('views:noData.noWebhooks', 'No webhooks yet')}
        description={[
          t(
            'views:noData.noWebhooksDescription',
            'Add or manage webhooks to automate tasks and connect external services to your project.'
          )
        ]}
        primaryButton={{
          icon: 'plus',
          label: t('views:webhookData.create', 'New Webhook'),
          onClick: handleNavigate
        }}
      />
    )
  }

  return (
    <Layout.Vertical gap="xl" grow>
      <Text as="h1" variant="heading-section">
        {t('views:repos.webhooks', 'Webhooks')}
      </Text>

      <Layout.Vertical grow>
        {withTopActions && (
          <ListActions.Root>
            <ListActions.Left>
              <SearchInput
                id="search"
                defaultValue={searchQuery || ''}
                inputContainerClassName="w-80"
                placeholder={t('views:repos.search', 'Search')}
                onChange={handleSearchChange}
                autoFocus
              />
            </ListActions.Left>
            <ListActions.Right>
              <Button asChild>
                <Link to="create">
                  <IconV2 name="plus" />
                  {t('views:webhookData.create', 'New Webhook')}
                </Link>
              </Button>
            </ListActions.Right>
          </ListActions.Root>
        )}

        {webhookLoading && <Skeleton.List />}

        {!webhooks?.length && isDirtyList ? (
          <NoData
            withBorder
            textWrapperClassName="max-w-[350px]"
            imageName={'no-search-magnifying-glass'}
            title={t('views:noData.noResults', 'No search results')}
            description={[
              t(
                'views:noData.noResultsDescription',
                'No webhooks match your search. Try adjusting your keywords or filters.',
                { type: 'webhooks' }
              )
            ]}
            secondaryButton={{
              icon: 'trash',
              label: t('views:noData.clearSearch', 'Clear Search'),
              onClick: handleResetFiltersQueryAndPages
            }}
          />
        ) : (
          <RepoWebhookList
            useWebhookStore={useWebhookStore}
            openDeleteWebhookDialog={openDeleteWebhookDialog}
            handleEnableWebhook={handleEnableWebhook}
            toRepoWebhookDetails={toRepoWebhookDetails}
          />
        )}
      </Layout.Vertical>
    </Layout.Vertical>
  )
}

export { RepoWebhookListPage }
