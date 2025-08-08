import { FC, useCallback } from 'react'

import { IconV2, Layout, NoData, Pagination, Skeleton, Text } from '@/components'
import { useTranslation } from '@/context'
import { CommitsList, SandboxLayout, TypesCommit } from '@/views'

export interface RepoCommitsViewProps {
  isFetchingCommits: boolean
  commitsList?: TypesCommit[] | null
  xNextPage: number
  xPrevPage: number
  page: number
  setPage: (page: number) => void
  toCommitDetails?: ({ sha }: { sha: string }) => string
  toPullRequest?: ({ pullRequestId }: { pullRequestId: number }) => string
  toCode?: ({ sha }: { sha: string }) => string
  renderProp: () => JSX.Element | null
}

export const RepoCommitsView: FC<RepoCommitsViewProps> = ({
  isFetchingCommits,
  commitsList,
  xNextPage,
  xPrevPage,
  page,
  setPage,
  toCommitDetails,
  toCode,
  renderProp: BranchSelectorContainer,
  toPullRequest
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
        <Layout.Flex direction="column" gapY="xl" className="grow">
          <Text variant="heading-section" as="h2">
            Commits
          </Text>

          <Layout.Flex direction="column" gapY="md" className="grow">
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
                    primaryButton={
                      isDirtyList
                        ? {
                            label: (
                              <>
                                <IconV2 name="trash" />
                                {t('views:noData.clearFilters', 'Clear Filters')}
                              </>
                            ),
                            onClick: handleResetFiltersAndPages
                          }
                        : // TODO: add onClick for Creating new commit
                          {
                            label: (
                              <>
                                <IconV2 name="plus" />
                                {t('views:commits.createNewCommit', 'Create New Commit')}
                              </>
                            )
                          }
                    }
                  />
                )}

                {commitsList?.length && (
                  <CommitsList
                    data={commitsList}
                    toCode={toCode}
                    toCommitDetails={toCommitDetails}
                    toPullRequest={toPullRequest}
                    className="ml-1"
                  />
                )}
              </>
            )}
          </Layout.Flex>

          {commitsList?.length && (
            <Pagination
              className="!mt-0"
              indeterminate
              hasNext={xNextPage > 0}
              hasPrevious={xPrevPage > 0}
              getPrevPageLink={getPrevPageLink}
              getNextPageLink={getNextPageLink}
            />
          )}
        </Layout.Flex>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
