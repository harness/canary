import { FC } from 'react'

import { Button, ListActions, Pagination, SearchBox, Spacer, Text } from '@/components'
import { useRouterContext } from '@/context'
import { useDebounceSearch } from '@/hooks'
import { SandboxLayout } from '@/views'

import { ExecutionList } from './execution-list'
import { IExecutionListPageProps } from './types'

const ExecutionListPage: FC<IExecutionListPageProps> = ({
  useExecutionListStore,
  useTranslationStore,
  isLoading,
  isError,
  errorMessage,
  searchQuery,
  setSearchQuery,
  handleExecutePipeline,
  LinkComponent
}) => {
  const { Link } = useRouterContext()
  const { t } = useTranslationStore()
  const { executions, totalPages, page, setPage } = useExecutionListStore()

  const {
    search: searchInput,
    handleSearchChange: handleInputChange,
    handleResetSearch
  } = useDebounceSearch({
    handleChangeSearchValue: (val: string) => setSearchQuery(val.length ? val : null),
    searchValue: searchQuery || ''
  })

  if (isError)
    // TODO: improve error handling
    return (
      <>
        <SandboxLayout.Main>
          <SandboxLayout.Content>
            <Spacer size={2} />
            <Text size={1} className="text-cn-foreground-danger">
              {errorMessage || 'Something went wrong'}
            </Text>
          </SandboxLayout.Content>
        </SandboxLayout.Main>
      </>
    )

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <h1 className="text-6 font-medium leading-snug tracking-tight text-cn-foreground-1">Executions</h1>
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
            {/* TODO: two buttons - xd review required */}
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to={`edit`}>Edit</Link>
              </Button>
              <Button variant="default" asChild>
                <Link to={`create`}>Run</Link>
              </Button>
            </div>
          </ListActions.Right>
        </ListActions.Root>
        <Spacer size={4} />
        <ExecutionList
          executions={executions}
          LinkComponent={LinkComponent}
          query={searchQuery ?? ''}
          handleResetQuery={handleResetSearch}
          useTranslationStore={useTranslationStore}
          isLoading={isLoading}
          handleExecutePipeline={handleExecutePipeline}
        />
        <Spacer size={8} />
        <Pagination totalPages={totalPages} currentPage={page} goToPage={setPage} t={t} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { ExecutionListPage }
