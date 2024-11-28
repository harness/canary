import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button, ListActions, SearchBox, Spacer, Text } from '@harnessio/canary'
import { SkeletonList } from '@harnessio/ui/components'

import { SandboxLayout } from '..'
import { NoData } from '../components/no-data'
import { NoSearchResults } from '../components/no-search-results'
import { PaginationComponent } from '../components/pagination'
import { WebhooksList } from '../components/webhook-list'
import { mockWebhooks } from '../data/mockWebhooksData'
import { PlaygroundListSettings } from '../settings/list-settings'

function SandboxRepoWebhooksListPage() {
  const [loadState, setLoadState] = useState('data-loaded')

  const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>

  const renderListContent = () => {
    switch (loadState) {
      case 'data-loaded':
        return <WebhooksList webhooks={mockWebhooks} LinkComponent={LinkComponent} />
      case 'loading':
        return <SkeletonList />
      case 'no-search-matches':
        return (
          <NoSearchResults
            iconName="no-search-magnifying-glass"
            title="No search results"
            description={['Check your spelling and filter options,', 'or search for a different keyword.']}
            primaryButton={{ label: 'Clear search' }}
            secondaryButton={{ label: 'Clear filters' }}
          />
        )
      default:
        return null
    }
  }

  if (loadState == 'no-data') {
    return (
      <>
        <NoData
          insideTabView
          iconName="no-data-webhooks"
          title="No webhooks yet"
          description={['There are no webhooks in this repository yet.', 'Create new or import an existing webhook.']}
          primaryButton={{ label: 'Create webhook' }}
          secondaryButton={{ label: 'Import webhook' }}
        />
        <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
      </>
    )
  }

  return (
    <>
      <SandboxLayout.Main hasHeader hasLeftPanel hasSubHeader>
        <SandboxLayout.Content>
          <Spacer size={2} />
          <Text size={5} weight={'medium'}>
            Webhooks
          </Text>
          <Spacer size={6} />
          <ListActions.Root>
            <ListActions.Left>
              <SearchBox.Root placeholder="Search webhooks" />
            </ListActions.Left>
            <ListActions.Right>
              <Button variant="default" asChild>
                <Link to="/sandbox/repos/drone/webhooks/create">Create webhook</Link>
              </Button>
            </ListActions.Right>
          </ListActions.Root>
          <Spacer size={5} />
          {renderListContent()}
          <Spacer size={8} />
          {loadState == 'data-loaded' && <PaginationComponent totalPages={10} currentPage={5} goToPage={() => {}} />}
        </SandboxLayout.Content>
      </SandboxLayout.Main>
      <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
    </>
  )
}

export default SandboxRepoWebhooksListPage
