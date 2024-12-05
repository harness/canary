import { FC } from 'react'
import { Link } from 'react-router-dom'

import { NoData } from '@components/no-data'
import { noop } from 'lodash-es'

import { SandboxLayout, TranslationStore } from '../..'
import { Button, PaginationComponent, Spacer, Text } from '../../../components/index'
import { PullRequestList as PullRequestListContent } from './pull-request-list'
import { PullRequestStore, PullRequestType, RepoRepositoryOutput } from './types'

export interface PullRequestListProps {
  usePullRequestStore: () => PullRequestStore
  repoId?: string
  spaceId?: string
  repoMetadata?: RepoRepositoryOutput
  useTranslationStore: () => TranslationStore
}

const PullRequestList: FC<PullRequestListProps> = ({
  usePullRequestStore,
  spaceId,
  repoId,
  repoMetadata,
  useTranslationStore
}) => {
  const { pullRequests, totalPages, page, setPage } = usePullRequestStore()
  const { t } = useTranslationStore()

  // const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>

  const renderListContent = () => {
    if (!pullRequests?.length) {
      // if (query) {
      //   return (
      //     // TODO add: empty query state
      //     <NoData
      //       iconName="no-search-magnifying-glass"
      //       title="No search results"
      //       description={['Check your spelling and filter options,', 'or search for a different keyword.']}
      //       primaryButton={{
      //         label: 'Clear search',
      //         onClick: noop
      //       }}
      //       secondaryButton={{
      //         label: 'Clear filters',
      //         onClick: noop
      //       }}
      //     />
      //   )
      // }
      return (
        // TODO add: no data state
        <NoData
          iconName="no-data-folder"
          title="No pull requests yet"
          description={['There are no pull requests in this project yet.', 'Create a new pull request.']}
          primaryButton={{
            label: 'Create pull request',
            onClick: noop
          }}
        />
      )
    }
    return (
      <PullRequestListContent
        handleResetQuery={noop}
        // LinkComponent={LinkComponent}
        pullRequests={pullRequests?.map((item: PullRequestType) => ({
          author: item?.author,
          name: item?.name,
          // TODO: fix review required when its actually there
          reviewRequired: !item?.is_draft,
          merged: item?.merged,
          comments: item?.comments,
          number: item?.number,
          is_draft: item?.is_draft,
          // TODO: add label information to display associated labels for each pull request
          // labels: item?.labels?.map((key: string, color: string) => ({ text: key, color: color })),
          // TODO: fix 2 hours ago in timestamp
          timestamp: item?.timestamp,
          source_branch: item?.source_branch,
          state: item?.state,
          labels: item?.labels?.map((label: { text: string; color: string }) => ({
            text: label?.text || '',
            color: label?.color
          }))
        }))}
        closedPRs={repoMetadata?.num_closed_pulls}
        openPRs={repoMetadata?.num_open_pulls}
      />
    )
  }
  return (
    <SandboxLayout.Main hasHeader hasSubHeader hasLeftPanel>
      <SandboxLayout.Content>
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          Pull Requests
        </Text>
        <Spacer size={6} />
        <div className="flex justify-between gap-5">
          <div className="flex-1">
            {/* TODO: add filter from pixelpoint */}
            {/* <Filter sortOptions={SortOptions} /> */}
          </div>
          <Button variant="default" asChild>
            <Link to={`/spaces/${spaceId}/repos/${repoId}/pull-requests/compare/`}>New pull request</Link>
          </Button>
        </div>
        <Spacer size={5} />
        {renderListContent()}
        <Spacer size={8} />
        <PaginationComponent totalPages={totalPages} currentPage={page} goToPage={setPage} t={t} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
export { PullRequestList }
