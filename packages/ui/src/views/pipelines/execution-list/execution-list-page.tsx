import { FC } from 'react'

import { Button, ListActions, Pagination, SearchInput, Spacer, Text } from '@/components'
import { useRouterContext } from '@/context'
import { SandboxLayout } from '@/views'

import { ExecutionList } from './execution-list'
import { IExecutionListPageProps } from './types'

const ExecutionListPage: FC<IExecutionListPageProps> = ({
  useExecutionListStore,
  isLoading,
  isError,
  errorMessage,
  searchQuery,
  setSearchQuery,
  handleExecutePipeline
}) => {
  const { Link } = useRouterContext()
  const { executions, pageSize, totalItems, page, setPage } = useExecutionListStore()

  const handleSearchChange = (val: string) => setSearchQuery(val.length ? val : null)
  const handleResetSearch = () => setSearchQuery(null)

  if (isError)
    // TODO: improve error handling
    return (
      <>
        <SandboxLayout.Main>
          <SandboxLayout.Content>
            <Spacer size={2} />
            <Text color="danger">{errorMessage || 'Something went wrong'}</Text>
          </SandboxLayout.Content>
        </SandboxLayout.Main>
      </>
    )

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <Text as="h1" variant="heading-section">
          Executions
        </Text>
        <Spacer size={6} />
        <ListActions.Root>
          <ListActions.Left>
            <SearchInput
              inputContainerClassName="max-w-96"
              defaultValue={searchQuery || ''}
              onChange={handleSearchChange}
              autoFocus
            />
          </ListActions.Left>
          <ListActions.Right>
            {/* TODO: two buttons - xd review required */}
            <div className="flex gap-cn-sm">
              <Button variant="outline" asChild>
                <Link to={`edit`}>Edit</Link>
              </Button>
              <Button asChild>
                <Link to={`create`}>Run</Link>
              </Button>
            </div>
          </ListActions.Right>
        </ListActions.Root>
        <Spacer size={4} />
        <ExecutionList
          executions={executions}
          query={searchQuery ?? ''}
          handleResetQuery={handleResetSearch}
          isLoading={isLoading}
          handleExecutePipeline={handleExecutePipeline}
        />
        <Spacer size={8} />
        <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={page} goToPage={setPage} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { ExecutionListPage }
