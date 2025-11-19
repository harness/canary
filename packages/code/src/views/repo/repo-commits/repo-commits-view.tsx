import { FC, useCallback } from 'react'

import { CommitsList, SandboxLayout, TypesCommit } from '@/views'

import { Layout, NoData, Pagination, Skeleton, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

interface RoutingProps {
  toCommitDetails?: ({ sha }: { sha: string }) => string
  toPullRequest?: ({ pullRequestId }: { pullRequestId: number }) => string
  toFiles?: () => string
  toCode?: ({ sha }: { sha: string }) => string
}

export interface RepoCommitsViewProps extends Partial<RoutingProps> {
  isFetchingCommits: boolean
  commitsList?: TypesCommit[] | null
  xNextPage: number
  xPrevPage: number
  page: number
  setPage: (page: number) => void
  pageSize?: number
  setPageSize?: (size: number) => void
  renderProp: () => JSX.Element | null
}

export const RepoCommitsView: FC<RepoCommitsViewProps> = ({
  isFetchingCommits,
  commitsList,
  xNextPage,
  xPrevPage,
  page,
  setPage,
  pageSize,
  setPageSize,
  toCommitDetails,
  toCode,
  renderProp: BranchSelectorContainer,
  toPullRequest,
  toFiles
}) => {
  const { t } = useTranslation()

  const isDirtyList = page !== 1

  const handleResetFiltersAndPages = () => {
    setPage(1)
  }

  const getPrevPageLink = useCallback(() => {
    return `?page=${xPrevPage}`
  }, [xPrevPage])

  const getNextPageLink = useCallback(() => {
    return `?page=${xNextPage}`
  }, [xNextPage])

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <Layout.Flex direction="column" gapY="xl" grow>
          <Text variant="heading-section" as="h2">
            Commits
          </Text>

          <Layout.Flex direction="column" gapY="md" grow>
            <div>
              <BranchSelectorContainer />
            </div>

            {isFetchingCommits && <Skeleton.List />}

            {!isFetchingCommits && (
              <>
                {!commitsList?.length && (
                  <NoData
                    withBorder={isDirtyList}
                    textWrapperClassName="max-w-[350px]"
                    imageName={isDirtyList ? 'no-search-magnifying-glass' : 'no-data-commits'}
                    title={
                      isDirtyList
                        ? t('views:noData.noCommitsHistory', 'No commits history')
                        : t('views:noData.noCommitsYet', 'No commits yet')
                    }
                    description={[
                      isDirtyList
                        ? t(
                            'views:noData.noCommitsHistoryDescription',
                            "There isn't any commit history to show here for the selected user, time range, or current page."
                          )
                        : t(
                            'views:noData.noCommitsYetDescription',
                            "Your commits will appear here once they're made. Start committing to see your changes reflected."
                          )
                    ]}
                    secondaryButton={
                      isDirtyList
                        ? {
                            icon: 'trash',
                            label: t('views:noData.clearFilters', 'Clear filters'),
                            onClick: handleResetFiltersAndPages
                          }
                        : // TODO: add onClick for Creating new commit
                          {
                            label: t('views:commits.createCommit', 'Create commit'),
                            /**
                             * To make the first commit, redirect to the files page so a new file can be created.
                             */
                            to: toFiles?.() || '',
                            icon: 'plus'
                          }
                    }
                  />
                )}

                {!!commitsList?.length && (
                  <div>
                    <CommitsList
                      data={commitsList}
                      toCode={toCode}
                      toCommitDetails={toCommitDetails}
                      toPullRequest={toPullRequest}
                      className="ml-cn-3xs"
                    />

                    <Pagination
                      indeterminate
                      currentPage={page}
                      hasNext={xNextPage > 0}
                      hasPrevious={xPrevPage > 0}
                      getPrevPageLink={getPrevPageLink}
                      getNextPageLink={getNextPageLink}
                      pageSize={pageSize}
                      onPageSizeChange={setPageSize}
                    />
                  </div>
                )}
              </>
            )}
          </Layout.Flex>
        </Layout.Flex>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
