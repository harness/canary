import { FC } from 'react'

import { Button, Dialog, ListActions, Pagination, SearchInput, Spacer, Text } from '@/components'
import { SandboxLayout } from '@/views'

import { PipelineList } from './pipeline-list'
import { IPipelineListPageProps } from './types'

const PipelineListPage: FC<IPipelineListPageProps> = ({
  usePipelineListStore,
  isLoading,
  isError,
  errorMessage,
  searchQuery,
  setSearchQuery,
  handleCreatePipeline,
  toPipelineDetails
}) => {
  const { pipelines, totalItems, pageSize, page, setPage, setPageSize } = usePipelineListStore()

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
        {pipelines && pipelines.length > 0 && (
          <>
            <Text as="h1" variant="heading-section">
              Pipelines
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
                <Dialog.Trigger>
                  <Button onClick={handleCreatePipeline}>Create pipeline</Button>
                </Dialog.Trigger>
              </ListActions.Right>
            </ListActions.Root>
            <Spacer size={5} />
          </>
        )}
        <PipelineList
          pipelines={pipelines}
          query={searchQuery ?? ''}
          handleResetQuery={handleResetSearch}
          isLoading={isLoading}
          handleCreatePipeline={handleCreatePipeline}
          toPipelineDetails={toPipelineDetails}
        />
        <Spacer size={8} />
        <Pagination
          totalItems={totalItems}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          currentPage={page}
          goToPage={setPage}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { PipelineListPage }
